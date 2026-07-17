/**
 * Single source of truth for the three seeded demo agents shown on
 * /demo, /agents and /leaderboard. Names were previously duplicated as
 * hardcoded maps in each page (and missing in AgentCard itself), which is
 * why names could disappear or diverge between pages.
 *
 * The onchain ReputationObject has no name field (register_agent takes no
 * args), so names are a frontend-level mapping keyed by objectId.
 */
export interface DemoAgentRef {
  name: string;
  address: string; // ReputationObject id (shared object) on Sui testnet
}

// Re-seeded 2026-07-17 via scripts/seed-fresh-demo-agents.mjs: the original
// three (registered back in May) only had 5/5/3 executions each — below the
// real Bronze threshold (10+), so every card showed "Unranked" instead of
// the Gold/Silver/Revoked story the pitch tells. These are fresh
// ReputationObjects, same demo wallet, with enough real recorded executions
// to have genuinely earned each badge onchain (verified via getObjectFields
// before wiring them in — see .suiperpower/pitch-deck.md notes).
export const DEMO_AGENTS: DemoAgentRef[] = [
  { name: 'AlphaTrader', address: '0xfe3cb0c9dd9e147b860034ae9ec5591f10f6a35517e5d2bd6023a9aa86bd1a2a' }, // Gold: 200 execs, 100% success, 1100 SUI volume
  { name: 'BetaBot', address: '0xf0f9bb84452f9e401383a80b25b36b7643d5ee2c548338ad9899f5f7105af8ed' }, // Silver: 60 execs, 98% success
  { name: 'GammaScam', address: '0x32247adc0cb1a5aef74657c1be09f5b87d5effbc6b7ff7fd96fcc929d72377ca' }, // Flagged: 1 failed exec, 550 bps slippage
];

export const AGENT_NAMES: Record<string, string> = Object.fromEntries(
  DEMO_AGENTS.map((a) => [a.address, a.name])
);
