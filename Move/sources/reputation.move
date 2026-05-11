module aegis::reputation;

use sui::object::{UID, new as object_new};
use sui::tx_context::{TxContext, sender as tx_sender, epoch as tx_epoch};
use sui::transfer;
use sui::event::emit;
use std::option::{Option, none, some};

const FLAG_SUCCESS_RATE: u64 = 50;
const FLAG_CONSECUTIVE_FAILURES: u64 = 5;
const FLAG_SLIPPAGE_BPS: u64 = 500;

const MIN_BLOCKS_BETWEEN_EXECUTIONS: u64 = 1;

const E_RATE_LIMITED: u64 = 0x10001;
const E_INVALID_VOLUME: u64 = 0x10002;
const E_INVALID_SLIPPAGE: u64 = 0x10003;

public struct ReputationObject has key, store {
    id: UID,
    agent_id: address,
    total_executions: u64,
    successful_executions: u64,
    failed_executions: u64,
    consecutive_failures: u64,
    total_volume: u64,
    total_slippage: u64,
    uptime_score: u8,
    last_update: u64,
    is_flagged: bool,
    walrus_blob_id: Option<vector<u8>>,
    execution_nonce: u64,
}

public struct ExecutionRecorded has copy, drop {
    agent_id: address,
    success: bool,
    volume: u64,
    slippage: u64,
    nonce: u64,
}

public struct AgentFlagged has copy, drop {
    agent_id: address,
    reason: vector<u8>,
}

public struct AgentUnflagged has copy, drop {
    agent_id: address,
    reason: vector<u8>,
}

public struct AgentRegistered has copy, drop {
    agent_id: address,
}

public entry fun register_agent(ctx: &mut TxContext) {
    let rep = ReputationObject {
        id: object_new(ctx),
        agent_id: tx_sender(ctx),
        total_executions: 0,
        successful_executions: 0,
        failed_executions: 0,
        consecutive_failures: 0,
        total_volume: 0,
        total_slippage: 0,
        uptime_score: 100,
        last_update: 0,
        is_flagged: false,
        walrus_blob_id: none(),
        execution_nonce: 0,
    };
    emit(AgentRegistered {
        agent_id: tx_sender(ctx),
    });
    transfer::share_object(rep);
}

public entry fun record_execution(
    rep: &mut ReputationObject,
    success: bool,
    volume: u64,
    slippage: u64,
    ctx: &mut TxContext
) {
    assert!(volume < 1_000_000_000_000, E_INVALID_VOLUME);
    assert!(slippage < 100_000, E_INVALID_SLIPPAGE);

    let current_epoch = tx_epoch(ctx);
    assert!(
        current_epoch >= rep.last_update + MIN_BLOCKS_BETWEEN_EXECUTIONS,
        E_RATE_LIMITED
    );

    rep.total_executions = rep.total_executions + 1;
    rep.consecutive_failures = if (success) { 0 } else { rep.consecutive_failures + 1 };

    if (success) {
        rep.successful_executions = rep.successful_executions + 1;
    } else {
        rep.failed_executions = rep.failed_executions + 1;
    };

    rep.total_volume = rep.total_volume + volume;
    rep.total_slippage = rep.total_slippage + slippage;
    rep.last_update = current_epoch;
    rep.uptime_score = calculate_score(rep.successful_executions, rep.total_executions);

    check_and_flag(rep, slippage);
    check_and_unflag(rep);

    rep.execution_nonce = rep.execution_nonce + 1;

    emit(ExecutionRecorded {
        agent_id: rep.agent_id,
        success,
        volume,
        slippage,
        nonce: rep.execution_nonce,
    });
}

public fun calculate_score(successful: u64, total: u64): u8 {
    if (total == 0) {
        return 100
    };
    ((successful * 100) / total) as u8
}

fun check_and_flag(rep: &mut ReputationObject, slippage: u64) {
    let success_rate = if (rep.total_executions > 0) {
        (rep.successful_executions * 100) / rep.total_executions
    } else {
        100
    };

    if (success_rate < FLAG_SUCCESS_RATE && !rep.is_flagged) {
        rep.is_flagged = true;
        emit(AgentFlagged {
            agent_id: rep.agent_id,
            reason: b"Low success rate",
        });
    };

    if (rep.consecutive_failures >= FLAG_CONSECUTIVE_FAILURES && !rep.is_flagged) {
        rep.is_flagged = true;
        emit(AgentFlagged {
            agent_id: rep.agent_id,
            reason: b"Too many consecutive failures",
        });
    };

    if (slippage >= FLAG_SLIPPAGE_BPS && !rep.is_flagged) {
        rep.is_flagged = true;
        emit(AgentFlagged {
            agent_id: rep.agent_id,
            reason: b"High slippage detected",
        });
    };
}

const RECOVERY_CONSECUTIVE_SUCCESSES: u64 = 100;
const RECOVERY_MIN_EXECUTIONS: u64 = 200;

fun check_and_unflag(rep: &mut ReputationObject) {
    if (rep.is_flagged) {
        let eligible = rep.consecutive_failures >= RECOVERY_CONSECUTIVE_SUCCESSES
            && rep.total_executions >= RECOVERY_MIN_EXECUTIONS;

        if (eligible) {
            rep.is_flagged = false;
            emit(AgentUnflagged {
                agent_id: rep.agent_id,
                reason: b"Recovery requirements met",
            });
        }
    }
}

public fun update_walrus_blob_id(rep: &mut ReputationObject, blob_id: vector<u8>) {
    rep.walrus_blob_id = some(blob_id);
}

public fun get_score(rep: &ReputationObject): u8 {
    rep.uptime_score
}

public fun is_agent_flagged(rep: &ReputationObject): bool {
    rep.is_flagged
}

public fun get_agent_id(rep: &ReputationObject): address {
    rep.agent_id
}

public fun get_total_volume(rep: &ReputationObject): u64 {
    rep.total_volume
}

public fun get_total_executions(rep: &ReputationObject): u64 {
    rep.total_executions
}

public fun get_successful_executions(rep: &ReputationObject): u64 {
    rep.successful_executions
}

public fun get_walrus_blob_id(rep: &ReputationObject): Option<vector<u8>> {
    rep.walrus_blob_id
}

public fun get_nonce(rep: &ReputationObject): u64 {
    rep.execution_nonce
}

public fun get_metrics(rep: &ReputationObject): (u64, u64, u64, u8, bool) {
    (
        rep.total_executions,
        rep.successful_executions,
        rep.total_volume,
        rep.uptime_score,
        rep.is_flagged,
    )
}

public fun calculate_success_rate(rep: &ReputationObject): u64 {
    if (rep.total_executions == 0) {
        return 100
    };
    (rep.successful_executions * 100) / rep.total_executions
}

public fun is_eligible_for_badge(
    rep: &ReputationObject,
    badge_type: u8
): bool {
    let total = rep.total_executions;
    let success_rate = calculate_success_rate(rep);
    let volume = rep.total_volume;

    if (badge_type == 1) {
        return total >= 10 && success_rate >= 80;
    };
    if (badge_type == 2) {
        return total >= 50 && success_rate >= 90;
    };
    if (badge_type == 3) {
        return total >= 200 && success_rate >= 95 && volume >= 1_000_000;
    };
    false
}