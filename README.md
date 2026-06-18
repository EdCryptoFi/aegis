# Aegis - Agent Reputation Oracle

**Trust is not asked. It's proven. On-chain.**

Aegis is a trust layer for AI agents on Sui that enables verifiable reputation tracking through on-chain metrics and persistent memory via Walrus storage.

## Problem

Autonomous AI agents operate without any verifiable mechanism of trustworthiness. Wallets and users fear delegating funds to unknown agents.

## Solution

1. **On-Chain Reputation**: Verifiable execution metrics stored as a `ReputationObject`
2. **Persistent Memory**: Complete operation history preserved via Walrus blobs
3. **Certifiable Badges**: On-chain registry with auto-revocation for trusted agents (Bronze/Silver/Gold)

## Live Demo

**Testnet Deployed:**
- Package: `0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9`
- BadgeRegistry: `https://suivision.xyz/object/0xd79da82c2490d212b3892a17a0c22c2f6adaed30a412daafb765ad2ec0a448b3`

### Demo Agents

| Agent | Trust | Badge | Score | Status |
|-------|-------|-------|-------|--------|
| AlphaTrader | ✅ HIGH | 🥇 Gold | 100 | Active |
| BetaBot | ⚠️ MEDIUM | 🥈 Silver | 80 | Active |
| GammaScam | ❌ FLAGGED | 🚫 Revoked | 0 | Auto-Revoked |

## Installation

```bash
npm install @aegis/sdk

# or

pnpm add @aegis/sdk
```

## Basic Usage

```typescript
import { createClient } from '@aegis/sdk';

const client = createClient({
  network: 'testnet'
});

// Fetch agent reputation
const agent = await client.getAgentReputation('0x...');
console.log(agent.badge); // 'bronze' | 'silver' | 'gold' | null
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AEGIS ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐         ┌──────────────────┐                  │
│   │  AGENT  │────────►│ ReputationObject │                  │
│   └─────────┘         │   (on-chain)     │                  │
│        │              └────────┬─────────┘                  │
│        │                       │                             │
│        │              ┌────────▼─────────┐                  │
│        │              │   BadgeRegistry   │                  │
│        │              │   (shared object) │                  │
│        │              └────────┬─────────┘                  │
│        │                       │                             │
│        ▼                       ▼                             │
│   ┌─────────────────────────────────────┐                   │
│   │          WALRUS STORAGE             │                   │
│   │     (persistent agent memory)        │                   │
│   └─────────────────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Documentation

| Document | Description |
|----------|-------------|
| [SPEC.md](./SPEC.md) | Full technical specification |
| [KNOWLEDGE.md](./docs/KNOWLEDGE.md) | Sui & Walrus patterns |
| [AGENT_INTEGRATION_GUIDE.md](./docs/AGENT_INTEGRATION_GUIDE.md) | **For agent developers** |
| [AGENT_QUICKSTART.md](./docs/AGENT_QUICKSTART.md) | 5-minute quick start |
| [AGENT_PERFORMANCE.md](./docs/AGENT_PERFORMANCE.md) | Live agent metrics |
| [AGENT_GUIDE.md](./docs/AGENT_GUIDE.md) | Agent creation guide |

## Agent Developer Flow

```
1. Register → get ReputationObject ID
2. Report executions (success/failure with metrics)
3. Earn badge (Bronze/Silver/Gold)
4. ⚠️ Auto-revocation if metrics drop
```

## Badge Requirements

| Badge | Executions | Success Rate | Volume |
|-------|------------|--------------|--------|
| 🥉 Bronze | 10+ | 80%+ | - |
| 🥈 Silver | 50+ | 90%+ | - |
| 🥇 Gold | 200+ | 95%+ | $1M+ |

## Tracks

- **Agentic Web** (Primary): Agent wallet with verifiable reputation
- **Walrus** (Secondary): Persistent cross-session memory

## License

MIT