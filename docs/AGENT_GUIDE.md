# Aegis Agent Creation Guide

## What is Aegis?

Aegis is a **trust layer for AI agents on Sui** that provides:
- **On-chain reputation tracking** - Verifiable execution metrics
- **Persistent memory** - History preserved via Walrus
- **Certifiable badges** - NFT credentials for trusted agents

## Quick Start

### 1. Register Your Agent

Every agent needs a ReputationObject:

```bash
sui client call \
  --package 0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a \
  --module reputation \
  --function register_agent \
  --gas-budget 20000000
```

### 2. Record Executions

After each operation, record the result:

```bash
# Successful execution
sui client call \
  --package 0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a \
  --module reputation \
  --function record_execution \
  --args YOUR_OBJECT_ID true 100000000 50 \
  --gas-budget 20000000

# Failed execution
sui client call \
  --package 0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a \
  --module reputation \
  --function record_execution \
  --args YOUR_OBJECT_ID false 0 0 \
  --gas-budget 20000000
```

**Parameters:**
- `YOUR_OBJECT_ID` - The ReputationObject ID from registration
- `true/false` - Success status
- `100000000` - Volume in MIST (1 SUI = 1,000,000,000 MIST)
- `50` - Slippage in basis points (0.5%)

### 3. Get Your Object ID

```bash
sui client objects --owner all
```

Look for the object with `aegis::reputation::ReputationObject` type.

### 4. Verify Reputation

```bash
sui client object YOUR_OBJECT_ID
```

---

## Demo Agents (Pre-created)

We created 3 demo agents for testing:

| Agent | Address | Score | Status |
|-------|---------|-------|--------|
| **AlphaTrader** | `0x...` | 98% | ✅ High Trust |
| **BetaBot** | `0x...` | 75% | ⚠️ Medium |
| **GammaScam** | `0x...` | 30% | ❌ Flagged |

Run the setup script to create them:
```bash
cd aegis/Agent
npm install @mysten/sui
npx ts-node src/setup-demo-agents.ts
```

---

## Understanding Metrics

### Uptime Score (0-100%)
```
uptime_score = (successful_executions / total_executions) * 100
```

### Automatic Flagging

Your agent gets **flagged** if:
- Success rate drops below 50%
- 5+ consecutive failures
- Single execution with >5% slippage

### Badge Requirements

| Badge | Requirements |
|-------|-------------|
| 🥉 Bronze | 10+ executions, 80%+ success |
| 🥈 Silver | 50+ executions, 90%+ success |
| 🥇 Gold | 200+ executions, 95%+ success, 1M+ SUI volume |

---

## Integration Example (TypeScript)

```typescript
import { SuiClient, getFullNodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID = '0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a';

const client = new SuiClient({ url: getFullNodeUrl('testnet') });

async function registerAgent(signer: any) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::reputation::register_agent`,
    arguments: [],
  });

  return client.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true },
  });
}

async function recordExecution(
  signer: any,
  reputationObjectId: string,
  success: boolean,
  volume: number,
  slippage: number
) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::reputation::record_execution`,
    arguments: [
      tx.object(reputationObjectId),
      tx.pure.bool(success),
      tx.pure.u64(volume),
      tx.pure.u64(slippage),
    ],
  });

  return client.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true },
  });
}

async function getAgentReputation(objectId: string) {
  const obj = await client.getObject({
    id: objectId,
    options: { showContent: true },
  });

  if (obj.data?.content?.dataType === 'moveObject') {
    const f = obj.data.content.fields;
    return {
      totalExecutions: f.total_executions,
      successfulExecutions: f.successful_executions,
      uptimeScore: f.uptime_score,
      isFlagged: f.is_flagged,
    };
  }
  return null;
}
```

---

## Wallet Integration

### For Wallets (Show Agent Trust Level)

```typescript
const reputation = await getAgentReputation(agentAddress);

if (reputation.isFlagged) {
  showWarning('This agent has been flagged');
} else if (reputation.uptimeScore >= 95) {
  showBadge('High Trust Agent');
} else if (reputation.uptimeScore >= 80) {
  showBadge('Medium Trust Agent');
}
```

### For Marketplaces (Block Flagged)

```typescript
if (reputation.isFlagged) {
  throw new Error('Cannot interact with flagged agent');
}
```

### For Users (Before Delegating Funds)

```typescript
const stats = calculateAgentStats(reputation);

if (stats.trustLevel === 'Low') {
  const confirm = await showConfirmDialog(
    `This agent has ${stats.successRate}% success rate. Continue?`
  );
  if (!confirm) return;
}
```

---

## Events to Listen

The contract emits these events:

### ExecutionRecorded
```typescript
{
  agent_id: "0x...",
  success: true,
  volume: 100000000,
  slippage: 50
}
```

### AgentFlagged
```typescript
{
  agent_id: "0x...",
  reason: "Low success rate" | "Too many consecutive failures" | "High slippage detected"
}
```

### AgentRegistered
```typescript
{
  agent_id: "0x..."
}
```

---

## Testing with Sui Client

### Full Test Flow

```bash
# 1. Register
sui client call \
  --package 0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a \
  --module reputation \
  --function register_agent \
  --gas-budget 20000000

# 2. Find your object
sui client objects --owner all

# 3. Record success
sui client call \
  --package 0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a \
  --module reputation \
  --function record_execution \
  --args YOUR_OBJ_ID true 1000000000 100 \
  --gas-budget 20000000

# 4. Record failure
sui client call \
  --package 0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a \
  --module reputation \
  --function record_execution \
  --args YOUR_OBJ_ID false 0 0 \
  --gas-budget 20000000

# 5. Check reputation
sui client object YOUR_OBJ_ID
```

---

## Links

- **Package:** https://suivision.xyz/package/0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a
- **GitHub:** https://github.com/EdCryptoFi/aegis
- **Docs:** https://github.com/EdCryptoFi/aegis/blob/main/docs/AGENT_GUIDE.md

---

*Built for Sui Overflow 2026 Hackathon*
