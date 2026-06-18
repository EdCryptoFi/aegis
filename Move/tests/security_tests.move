#[test_only]
module aegis::security_tests;

use aegis::reputation::{register_agent, record_execution, update_walrus_blob_id, ReputationObject};
use sui::test_scenario;

// Must equal reputation::E_NOT_AUTHORIZED (0x10004). reputation's const is
// module-private, so we match the abort by value here.
const E_NOT_AUTHORIZED: u64 = 0x10004;

// An attacker (a different address) must NOT be able to record executions
// on another agent's shared ReputationObject.
#[test]
#[expected_failure(abort_code = E_NOT_AUTHORIZED, location = aegis::reputation)]
fun attacker_cannot_record_execution() {
    let agent = @0xA;
    let attacker = @0xBAD;
    let mut scenario = test_scenario::begin(agent);

    register_agent(scenario.ctx());

    scenario.next_tx(attacker);
    let mut rep = scenario.take_shared<ReputationObject>();
    // signed by `attacker`, not the agent -> must abort
    record_execution(&mut rep, true, 100000000, 10, scenario.ctx());
    test_scenario::return_shared(rep);

    test_scenario::end(scenario);
}

// An attacker must NOT be able to repoint another agent's Walrus blob id.
#[test]
#[expected_failure(abort_code = E_NOT_AUTHORIZED, location = aegis::reputation)]
fun attacker_cannot_repoint_walrus_blob() {
    let agent = @0xA;
    let attacker = @0xBAD;
    let mut scenario = test_scenario::begin(agent);

    register_agent(scenario.ctx());

    scenario.next_tx(attacker);
    let mut rep = scenario.take_shared<ReputationObject>();
    update_walrus_blob_id(&mut rep, b"malicious-blob", scenario.ctx());
    test_scenario::return_shared(rep);

    test_scenario::end(scenario);
}

// The legitimate agent CAN still record its own execution (no regression).
#[test]
fun agent_can_record_own_execution() {
    let agent = @0xA;
    let mut scenario = test_scenario::begin(agent);

    register_agent(scenario.ctx());

    scenario.next_tx(agent);
    let mut rep = scenario.take_shared<ReputationObject>();
    record_execution(&mut rep, true, 100000000, 10, scenario.ctx());
    test_scenario::return_shared(rep);

    test_scenario::end(scenario);
}
