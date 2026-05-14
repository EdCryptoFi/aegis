module aegis::badge_registry;

use sui::event::emit;
use sui::transfer;
use sui::tx_context::{sender as tx_sender, epoch as tx_epoch};
use sui::table::{Self, Table};
use sui::bcs;
use aegis::reputation::{ ReputationObject, is_eligible_for_badge, is_agent_flagged };

const BADGE_BRONZE: u8 = 1;
const BADGE_SILVER: u8 = 2;
const BADGE_GOLD: u8 = 3;

const BRONZE_MIN_EXECUTIONS: u64 = 10;
const BRONZE_MIN_SUCCESS_RATE: u64 = 80;

const SILVER_MIN_EXECUTIONS: u64 = 50;
const SILVER_MIN_SUCCESS_RATE: u64 = 90;

const GOLD_MIN_EXECUTIONS: u64 = 200;
const GOLD_MIN_SUCCESS_RATE: u64 = 95;
const GOLD_MIN_VOLUME: u64 = 1_000_000;

const BADGE_EXPIRATION_EPOCHS: u64 = 5;  // 5 days (1 epoch ≈ 1 day)

const E_ALREADY_HAS_BADGE: u64 = 0x20001;
const E_HAS_HIGHER_BADGE: u64 = 0x20002;
const E_INVALID_BADGE_TYPE: u64 = 0x20003;
const E_NOT_ELIGIBLE: u64 = 0x20004;


public struct AdminCap has key, store {
    id: UID,
}

public struct BadgeRegistry has key, store {
    id: UID,
    badges: Table<vector<u8>, BadgeEntry>,
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

public struct BadgeExpired has copy, drop {
    agent_id: address,
    badge_type: u8,
    reason: vector<u8>,
}

public entry fun init_registry(ctx: &mut TxContext) {
    let cap = AdminCap { id: object::new(ctx) };
    transfer::transfer(cap, tx_sender(ctx));

    let registry = BadgeRegistry {
        id: object::new(ctx),
        badges: table::new(ctx),
    };
    transfer::share_object(registry);
}

fun badge_key(agent_id: address, badge_type: u8): vector<u8> {
    let mut key = b"badge_";
    vector::append(&mut key, bcs::to_bytes(&agent_id));
    vector::push_back(&mut key, badge_type);
    key
}

public entry fun grant_badge(
    registry: &mut BadgeRegistry,
    _cap: &AdminCap,
    agent_id: address,
    badge_type: u8,
    _ctx: &mut TxContext
) {
    assert!(badge_type >= BADGE_BRONZE && badge_type <= BADGE_GOLD, E_INVALID_BADGE_TYPE);

    let key = badge_key(agent_id, badge_type);
    assert!(!table::contains(&registry.badges, key), E_ALREADY_HAS_BADGE);

    let higher = if (badge_type == BADGE_BRONZE) BADGE_SILVER
        else if (badge_type == BADGE_SILVER) BADGE_GOLD
        else 0;

    if (higher != 0) {
        let higher_key = badge_key(agent_id, higher);
        assert!(!table::contains(&registry.badges, higher_key), E_HAS_HIGHER_BADGE);
    };

    let entry = BadgeEntry {
        agent_id,
        badge_type,
        issued_at: tx_epoch(_ctx),
        is_valid: true,
        revoked_reason: vector[],
    };

    table::add(&mut registry.badges, badge_key(agent_id, badge_type), entry);

    emit(BadgeMinted {
        agent_id,
        badge_type,
    });
}

public entry fun revoke_badge(
    registry: &mut BadgeRegistry,
    _cap: &AdminCap,
    agent_id: address,
    badge_type: u8,
    reason: vector<u8>,
    _ctx: &mut TxContext
) {
    let key = badge_key(agent_id, badge_type);
    assert!(table::contains(&registry.badges, key), E_NOT_ELIGIBLE);

    let entry = table::borrow_mut(&mut registry.badges, key);
    entry.is_valid = false;
    entry.revoked_reason = reason;

    emit(BadgeRevoked {
        agent_id,
        badge_type,
        reason,
    });
}

public entry fun auto_check(
    registry: &mut BadgeRegistry,
    agent_id: address,
    rep: &ReputationObject,
    ctx: &mut TxContext
) {
    auto_check_badge(registry, agent_id, BADGE_BRONZE, rep, ctx);
    auto_check_badge(registry, agent_id, BADGE_SILVER, rep, ctx);
    auto_check_badge(registry, agent_id, BADGE_GOLD, rep, ctx);
}

fun auto_check_badge(
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    rep: &ReputationObject,
    ctx: &mut TxContext
) {
    let key = badge_key(agent_id, badge_type);
    let current_epoch = tx_epoch(ctx);

    if (table::contains(&registry.badges, key)) {
        let entry = table::borrow(&registry.badges, key);
        if (!entry.is_valid) {
            return
        };

        // Check expiration (5 days = 5 epochs)
        let age = current_epoch - entry.issued_at;
        if (age >= BADGE_EXPIRATION_EPOCHS) {
            let entry_mut = table::borrow_mut(&mut registry.badges, key);
            entry_mut.is_valid = false;
            entry_mut.revoked_reason = b"Expired (5 days)";
            emit(BadgeExpired { agent_id, badge_type, reason: b"Expired (5 days)" });
            emit(BadgeRevoked { agent_id, badge_type, reason: b"Expired (5 days)" });
            return
        };

        if (is_agent_flagged(rep)) {
            let entry_mut = table::borrow_mut(&mut registry.badges, key);
            entry_mut.is_valid = false;
            entry_mut.revoked_reason = b"Agent flagged";
            emit(BadgeRevoked { agent_id, badge_type, reason: b"Agent flagged" });
            return
        };

        if (!is_eligible_for_badge(rep, badge_type)) {
            let entry_mut = table::borrow_mut(&mut registry.badges, key);
            entry_mut.is_valid = false;
            entry_mut.revoked_reason = b"Requirements no longer met";
            emit(BadgeRevoked { agent_id, badge_type, reason: b"Requirements no longer met" });
        };
    } else {
        if (!is_eligible_for_badge(rep, badge_type)) {
            return
        };

        let higher = if (badge_type == BADGE_BRONZE) BADGE_SILVER
            else if (badge_type == BADGE_SILVER) BADGE_GOLD
            else 0;

        if (higher != 0) {
            let higher_key = badge_key(agent_id, higher);
            if (table::contains(&registry.badges, higher_key)) {
                return
            };
        };

        let entry = BadgeEntry {
            agent_id,
            badge_type,
            issued_at: tx_epoch(ctx),
            is_valid: true,
            revoked_reason: vector[],
        };

        table::add(&mut registry.badges, key, entry);
        emit(BadgeMinted { agent_id, badge_type });
    };
}

public entry fun check_and_revoke_invalid(
    registry: &mut BadgeRegistry,
    _cap: &AdminCap,
    agent_id: address,
    badge_type: u8,
    total_executions: u64,
    successful_executions: u64,
    total_volume: u64,
    is_flagged: bool,
    _ctx: &mut TxContext
) {
    let key = badge_key(agent_id, badge_type);
    if (!table::contains(&registry.badges, key)) {
        return
    };

    let entry = table::borrow(&registry.badges, key);
    if (!entry.is_valid) {
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
        let entry_mut = table::borrow_mut(&mut registry.badges, key);
        entry_mut.is_valid = false;
        entry_mut.revoked_reason = reason;

        emit(BadgeRevoked {
            agent_id,
            badge_type,
            reason,
        });
    };
}

public fun is_badge_valid_for(
    registry: &BadgeRegistry,
    agent_id: address,
    badge_type: u8
): bool {
    let key = badge_key(agent_id, badge_type);
    if (!table::contains(&registry.badges, key)) {
        return false
    };
    let entry = table::borrow(&registry.badges, key);
    entry.is_valid
}

public fun get_agent_badges(registry: &BadgeRegistry, agent_id: address): vector<BadgeEntry> {
    let mut result = vector[];
    let types = vector[BADGE_BRONZE, BADGE_SILVER, BADGE_GOLD];
    let mut i = 0;
    while (i < 3) {
        let badge_type = *vector::borrow(&types, i);
        let key = badge_key(agent_id, badge_type);
        if (table::contains(&registry.badges, key)) {
            let entry = table::borrow(&registry.badges, key);
            vector::push_back(&mut result, *entry);
        };
        i = i + 1;
    };
    result
}

public fun get_all_valid_badges(registry: &BadgeRegistry): vector<BadgeEntry> {
    let result = vector[];
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

public fun get_expiration_epochs(): u64 {
    BADGE_EXPIRATION_EPOCHS
}
