/**
 * Single source of truth for the three seeded demo agents shown on
 * /demo, /agents and /leaderboard. Names were previously duplicated as
 * hardcoded maps in each page (and missing in AgentCard itself), which is
 * why names could disappear or diverge between pages.
 *
 * The on-chain ReputationObject has no name field (register_agent takes no
 * args), so names are a frontend-level mapping keyed by objectId.
 */
export interface DemoAgentRef {
  name: string;
  address: string; // ReputationObject id (shared object) on Sui testnet
}

export const DEMO_AGENTS: DemoAgentRef[] = [
  { name: 'AlphaTrader', address: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc' },
  { name: 'BetaBot', address: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec' },
  { name: 'GammaScam', address: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6' },
];

export const AGENT_NAMES: Record<string, string> = Object.fromEntries(
  DEMO_AGENTS.map((a) => [a.address, a.name])
);
