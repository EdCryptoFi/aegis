#[test_only]
module aegis::reputation_tests;

use aegis::reputation::{
    register_agent, record_execution, get_score, is_agent_flagged,
    get_total_volume, get_total_executions, ReputationObject
};
use sui::test_scenario;

#[test]
fun test_register_agent() {
    let creator = @0xA;
    let mut scenario = test_scenario::begin(creator);

    {
        register_agent(scenario.ctx());
    };

    scenario.next_tx(creator);

    {
        let rep = scenario.take_shared<ReputationObject>();
        assert!(get_total_executions(&rep) == 0, 0);
        assert!(get_score(&rep) == 100, 0);
        test_scenario::return_shared(rep);
    };

    test_scenario::end(scenario);
}

#[test]
fun test_record_successful_execution() {
    let creator = @0xA;
    let mut scenario = test_scenario::begin(creator);

    {
        register_agent(scenario.ctx());
    };

    scenario.next_tx(creator);

    {
        let mut rep = scenario.take_shared<ReputationObject>();
        record_execution(&mut rep, true, 100000000, 10, scenario.ctx());
        assert!(get_total_executions(&rep) == 1, 0);
        assert!(get_score(&rep) == 100, 0);
        test_scenario::return_shared(rep);
    };

    test_scenario::end(scenario);
}

#[test]
fun test_record_failed_execution() {
    let creator = @0xA;
    let mut scenario = test_scenario::begin(creator);

    {
        register_agent(scenario.ctx());
    };

    scenario.next_tx(creator);

    {
        let mut rep = scenario.take_shared<ReputationObject>();
        record_execution(&mut rep, false, 0, 0, scenario.ctx());
        assert!(get_total_executions(&rep) == 1, 0);
        assert!(get_score(&rep) == 0, 0);
        assert!(is_agent_flagged(&rep), 0);
        test_scenario::return_shared(rep);
    };

    test_scenario::end(scenario);
}

#[test]
fun test_volume_tracking() {
    let creator = @0xA;
    let mut scenario = test_scenario::begin(creator);

    {
        register_agent(scenario.ctx());
    };

    scenario.next_tx(creator);

    {
        let mut rep = scenario.take_shared<ReputationObject>();
        record_execution(&mut rep, true, 100000000, 10, scenario.ctx());
        record_execution(&mut rep, true, 200000000, 5, scenario.ctx());
        assert!(get_total_volume(&rep) == 300000000, 0);
        test_scenario::return_shared(rep);
    };

    test_scenario::end(scenario);
}
