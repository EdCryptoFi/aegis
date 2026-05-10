# Aegis - Technical Specification

## Project: Aegis
> Shield of Trust for AI Agents

**Hook**: "Confiança não se pede. Se prova. On-chain."

---

## Overview

Aegis is a composable primitive that provides verifiable on-chain reputation for autonomous AI agents on Sui. It aggregates execution metrics, stores persistent logs on Walrus, and issues certified NFT badges through Kiosk.

---

## Problem

5M+ autonomous AI agents operating in web3, but **ZERO** verifiable on-chain trust mechanisms:
- Nobody wants to delegate funds to unknown agents
- No standard for builders to prove quality
- Agents are stateless and lose context between sessions

---

## Solution

### Core Components

1. **ReputationObject** (Move) - On-chain verifiable metrics
2. **Walrus Storage** - Persistent execution history
3. **Badge Kiosk** - Certified NFT badges
4. **Composable SDK** - Integration for wallets/marketplaces

### Data Flow

```
[Agent] → [DeepBook Order] → [ReputationObject On-chain]
                            → [Walrus Log]
                            → [Badge NFT]
```

---

## Architecture

```
aegis/
├── Move/
│   ├── sources/
│   │   ├── reputation.move    # Core ReputationObject
│   │   ├── metrics.move       # Metrics aggregation
│   │   ├── badge.move         # Kiosk NFT mint/burn
│   │   └── events.move        # On-chain events
│   └── tests/
├── Walrus/
│   └── src/
│       ├── storage.ts         # Walrus blob operations
│       └── retrieval.ts       # Blob retrieval
├── Frontend/
│   └── src/
│       ├── App.tsx            # Dashboard
│       └── AgentCard.tsx      # Agent reputation
└── Agent/
    └── src/
        ├── executor.ts        # DeepBook orders
        └── logger.ts          # Metric recording
```

---

## Data Structures

### ReputationObject

```move
struct ReputationObject has key, store {
    id: UID,
    agent_id: address,
    total_executions: u64,
    successful_executions: u64,
    failed_executions: u64,
    total_volume: u64,           // in MIST
    total_slippage: u64,         // basis points
    uptime_score: u8,            // 0-100
    last_update: u64,            // epoch timestamp
    badges: vector<BadgeType>,
    is_flagged: bool,
    walrus_blob_id: Option<vector<u8>>,
}
```

### BadgeType

```move
struct BadgeType has copy, drop, store {
    badge_id: u8,
    earned_at: u64,
    metadata: String,
}

// Badge IDs
const BADGE_NEWBIE: u8 = 0;        // 0-9 execs
const BADGE_TRUSTED: u8 = 1;        // 10-99 execs, 90%+ success
const BADGE_VETERAN: u8 = 2;       // 100-499 execs, 85%+ success
const BADGE_ELITE: u8 = 3;         // 500+ execs, 80%+ success
const BADGE_FALied: u8 = 99;       // Anomalies detected
```

---

## Events

### ExecutionRecorded
```move
struct ExecutionRecorded has copy, drop {
    agent_id: address,
    execution_id: u64,
    success: bool,
    volume: u64,
    slippage: u64,
    gas_used: u64,
    timestamp: u64,
}
```

### BadgeEarned
```move
struct BadgeEarned has copy, drop {
    agent_id: address,
    badge_type: u8,
    timestamp: u64,
}
```

### AgentFlagged
```move
struct AgentFlagged has copy, drop {
    agent_id: address,
    reason: String,
    timestamp: u64,
}
```

---

## Functions

### Core

| Function | Visibility | Description |
|----------|------------|-------------|
| `register_agent` | entry | Create new ReputationObject |
| `record_execution` | entry | Record execution metrics |
| `get_score` | public | Calculate uptime score |
| `update_metrics` | entry | Batch update metrics |
| `flag_agent` | entry | Mark agent as untrusted |
| `unflag_agent` | entry | Remove flag |

### Badge

| Function | Visibility | Description |
|----------|------------|-------------|
| `mint_badge` | entry | Mint badge NFT to Kiosk |
| `burn_badge` | entry | Burn badge NFT |
| `verify_badge` | public | Check badge ownership |

---

## Metrics Calculation

### Uptime Score (0-100)
```
if total_executions == 0: return 100
score = (successful_executions * 100) / total_executions
```

### Volume-weighted Score
```
if total_volume == 0: return 0
weighted_score = (successful_volume * 100) / total_volume
```

### Slippage Score (0-100)
```
if total_executions == 0: return 100
avg_slippage = total_slippage / total_executions
score = max(0, 100 - avg_slippage)
```

---

## Integration

### TypeScript SDK

```typescript
import { AegisSDK } from '@aegis/sdk';

// Initialize
const aegis = new AegisSDK({
  network: 'testnet',
  packageId: '0x...',
});

// Get agent reputation
const rep = await aegis.getReputation(agentAddress);
console.log(`Score: ${rep.uptime_score}%`);
console.log(`Executions: ${rep.total_executions}`);

// Get agent badges
const badges = await aegis.getBadges(agentAddress);

// Check Walrus logs
const logs = await aegis.getLogs(agentAddress);
```

---

## Security Considerations

1. **Only agent owner can record executions** - Via signer verification
2. **Guardian role for flagging** - Multi-sig or DAO
3. **Kiosk bindings for badges** - Native NFT security
4. **Walrus blob verification** - Hash anchoring

---

## Roadmap

- [x] Core ReputationObject
- [ ] Walrus integration
- [ ] Badge minting
- [ ] Guardian logic
- [ ] TypeScript SDK
- [ ] Frontend demo
- [ ] Deploy testnet

---

## References

- [Sui Docs](https://docs.sui.io/)
- [Walrus Docs](https://docs.wal.app/)
- [DeepBook](https://docs.deepbook.tech/)
- [Kiosk](https://docs.sui.io/guides/kiosk)
