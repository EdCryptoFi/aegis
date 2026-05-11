module aegis::badge;

use sui::object::{UID, new as object_new, delete as object_delete};
use sui::tx_context::{TxContext, epoch as tx_epoch, sender as tx_sender};
use sui::transfer;
use sui::event::emit;
use aegis::reputation::{
    ReputationObject, get_agent_id, get_total_executions, get_successful_executions, get_total_volume
};

const BADGE_BRONZE: u8 = 1;
const BADGE_SILVER: u8 = 2;
const BADGE_GOLD: u8 = 3;

const BRONZE_MIN_EXECUTIONS: u64 = 10;
const BRONZE_MIN_SUCCESS_RATE: u64 = 80;

const SILVER_MIN_EXECUTIONS: u64 = 50;
const SILVER_MIN_SUCCESS_RATE: u64 = 90;

const GOLD_MIN_EXECUTIONS: u64 = 200;
const GOLD_MIN_SUCCESS_RATE: u64 = 95;
const GOLD_MIN_VOLUME: u64 = 1000000;

public struct Badge has key, store {
    id: UID,
    agent_id: address,
    badge_type: u8,
    issued_at: u64,
    level: vector<u8>,
}

public struct BadgeMinted has copy, drop {
    agent_id: address,
    badge_type: u8,
}

public struct BadgeBurned has copy, drop {
    agent_id: address,
    badge_type: u8,
}

public entry fun mint_badge(
    rep: &mut ReputationObject,
    badge_type: u8,
    _ctx: &mut TxContext
) {
    let can_mint = check_badge_requirements(rep, badge_type);
    assert!(can_mint, 0);

    let level = if (badge_type == BADGE_BRONZE) {
        b"Bronze"
    } else if (badge_type == BADGE_SILVER) {
        b"Silver"
    } else {
        b"Gold"
    };

    let badge = Badge {
        id: object_new(_ctx),
        agent_id: get_agent_id(rep),
        badge_type,
        issued_at: tx_epoch(_ctx),
        level,
    };

    emit(BadgeMinted {
        agent_id: get_agent_id(rep),
        badge_type,
    });

    transfer::transfer(badge, tx_sender(_ctx));
}

fun check_badge_requirements(rep: &ReputationObject, badge_type: u8): bool {
    let total = get_total_executions(rep);
    let successful = get_successful_executions(rep);
    let success_rate = if (total > 0) {
        (successful * 100) / total
    } else {
        0
    };

    if (badge_type == BADGE_BRONZE) {
        return total >= BRONZE_MIN_EXECUTIONS && success_rate >= BRONZE_MIN_SUCCESS_RATE
    };

    if (badge_type == BADGE_SILVER) {
        return total >= SILVER_MIN_EXECUTIONS && success_rate >= SILVER_MIN_SUCCESS_RATE
    };

    if (badge_type == BADGE_GOLD) {
        return total >= GOLD_MIN_EXECUTIONS
            && success_rate >= GOLD_MIN_SUCCESS_RATE
            && get_total_volume(rep) >= GOLD_MIN_VOLUME
    };

    false
}

public entry fun burn_badge(badge: Badge, _ctx: &mut TxContext) {
    let agent = badge.agent_id;
    let badge_type = badge.badge_type;

    emit(BadgeBurned {
        agent_id: agent,
        badge_type,
    });

    let Badge { id, agent_id: _, badge_type: _, issued_at: _, level: _ } = badge;
    object_delete(id);
}

public fun get_badge_type(badge: &Badge): u8 {
    badge.badge_type
}

public fun get_badge_agent(badge: &Badge): address {
    badge.agent_id
}
