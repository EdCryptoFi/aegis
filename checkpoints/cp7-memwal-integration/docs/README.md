# Aegis - Agent Reputation Oracle

**Trust is not asked. It's proven. On-chain.**

*Agents that remember (MemWal) + Agents you can trust (Aegis) = Autonomous future.*

Aegis is a trust layer for AI agents on Sui that enables verifiable reputation tracking through on-chain metrics and persistent memory via Walrus storage.

## Problem

Autonomous AI agents operate without any verifiable mechanism of trustworthiness. Wallets and users fear delegating funds to unknown agents.

## Solution

1. **On-Chain Reputation**: Verifiable execution metrics stored as a `ReputationObject`
2. **Persistent Memory**: Complete operation history preserved via Walrus blobs
3. **Certifiable Badges**: On-chain registry with auto-revocation for trusted agents (Bronze/Silver/Gold)

## Live Demo

**Testnet Deployed:**
- Package: `0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d`
- BadgeRegistry: `https://suivision.xyz/object/0xd7f704c15109a42a56b74e962745831af33fb05cece15103b928bc7d9bd4adb3`

### Demo Agents

| Agent | Trust | Badge | Score | Status |
|-------|-------|-------|-------|--------|
| AlphaTrader | ✅ HIGH | 🥇 Gold | 100 | Active |
| BetaBot | ⚠️ MEDIUM | 🥈 Silver | 80 | Active |
| GammaScam | ❌ FLAGGED | 🚫 Revoked | 0 | Auto-Revoked |

## Quick Start

### Setup

```bash
# Install Sui CLI
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
suiup install sui@testnet

# Clone repo
git clone https://github.com/EdCryptoFi/aegis.git
cd aegis
```

### Deploy

```bash
cd Move
mv build
mv deploy --network testnet --epochs 50
```

### Integrate Your Agent

```typescript
import { AegisClient } from './Agent/src/index.ts';

const client = new AegisClient({
  network: 'testnet',
  packageId: '0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57'
});

// Register your agent (one-time)
const agentId = await client.register();

// Report executions
await client.recordExecution(agentId, {
  success: true,
  volume: 500000000,  // 0.5 SUI
  slippage: 25        // 0.25% in BPS
});
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

## Ecosystem Integrations

Aegis composes with other Sui primitives:

| Integration | Purpose | Link to Aegis |
|------------|---------|---------------|
| [MemWal](https://docs.memwal.ai/) | Private encrypted memory | MemWal blob_id anchored in ReputationObject |
| [DeepBook](https://docs.deepbook.tech/) | Real execution data | Feeds reputation scores |
| [Kiosk](https://docs.sui.io/) | Badge display | NFTs certify trustworthiness |

### Using MemWal? Anchor to Aegis!

```
Agent execution
    ↓
MemWal stores rationale (PRIVATE) → "Why did I decide this?"
    ↓
Aegis records metrics (PUBLIC) → "Did I succeed?"
    ↓
MemWal blob_id linked to ReputationObject
    ↓
Anyone can verify: "Agent has 95% uptime, blob_id links to full audit"
```

**Aegis ≠ MemWal**: MemWal = private memory; Aegis = public reputation

## License

MIT