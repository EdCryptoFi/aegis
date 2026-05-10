# Aegis - Agent Reputation Oracle

## Hook (Jobs-style)
"Delegate funds to AI agents with verifiable on-chain trust."

## Project Overview

**Aegis** is a trust layer for AI agents on Sui that enables verifiable reputation tracking through on-chain metrics and persistent memory via Walrus storage.

## Problem

Autonomous AI agents operate without any verifiable mechanism of trustworthiness:
- No standardized way to prove quality or reliability
- Memory is isolated per app/model/device → fragile systems
- Wallets and users fear delegating funds to unknown agents

## Solution: Persistent Agent Reputation

### 1. On-Chain Reputation
Verifiable execution metrics (success/failure rate, volume, slippage)

### 2. Persistent Memory (Walrus)
Complete operation history preserved between sessions

### 3. Kiosk Badges
Certifiable NFTs for trusted agents

### 4. Composable Layer
Trust layer for wallets, marketplaces, and protocols

---

## Tracks

| Track | Focus | Key Features |
|-------|-------|--------------|
| **Agentic Web** (Primary) | Agent Wallet | DeepBook orders, self-enforced ceiling, on-chain activity log, owner revocation |
| **Walrus** (Secondary) | Persistent Memory | Cross-session logs, blob_id on-chain, detailed audit trail |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Reputation Oracle                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Agent] ──► [DeepBook Order] ──► [ReputationObject On-chain] │
│                              │                              │
│                              ▼                              │
│                      [Walrus Log]                           │
│                              │                              │
│                              ▼                              │
│                      [Badge NFT (Kiosk)]                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Stack

```
aegis/
├── Move/                      # Smart contracts
│   ├── sources/
│   │   ├── reputation.move     # Core ReputationObject
│   │   ├── badge.move         # Kiosk badge mint/burn
│   │   └── events.move        # On-chain events
│   └── tests/
├── Walrus/                    # Persistent storage
│   ├── src/
│   │   ├── storage.ts         # Walrus blob operations
│   │   └── retrieval.ts      # Blob retrieval + verification
│   └── tests/
├── Frontend/                  # Demo UI
│   └── src/
│       ├── App.tsx            # Dashboard
│       └── AgentCard.tsx      # Agent reputation display
└── Agent/                     # Autonomous agent
    └── src/
        ├── executor.ts        # DeepBook orders
        └── logger.ts          # Metric recording
```

---

## Smart Contracts

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
    last_update: u64,           // epoch
    is_flagged: bool,
    walrus_blob_id: Option<vector<u8>>,
}
```

### Events

```move
struct ExecutionRecorded has copy, drop {
    agent_id: address,
    success: bool,
    volume: u64,
    slippage: u64,
}

struct AgentFlagged has copy, drop {
    agent_id: address,
    reason: String,
}

struct BadgeMinted has copy, drop {
    agent_id: address,
    badge_type: u8,
}
```

### Badge Types

| Badge | Type ID | Requirement |
|-------|---------|-------------|
| Bronze | 1 | 10+ executions, 80%+ success |
| Silver | 2 | 50+ executions, 90%+ success |
| Gold | 3 | 200+ executions, 95%+ success, volume > 1M MIST |

---

## Walrus Integration

### Execution Log Structure

```typescript
interface ExecutionLogEntry {
  execution_id: u64,
  action: string,
  params: string,
  result: string,
  gas_used: u64,
  timestamp: u64,
}

interface AgentLog {
  agent_id: string,
  logs: ExecutionLogEntry[],
  created_at: u64,
  updated_at: u64,
}
```

### Flow

```
1. Agent executes DeepBook order
2. Transaction confirms → ExecutionRecorded event emitted
3. ReputationObject updated on-chain
4. Detailed log sent to Walrus
5. Walrus blob_id saved in ReputationObject
6. Anyone can verify reputation + audit trail
```

---

## API (TypeScript SDK)

### Get Agent Reputation

```typescript
import { getAgentReputation } from '@aegis/sdk';

const rep = await getAgentReputation(agentAddress);
console.log(`Uptime: ${rep.uptime_score}%`);
console.log(`Total Volume: ${rep.total_volume} MIST`);
```

### Get Detailed Logs

```typescript
import { getAgentLogs } from '@aegis/sdk';

const logs = await getAgentLogs(agentAddress);
console.log(`Last execution: ${logs[logs.length - 1].action}`);
```

### Integration Example

```typescript
import { getAgentReputation } from '@aegis/sdk';

const rep = await getAgentReputation(agentAddress);

if (rep.uptime_score < 80) {
  showWarning('Agent uptime below ideal threshold');
}

if (rep.is_flagged) {
  showError('Agent has been flagged for suspicious activity');
}

// Check Walrus for detailed audit trail
const logs = await getAgentLogs(agentAddress);
displayAuditTrail(logs);
```

---

## Metrics & Scoring

### Uptime Score Calculation

```
uptime_score = (successful_executions / total_executions) * 100
```

### Flagging Conditions

| Condition | Threshold |
|-----------|-----------|
| Success rate | < 50% |
| Consecutive failures | > 5 |
| Slippage | > 500 basis points (5%) |
| Suspected manipulation | Manual review |

---

## DeepBook Integration

### Order Execution Flow

```typescript
// Agent executes trade
const orderResult = await agentExecutor.executeTrade({
  pair: 'SUI/USDC',
  side: 'buy',
  amount: 100000000, // 0.1 SUI in MIST
  slippageTolerance: 50, // 0.5%
  maxGas: 10000000, // 0.01 SUI
});

// Record execution
await recordExecution({
  agentId: agentAddress,
  success: orderResult.success,
  volume: orderResult.volume,
  slippage: orderResult.slippage,
});
```

---

## Evaluation Criteria (50/20/20/10)

| Criterion | Weight | Focus | Demonstration |
|-----------|--------|-------|--------------|
| Real Application | 50% | Real pain point, impact | Agent wallet solves trust for fund delegation |
| Technical | 20% | Move, Sui features | PTB, Kiosk, Walrus blob_id |
| UX | 20% | Working demo | ≤5min video showing complete flow |
| Presentation | 10% | Clear pitch | Hook: "Trust is not asked. It's proven. On-chain." |

---

## Timeline

| Phase | Deliverables | Deadline |
|-------|-------------|----------|
| **CP1 (48h)** | SPEC, ReputationObject compiled, DeepBook integration, Loom ≤60s | Day 1-2 |
| **CP2 (Week 3-4)** | Walrus anchor, Badge mint, frontend badge, TypeScript snippet | Day 3-6 |
| **CP3 (Week 5-6)** | Testnet deploy, demo video ≤5min, package docs, Devfolio submission | Day 7-14 |

---

## Resources

- Sui Docs: https://docs.sui.io/
- Walrus Docs: https://docs.wal.app/
- Walrus SDK: https://sdk.mystenlabs.com/walrus
- DeepBook: https://docs.deepbook.tech/
- Suiup: https://github.com/MystenLabs/suiup
- Hackathon: https://overflow.sui.io/
- Registry: https://overflowportal.sui.io

---

## Team

- [ ] Designer/PM
- [ ] Move Developer
- [ ] Frontend Developer
- [ ] Video/Demo

---

*Living document - update as project evolves*
