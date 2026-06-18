module aegis::badge_registry;

use std::vector;
use sui::object::UID;
use sui::tx_context::{TxContext, epoch as tx_epoch};
use sui::transfer;
use sui::event::emit;
use aegis::reputation::{ReputationObject, get_agent_id, is_eligible_for_badge};

const BADGE_BRONZE: u8 = 1;
const BADGE_SILVER: u8 = 2;
const BADGE_GOLD: u8 = 3;

const BRONZE_MIN_EXECUTIONS: u64 = 10;
const BRONZE_MIN_SUCCESS_RATE: u64 = 80;

const SILVER_MIN_EXECUTIONS: u64 = 50;
const SILVER_MIN_SUCCESS_RATE: u64 = 90;

const GOLD_MIN_EXECUTIONS: u64 = 200;
const GOLD_MIN_SUCCESS_RATE: u64 = 95;
const GOLD_MIN_VOLUME: u64 = 1_000_000_000_000;

const E_ALREADY_HAS_BADGE: u64 = 0x20001;
const E_HAS_HIGHER_BADGE: u64 = 0x20002;
const E_INVALID_BADGE_TYPE: u64 = 0x20003;
const E_NOT_ELIGIBLE: u64 = 0x20004;

public struct AdminCap has key, store {
    id: UID,
}

public struct BadgeRegistry has key {
    id: UID,
    entries: vector<BadgeEntry>,
}

public struct BadgeEntry has copy, drop, store {
    agent_id: address,
    badge_type: u8,
    issued_at: u64,
    is_valid: bool,
    revoked_reason: vector<u8>,
}

public struct BadgeMinted has copy, drop {
    agent_id: address,
    badge_type: u8,
}

public struct BadgeRevoked has copy, drop {
    agent_id: address,
    badge_type: u8,
    reason: vector<u8>,
}

fun init(ctx: &mut TxContext) {
    let cap = AdminCap { id: object::new(ctx) };
    transfer::transfer(cap, ctx.sender());

    let registry = BadgeRegistry {
        id: object::new(ctx),
        entries: vector[],
    };
    transfer::share_object(registry);
}

#[test_only]
public fun init_registry(ctx: &mut TxContext) {
    init(ctx);
}

// Admin-only: manually grant a badge without reputation check.
public entry fun grant_badge(
    _cap: &AdminCap,
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    ctx: &mut TxContext
) {
    grant_badge_internal(registry, agent_id, badge_type, ctx);
}

// Public: grant the highest badge the agent's ReputationObject qualifies for.
public entry fun auto_check(
    registry: &mut BadgeRegistry,
    agent_id: address,
    rep: &ReputationObject,
    ctx: &mut TxContext
) {
    assert!(get_agent_id(rep) == agent_id, E_NOT_ELIGIBLE);

    let badge_type = if (is_eligible_for_badge(rep, BADGE_GOLD)
        && !has_valid_badge_of_type(registry, agent_id, BADGE_GOLD)) {
        BADGE_GOLD
    } else if (is_eligible_for_badge(rep, BADGE_SILVER)
        && !has_valid_badge_of_type(registry, agent_id, BADGE_SILVER)
        && !has_higher_badge(registry, agent_id, BADGE_SILVER)) {
        BADGE_SILVER
    } else if (is_eligible_for_badge(rep, BADGE_BRONZE)
        && !has_valid_badge_of_type(registry, agent_id, BADGE_BRONZE)
        && !has_higher_badge(registry, agent_id, BADGE_BRONZE)) {
        BADGE_BRONZE
    } else {
        return
    };

    grant_badge_internal(registry, agent_id, badge_type, ctx);
}

// Admin-only: revoke a badge with a reason.
public entry fun revoke_badge(
    _cap: &AdminCap,
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    reason: vector<u8>,
    ctx: &mut TxContext
) {
    let mut found = false;
    let mut i = 0;
    let len = vector::length(&registry.entries);

    while (i < len) {
        let entry = vector::borrow(&registry.entries, i);
        if (entry.agent_id == agent_id && entry.badge_type == badge_type && entry.is_valid) {
            found = true;
            break
        };
        i = i + 1;
    };

    assert!(found, E_NOT_ELIGIBLE);

    let entry_mut = vector::borrow_mut(&mut registry.entries, i);
    entry_mut.is_valid = false;
    entry_mut.revoked_reason = reason;

    emit(BadgeRevoked {
        agent_id,
        badge_type,
        reason,
    });
}

// Admin-only: revoke a badge if the agent no longer meets the requirements.
public entry fun check_and_revoke_invalid(
    _cap: &AdminCap,
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    total_executions: u64,
    successful_executions: u64,
    total_volume: u64,
    is_flagged: bool,
    ctx: &mut TxContext
) {
    if (!is_badge_valid_for(registry, agent_id, badge_type)) {
        return
    };

    let success_rate = if (total_executions > 0) {
        (successful_executions * 100) / total_executions
    } else {
        0
    };

    let mut needs_revoke = false;
    let mut reason = b"Unknown";

    if (is_flagged) {
        needs_revoke = true;
        reason = b"Agent flagged";
    };

    if (badge_type == BADGE_BRONZE) {
        if (total_executions < BRONZE_MIN_EXECUTIONS || success_rate < BRONZE_MIN_SUCCESS_RATE) {
            needs_revoke = true;
            reason = b"Requirements not met";
        }
    };

    if (badge_type == BADGE_SILVER) {
        if (total_executions < SILVER_MIN_EXECUTIONS || success_rate < SILVER_MIN_SUCCESS_RATE) {
            needs_revoke = true;
            reason = b"Requirements not met";
        }
    };

    if (badge_type == BADGE_GOLD) {
        if (total_executions < GOLD_MIN_EXECUTIONS || success_rate < GOLD_MIN_SUCCESS_RATE || total_volume < GOLD_MIN_VOLUME) {
            needs_revoke = true;
            reason = b"Requirements not met";
        }
    };

    if (needs_revoke) {
        revoke_entry_internal(registry, agent_id, badge_type, reason, ctx);
    };
}

fun grant_badge_internal(
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    ctx: &mut TxContext
) {
    assert!(badge_type >= BADGE_BRONZE && badge_type <= BADGE_GOLD, E_INVALID_BADGE_TYPE);
    assert!(!has_valid_badge_of_type(registry, agent_id, badge_type), E_ALREADY_HAS_BADGE);
    assert!(!has_higher_badge(registry, agent_id, badge_type), E_HAS_HIGHER_BADGE);

    let entry = BadgeEntry {
        agent_id,
        badge_type,
        issued_at: tx_epoch(ctx),
        is_valid: true,
        revoked_reason: vector[],
    };
    vector::push_back(&mut registry.entries, entry);

    emit(BadgeMinted { agent_id, badge_type });
}

fun revoke_entry_internal(
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    reason: vector<u8>,
    _ctx: &TxContext
) {
    let mut i = 0;
    let len = vector::length(&registry.entries);

    while (i < len) {
        let entry = vector::borrow(&registry.entries, i);
        if (entry.agent_id == agent_id && entry.badge_type == badge_type && entry.is_valid) {
            let entry_mut = vector::borrow_mut(&mut registry.entries, i);
            entry_mut.is_valid = false;
            entry_mut.revoked_reason = reason;

            emit(BadgeRevoked {
                agent_id,
                badge_type,
                reason,
            });
            break
        };
        i = i + 1;
    };
}

public fun is_badge_valid_for(
    registry: &BadgeRegistry,
    agent_id: address,
    badge_type: u8
): bool {
    let mut i = 0;
    let len = vector::length(&registry.entries);

    while (i < len) {
        let entry = vector::borrow(&registry.entries, i);
        if (entry.agent_id == agent_id && entry.badge_type == badge_type && entry.is_valid) {
            return true
        };
        i = i + 1;
    };
    false
}

public fun get_agent_badges(registry: &BadgeRegistry, agent_id: address): vector<BadgeEntry> {
    let mut result = vector[];
    let mut i = 0;
    let len = vector::length(&registry.entries);

    while (i < len) {
        let entry = vector::borrow(&registry.entries, i);
        if (entry.agent_id == agent_id) {
            vector::push_back(&mut result, *entry);
        };
        i = i + 1;
    };
    result
}

public fun get_all_valid_badges(registry: &BadgeRegistry): vector<BadgeEntry> {
    let mut result = vector[];
    let mut i = 0;
    let len = vector::length(&registry.entries);

    while (i < len) {
        let entry = vector::borrow(&registry.entries, i);
        if (entry.is_valid) {
            vector::push_back(&mut result, *entry);
        };
        i = i + 1;
    };
    result
}

public fun get_badge_type_name(badge_type: u8): vector<u8> {
    if (badge_type == BADGE_BRONZE) {
        b"Bronze"
    } else if (badge_type == BADGE_SILVER) {
        b"Silver"
    } else if (badge_type == BADGE_GOLD) {
        b"Gold"
    } else {
        b"Unknown"
    }
}

fun has_valid_badge_of_type(
    registry: &BadgeRegistry,
    agent_id: address,
    badge_type: u8
): bool {
    let mut i = 0;
    let len = vector::length(&registry.entries);

    while (i < len) {
        let entry = vector::borrow(&registry.entries, i);
        if (entry.agent_id == agent_id && entry.badge_type == badge_type && entry.is_valid) {
            return true
        };
        i = i + 1;
    };
    false
}

fun has_higher_badge(
    registry: &BadgeRegistry,
    agent_id: address,
    badge_type: u8
): bool {
    if (badge_type >= BADGE_GOLD) {
        return false
    };

    let higher_badge = if (badge_type == BADGE_BRONZE) BADGE_SILVER else BADGE_GOLD;
    has_valid_badge_of_type(registry, agent_id, higher_badge)
}

public fun get_highest_badge(registry: &BadgeRegistry, agent_id: address): u8 {
    if (is_badge_valid_for(registry, agent_id, BADGE_GOLD)) {
        return BADGE_GOLD
    };
    if (is_badge_valid_for(registry, agent_id, BADGE_SILVER)) {
        return BADGE_SILVER
    };
    if (is_badge_valid_for(registry, agent_id, BADGE_BRONZE)) {
        return BADGE_BRONZE
    };
    0
}
