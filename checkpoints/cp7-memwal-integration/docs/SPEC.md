# Aegis - Agent Reputation Oracle

## Hook (Jobs-style)
"Delegate funds to AI agents with verifiable on-chain trust."

## Tagline
"Agents that remember (MemWal) + Agents you can trust (Aegis) = Autonomous future."

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

## Ecosystem Integrations

Aegis is designed to compose with other Sui primitives:

| Integration | Purpose | Link to Aegis |
|------------|---------|---------------|
| **MemWal** | Private encrypted memory for agents | MemWal blob_id anchored in ReputationObject |
| **DeepBook** | Real execution data | Feeds reputation scores (success, slippage) |
| **Kiosk** | Badge display | NFTs certify agent trustworthiness |

### MemWal Integration (Optional Add-on)

```
┌─────────────────────────────────────────────────────────────┐
│                 Combined Flow                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Agent executes task                                      │
│     ↓                                                         │
│  2. MemWal stores rationale (PRIVATE)                        │
│     - "Why did I make this decision?"                        │
│     - Encrypted, agent-only by default                       │
│     ↓                                                         │
│  3. Aegis records metrics (PUBLIC)                           │
│     - Success/failure, volume, slippage                     │
│     - On-chain, verifiable by anyone                         │
│     ↓                                                         │
│  4. MemWal blob_id linked to ReputationObject               │
│     - Audit trail linkable but content private                │
│     ↓                                                         │
│  5. Wallet queries Aegis                                      │
│     - Sees: "Agent has 95% uptime, 200+ trades"              │
│     - Can verify: "blob_id XXXX links to full audit"          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### MemWal Smart Contract Interface

```move
// In reputation.move
link_memwal_session(rep, session_id, ctx)  // Link MemWal to ReputationObject
get_memwal_session_id(rep) -> Option<vector<u8>>
has_memwal_link(rep) -> bool

// In memwal_adapter.move (separate module)
struct MemWalConfig has key, store {
    memwal_account_id: vector<u8>,
    namespace: String,
    is_active: bool,
}
create_config(memwal_account_id, namespace, ctx)
update_namespace(config, new_namespace, ctx)
deactivate_config(config, ctx)
```

### Why Both?

| Layer | MemWal | Aegis |
|-------|--------|-------|
| **Privacy** | Encrypted, owner-only | Public metrics |
| **Content** | Rationale, decisions, context | Success rate, volume, slippage |
| **Access** | Agent + delegates | Anyone (verifiable) |
| **Purpose** | "Why did you do that?" | "Can I trust you?" |

**Use MemWal**: Agent needs to remember private reasoning between sessions
**Use Aegis**: Third parties need to verify agent trustworthiness

**Want Both?** Anchor MemWal blob_id in Aegis ReputationObject for linked audit trail

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
    memwal_session_id: Option<vector<u8>>,  // MemWal integration (optional)
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

## What Aegis Is NOT

Aegis has clear boundaries to avoid confusion:

| Not... | Explanation |
|--------|------------|
| **Not a mempool** | Aegis doesn't execute trades directly - uses DeepBook |
| **Not a wallet** | Wallet holds funds; Aegis provides trust signals |
| **Not MemWal** | MemWal = private memory; Aegis = public reputation |
| **Not a trading bot** | Agents decide actions; Aegis tracks their quality |
| **Not a guarantee** | Reputation is verifiable trust, not insurance |

### Aegis ≠ MemWal

| Feature | MemWal | Aegis |
|---------|--------|-------|
| **Data type** | Private agent memory | Public execution metrics |
| **Encryption** | End-to-end encrypted | On-chain transparent |
| **Owner** | Agent (and delegates) | Anyone can verify |
| **Purpose** | Remember context | Prove trustworthiness |
| **Content** | Reasoning, decisions, history | Success rate, volume, badges |

**Need both?**: Anchor MemWal blob_id in Aegis for linked audit trail

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
- MemWal Docs: https://docs.memwal.ai/
- MemWal SDK: `@mysten-incubation/memwal`
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
