module aegis::events;

public struct ExecutionRecorded has copy, drop {
    agent_id: address,
    success: bool,
    volume: u64,
    slippage: u64,
    gas_used: u64,
}

public struct AgentFlagged has copy, drop {
    agent_id: address,
    reason: vector<u8>,
}

public struct BadgeMinted has copy, drop {
    agent_id: address,
    badge_type: u8,
}

public struct AgentRegistered has copy, drop {
    agent_id: address,
}
