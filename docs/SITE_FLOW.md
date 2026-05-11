# Aegis - User Site Flow

## 🏠 VISITOR JOURNEY

---

## FLOW 1: Landing Page → Check Agent

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ╔═══════════════════╗                       │
│                    ║      AEGIS        ║                       │
│                    ║  Trust is proven  ║                       │
│                    ║    On-chain.      ║                       │
│                    ╚═══════════════════╝                       │
│                                                                 │
│        "Enter an agent address to check their reputation"       │
│                                                                 │
│        ┌────────────────────────────────────────────┐           │
│        │  0x4cd8be48b4e1e0b1bdf01e93fedeac...      │           │
│        └────────────────────────────────────────────┘           │
│                           [ Check Reputation ]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FLOW 2: Agent Detail Page

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Home                                                 │
│                                                                 │
│                    ╔═══════════════════╗                       │
│                    ║      AEGIS        ║                       │
│                    ╚═══════════════════╝                       │
│                   Agent Reputation Oracle                        │
│                                                                 │
│  Contract: 0x6472bb19be1908b8c948169c5627e625e54419b10138519  │
│                                                                 │
│        ┌─────────────────────────────────────────────┐          │
│        │  Agent Reputation                         │          │
│        │  ┌─────────┐                              │          │
│        │  │  HIGH   │  ← Trust Level Badge         │          │
│        │  └─────────┘                              │          │
│        │                                             │          │
│        │  Uptime Score      │  Success Rate         │          │
│        │       100%        │     100%              │          │
│        │                     │                       │          │
│        │  Total Executions  │  Total Volume        │          │
│        │        5           │   2.5 SUI            │          │
│        │                     │                       │          │
│        │  Avg Slippage      │  Agent ID             │          │
│        │      0.20%        │   0x8c85...edf6c1     │          │
│        │                                             │          │
│        │  🥇 Gold Badge (Valid)                     │          │
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FLOW 3: Agent Not Found

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Home                                                 │
│                                                                 │
│                    ╔═══════════════════╗                       │
│                    ║      AEGIS        ║                       │
│                    ╚═══════════════════╝                       │
│                                                                 │
│        ┌─────────────────────────────────────────────┐          │
│        │  Agent Not Found                            │          │
│        │                                             │          │
│        │  No reputation data available for           │          │
│        │  this agent.                                │          │
│        │                                             │          │
│        │  Object ID: 0x123...                        │          │
│        │                                             │          │
│        │  [ This agent may not be registered        │          │
│        │    with Aegis yet. ]                       │          │
│        └─────────────────────────────────────────────┘          │
│                                                                 │
│        Developer? Register your agent →                        │
│        https://docs.aegis.com/agent-integration                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FLOW 4: Flagged Agent Warning

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Home                                                 │
│                                                                 │
│                    ╔═══════════════════╗                       │
│                    ║      AEGIS        ║                       │
│                    ╚═══════════════════╝                       │
│                                                                 │
│        ┌─────────────────────────────────────────────┐          │
│        │  Agent Reputation                         │          │
│        │  ┌─────────┐                              │          │
│        │  │ FLAGGED │  ← RED WARNING BADGE          │          │
│        │  └─────────┘                              │          │
│        │                                             │          │
│        │  Uptime Score      │  Success Rate         │          │
│        │        0%          │      0%              │          │
│        │                     │                       │          │
│        │  Total Executions  │  Total Volume        │          │
│        │        3           │   0 SUI              │          │
│        │                     │                       │          │
│        │  ⚠️ This agent has been flagged for       │          │
│        │     suspicious activity.                 │          │
│        │                                             │          │
│        │  🚫 Badge: REVOKED                         │          │
│        │                                             │          │
│        └─────────────────────────────────────────────┘          │
│                                                                 │
│        ⚠️ WARNING: This agent shows suspicious patterns.        │
│           Do not trust this agent with funds.                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## DEVELOPER FLOW

## FLOW 5: Developer Registers Agent

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  STEP 1: Developer runs SDK command                            │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  const agent = await aegis.registerAgent();                   │
│  // Returns: { digest, objectId }                             │
│  // objectId: 0xabc123...                                       │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  STEP 2: Transaction confirmed on-chain                        │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  Tx: 0xdef456...                                               │
│  Status: Success                                                │
│  Created: ReputationObject (0xabc123...)                       │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  STEP 3: Agent appears on-chain                                │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  Agent ID:    0x8c85...edf6c1 (your wallet)                     │
│  Executions:  0                                                 │
│  Uptime:      100%                                              │
│  Flagged:     No                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FLOW 6: Agent Reports Execution

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Agent executes task → reports to Aegis                        │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  ┌─────────────────────────────────────────────┐              │
│  │ aegis.recordExecution({                      │              │
│  │   success: true,                            │              │
│  │   volume: 1000000000,  // 1 SUI            │              │
│  │   slippage: 50         // 0.5%             │              │
│  │ })                                          │              │
│  └─────────────────────────────────────────────┘              │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  Contract validates:                                            │
│  ✓ Rate limit (1 block since last call)                        │
│  ✓ Volume < 1 trillion                                         │
│  ✓ Slippage < 100,000 BPS                                      │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  On-chain update:                                               │
│  ─────────────────────────────────────────────                  │
│  Total Executions:  1                                          │
│  Successful:        1                                          │
│  Success Rate:      100%                                      │
│  Uptime Score:      100                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FLOW 7: Earning a Badge

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Agent performs 10+ executions with 80%+ success rate          │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  Executions: 10  │  Success: 9  │  Rate: 90%                   │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  Agent requests Bronze Badge                                    │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  ┌─────────────────────────────────────────────┐              │
│  │ grant_badge({                               │              │
│  │   agent_id: 0x8c85...,                      │              │
│  │   badge_type: 1  // Bronze                  │              │
│  │ })                                          │              │
│  └─────────────────────────────────────────────┘              │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  BadgeRegistry checks:                                          │
│  ✓ No duplicate badge of same type                              │
│  ✓ No higher badge exists                                       │
│  ✓ Agent meets requirements                                    │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  Badge granted!                                                  │
│  ─────────────────────────────────────────────                  │
│  🥉 Bronze Badge added to BadgeRegistry                         │
│  BadgeMinted event emitted                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FLOW 8: Auto-Revocation (Badge Lost)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Agent starts failing...                                        │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  After 5 consecutive failures:                                  │
│  ┌─────────────────────────────────────────────┐              │
│  │ is_flagged = true                             │              │
│  │ consecutive_failures = 5                      │              │
│  │ Reason: "Too many consecutive failures"      │              │
│  └─────────────────────────────────────────────┘              │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  Anyone can call check_and_revoke_invalid()                     │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  Registry checks:                                               │
│  ✗ Agent is flagged → REVOKE                                    │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  Badge revoked automatically                                    │
│  ─────────────────────────────────────────────                  │
│  🚫 Bronze Badge: REVOKED                                       │
│  Reason: "Agent flagged"                                        │
│  BadgeRevoked event emitted                                    │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  Frontend shows warning!                                       │
│  ─────────────────────────────────────────────                  │
│  ⚠️ "This agent has been flagged"                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## FLOW 9: Flag Recovery

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Agent was flagged, but can recover                             │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  Requirements to unflag:                                       │
│  • 100+ consecutive successful executions                      │
│  • 200+ total executions                                        │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  After meeting requirements...                                  │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  Agent records execution (success #100)                         │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  check_and_unflag() triggers                                    │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│  if (consecutive_failures >= 100 && total_executions >= 200) {  │
│    is_flagged = false;                                         │
│    emit(AgentUnflagged);                                        │
│  }                                                             │
│                                                                 │
│                              ↓                                  │
│                                                                 │
│  Agent recovered!                                               │
│  ─────────────────────────────────────────────                  │
│  ✓ is_flagged = false                                          │
│  ✓ Can earn new badge                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## SUMMARY: All User Flows

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AEGIS SITE FLOWS                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐                                                       │
│  │  VISITOR   │                                                       │
│  └─────┬─────┘                                                       │
│        │                                                              │
│        ▼                                                              │
│  ┌─────────────────────────────┐                                     │
│  │ 1. Landing Page             │                                     │
│  │    Enter agent address      │                                     │
│  └─────┬───────────────────────┘                                     │
│        │                                                              │
│        ▼                                                              │
│  ┌─────────────────────────────┐                                     │
│  │ 2. Agent Detail Page         │                                     │
│  │    View reputation metrics  │                                     │
│  │    See badge status         │                                     │
│  │    Check if flagged ⚠️     │                                     │
│  └─────────────────────────────┘                                     │
│                                                                         │
│  ┌─────────────┐                                                       │
│  │  DEVELOPER │                                                       │
│  └─────┬─────┘                                                       │
│        │                                                              │
│        ▼                                                              │
│  ┌─────────────────────────────┐                                     │
│  │ 1. Register Agent           │                                     │
│  │    Get ReputationObject ID │                                     │
│  └─────┬───────────────────────┘                                     │
│        │                                                              │
│        ▼                                                              │
│  ┌─────────────────────────────┐                                     │
│  │ 2. Record Executions        │                                     │
│  │    After each task         │                                     │
│  └─────┬───────────────────────┘                                     │
│        │                                                              │
│        ▼                                                              │
│  ┌─────────────────────────────┐                                     │
│  │ 3. Earn Badge              │                                     │
│  │    Bronze/Silver/Gold      │                                     │
│  └─────┬───────────────────────┘                                     │
│        │                                                              │
│        ▼                                                              │
│  ┌─────────────────────────────┐                                     │
│  │ 4. Maintain Reputation    │                                     │
│  │    Stay above thresholds  │                                     │
│  └─────────────────────────────┘                                     │
│                                                                         │
│  ┌─────────────────────────┐                                         │
│  │     AUTO-SYSTEM         │                                         │
│  └───────────┬─────────────┘                                         │
│              │                                                        │
│              ▼                                                        │
│  ┌─────────────────────────────────────────────┐                    │
│  │ • Auto-flag on 5+ consecutive failures      │                    │
│  │ • Auto-flag on <50% success rate            │                    │
│  │ • Auto-flag on >500 BPS slippage           │                    │
│  │ • Auto-revoke badge if flagged              │                    │
│  │ • Recovery after 100 consecutive successes │                    │
│  └─────────────────────────────────────────────┘                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Badge Tiers

```
┌─────────────────────────────────────────────────────────────────┐
│                    AEGIS BADGE SYSTEM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🥉 BRONZE                                                     │
│  ├── 10+ executions                                            │
│  ├── 80%+ success rate                                         │
│  └── Volume: any                                               │
│                                                                 │
│  🥈 SILVER                                                     │
│  ├── 50+ executions                                            │
│  ├── 90%+ success rate                                         │
│  └── Volume: any                                               │
│                                                                 │
│  🥇 GOLD                                                       │
│  ├── 200+ executions                                           │
│  ├── 95%+ success rate                                         │
│  └── Volume: $1M+ (1,000,000 SUI)                             │
│                                                                 │
│  ⚠️ Auto-revoke conditions:                                     │
│  ├── Success rate drops below threshold                        │
│  ├── Agent flagged for suspicious activity                    │
│  ├── 5+ consecutive failures                                  │
│  └── >500 BPS slippage detected                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```