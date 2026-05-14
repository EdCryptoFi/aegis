#[test_only]
module aegis::badge_registry_tests;

use aegis::reputation::{ register_agent, record_execution, ReputationObject };
use aegis::badge_registry::{ init_registry, auto_check, is_badge_valid_for, get_highest_badge, BadgeRegistry, AdminCap };
use sui::test_scenario;

#[test]
fun test_auto_grant_bronze() {
    let admin = @0xA;
    let mut scenario = test_scenario::begin(admin);

    init_registry(scenario.ctx());
    register_agent(scenario.ctx());

    scenario.next_tx(admin);

    let mut rep = scenario.take_shared<ReputationObject>();
    let mut registry = scenario.take_shared<BadgeRegistry>();

    record_execution(&mut rep, true, 100000000, 10, scenario.ctx());
    record_execution(&mut rep, true, 200000000, 5, scenario.ctx());
    record_execution(&mut rep, true, 300000000, 8, scenario.ctx());
    record_execution(&mut rep, true, 400000000, 12, scenario.ctx());
    record_execution(&mut rep, true, 500000000, 3, scenario.ctx());
    record_execution(&mut rep, true, 600000000, 7, scenario.ctx());
    record_execution(&mut rep, true, 700000000, 9, scenario.ctx());
    record_execution(&mut rep, true, 800000000, 4, scenario.ctx());
    record_execution(&mut rep, true, 900000000, 6, scenario.ctx());
    record_execution(&mut rep, true, 100000000, 2, scenario.ctx());

    auto_check(&mut registry, admin, &rep, scenario.ctx());

    assert!(is_badge_valid_for(&registry, admin, 1), 0);
    assert!(get_highest_badge(&registry, admin) == 1, 0);

    test_scenario::return_shared(rep);
    test_scenario::return_shared(registry);

    test_scenario::end(scenario);
}

#[test]
fun test_no_badge_without_executions() {
    let admin = @0xA;
    let mut scenario = test_scenario::begin(admin);

    init_registry(scenario.ctx());
    register_agent(scenario.ctx());

    scenario.next_tx(admin);

    let rep = scenario.take_shared<ReputationObject>();
    let mut registry = scenario.take_shared<BadgeRegistry>();

    auto_check(&mut registry, admin, &rep, scenario.ctx());

    assert!(!is_badge_valid_for(&registry, admin, 1), 0);
    assert!(get_highest_badge(&registry, admin) == 0, 0);

    test_scenario::return_shared(rep);
    test_scenario::return_shared(registry);

    test_scenario::end(scenario);
}
