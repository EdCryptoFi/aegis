module aegis::memwal_adapter;

use sui::object::{UID, new as object_new};
use sui::tx_context::{TxContext, sender as tx_sender};
use sui::transfer;
use sui::event::emit;
use std::string::{String, utf8};

const E_INVALID_SESSION: u64 = 0x20001;

public struct MemWalConfig has key, store {
    id: UID,
    agent_id: address,
    memwal_account_id: vector<u8>,
    namespace: String,
    is_active: bool,
}

public struct MemWalLinked has copy, drop {
    agent_id: address,
    memwal_account_id: vector<u8>,
    namespace: String,
}

public struct MemWalUnlinked has copy, drop {
    agent_id: address,
}

public entry fun create_config(
    memwal_account_id: vector<u8>,
    namespace: vector<u8>,
    ctx: &mut TxContext
) {
    let config = MemWalConfig {
        id: object_new(ctx),
        agent_id: tx_sender(ctx),
        memwal_account_id,
        namespace: utf8(namespace),
        is_active: true,
    };
    emit(MemWalLinked {
        agent_id: tx_sender(ctx),
        memwal_account_id: config.memwal_account_id,
        namespace: config.namespace,
    });
    transfer::transfer(config, tx_sender(ctx));
}

public entry fun update_namespace(
    config: &mut MemWalConfig,
    new_namespace: vector<u8>,
    ctx: &mut TxContext
) {
    assert!(config.agent_id == tx_sender(ctx), 0);
    config.namespace = utf8(new_namespace);
}

public entry fun deactivate_config(
    config: &mut MemWalConfig,
    ctx: &mut TxContext
) {
    assert!(config.agent_id == tx_sender(ctx), 0);
    config.is_active = false;
    emit(MemWalUnlinked {
        agent_id: config.agent_id,
    });
}

public fun get_memwal_account(config: &MemWalConfig): vector<u8> {
    config.memwal_account_id
}

public fun is_active(config: &MemWalConfig): bool {
    config.is_active
}

public fun get_namespace(config: &MemWalConfig): String {
    config.namespace
}