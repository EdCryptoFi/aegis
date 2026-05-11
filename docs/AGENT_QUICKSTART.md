# Aegis - Quick Start for Agent Developers

## Deploy Your Agent in 5 Minutes

```
┌─────────────────────────────────────────────────────────────────┐
│                     AEGIS AGENT FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐    register_agent()    ┌──────────────────┐      │
│   │  YOU    │ ──────────────────────►│ ReputationObject │      │
│   └─────────┘                        │ (on-chain ID)    │      │
│                                       └────────┬─────────┘      │
│                                                │                 │
│                                                ▼                 │
│   ┌─────────┐    record_execution()    ┌──────────────────┐      │
│   │  YOUR   │ ──────────────────────►│  Trust Score     │      │
│   │  AGENT  │    (after each task)    │  Updates         │      │
│   └─────────┘                         └────────┬─────────┘      │
│                                                │                 │
│                                                ▼                 │
│                                       ┌──────────────────┐      │
│                                       │  BadgeRegistry   │      │
│                                       │  (auto-revoke)   │      │
│                                       └──────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Get Your ReputationObject ID

```bash
# Run once - save the returned Object ID
sui client call \
  --package 0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57 \
  --module reputation \
  --function register_agent \
  --gas-budget 20000000

# Output shows: ObjectID: 0x... (THIS IS YOUR AGENT ID)
```

---

## Step 2: Report Your Executions

After each task your agent completes:

```bash
# SUCCESS - high trust
sui client call \
  --package 0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57 \
  --module reputation \
  --function record_execution \
  --args <YOUR_OBJECT_ID> true <VOLUME> <SLIPPAGE_BPS> \
  --gas-budget 20000000

# FAILURE - still tracked
sui client call \
  --package 0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57 \
  --module reputation \
  --function record_execution \
  --args <YOUR_OBJECT_ID> false 0 0 \
  --gas-budget 20000000
```

---

## Step 3: Earn Badges

| Badge | Need |
|-------|------|
| 🥉 Bronze | 10+ tasks, 80%+ success |
| 🥈 Silver | 50+ tasks, 90%+ success |
| 🥇 Gold | 200+ tasks, 95%+ success, $1M volume |

```bash
# Request badge from BadgeRegistry
sui client call \
  --package 0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57 \
  --module badge_registry \
  --function grant_badge \
  --args 0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8 <YOUR_ADDRESS> <BADGE_TYPE> \
  --gas-budget 20000000
```

---

## Step 4: Monitor Your Reputation

```bash
# View your agent's on-chain data
sui client object <YOUR_OBJECT_ID>

# Check badge status
sui client object 0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8
```

---

## Important: Auto-Revocation Rules

```
⚠️  Your badge will be AUTO-REVOKED if:
    • Success rate drops below badge threshold
    • High slippage detected (>500 BPS)
    • Too many consecutive failures (>5)

💡 Tip: Report ALL executions (success + failure)
         This builds trust over time!
```

---

## Code Example (TypeScript)

```typescript
import { AegisClient } from '@aegis/sdk';

const aegis = new AegisClient({
  network: 'testnet',
  packageId: '0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57'
});

async function main() {
  // Register once
  const agentId = await aegis.register();
  console.log('Agent ID:', agentId);

  // After each task...
  await aegis.report({
    agentId,
    success: true,
    volume: 1000000,  // $1,000 SUI
    slippage: 25     // 0.25%
  });
}
```

---

## Resources

- **Package**: `0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57`
- **BadgeRegistry**: `0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8`
- **Explorer**: https://suivision.xyz/object/0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8
- **SDK Docs**: /Agent