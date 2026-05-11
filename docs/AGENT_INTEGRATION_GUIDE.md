# Aegis Agent Developer Guide

## Overview

Aegis is a decentralized reputation oracle for AI agents on Sui. This guide explains how to:
1. Register your agent with Aegis
2. Submit execution reports for evaluation
3. Earn reputation and badges
4. Integrate with the on-chain registry

---

## Prerequisites

- Sui wallet with some SUI for gas
- A deployed AI agent (any framework)
- Access to a Sui fullnode RPC

---

## Agent Registration

### Step 1: Initialize Your Agent

Before on-chain registration, prepare your agent metadata:

```json
{
  "name": "YourAgentName",
  "version": "1.0.0",
  "capabilities": ["trading", "analysis", "execution"],
  "endpoint": "https://your-agent-api.com",
  "description": "AI agent for..."
}
```

### Step 2: Register on Aegis

Call `register_agent()` from your backend or script:

```bash
# Get package ID and BadgeRegistry from Aegis docs
PACKAGE_ID="0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57"
BADGE_REGISTRY="0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8"

# Register your agent
sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function register_agent \
  --gas-budget 20000000
```

The transaction returns a `ReputationObject` ID. **Save this ID** - it's your agent's on-chain identity.

### Step 3: Store Agent Metadata

Option A: Store on Walrus (recommended for large metadata)
```bash
# Upload your agent metadata to Walrus
# Get the blob_id and update your ReputationObject
sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function update_walrus_blob_id \
  --args <REPUTATION_OBJECT_ID> <BLOB_ID> \
  --gas-budget 10000000
```

Option B: Keep metadata off-chain and reference via events.

---

## Submitting Execution Reports

After each agent action, submit a report:

```bash
# Record successful execution
sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function record_execution \
  --args <REPUTATION_OBJECT_ID> true <VOLUME> <SLIPPAGE_BPS> \
  --gas-budget 20000000

# Record failed execution
sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function record_execution \
  --args <REPUTATION_OBJECT_ID> false 0 0 \
  --gas-budget 20000000
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `REPUTATION_OBJECT_ID` | address | Your agent's on-chain ID |
| `success` | bool | true = success, false = failure |
| `VOLUME` | u64 | Transaction volume in smallest unit |
| `SLIPPAGE_BPS` | u64 | Slippage in basis points (e.g., 50 = 0.5%) |

---

## SDK Integration (TypeScript)

```typescript
import { AegisClient } from '@aegis/sdk';

const client = new AegisClient({
  network: 'testnet',
  packageId: '0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57',
  wallet: yourWallet
});

// Register agent
const reputationObject = await client.registerAgent();

// Report execution
await client.recordExecution(reputationObject, {
  success: true,
  volume: 500000000,  // $500 in SUI
  slippageBps: 20     // 0.2%
});
```

---

## Badge System

Aegis awards badges based on performance:

| Badge | Requirements | Threshold |
|-------|-------------|-----------|
| 🥉 Bronze | ≥10 executions, ≥80% success | Basic trust |
| 🥈 Silver | ≥50 executions, ≥90% success | Verified |
| 🥇 Gold | ≥200 executions, ≥95% success, $1M+ volume | Trusted |

### Apply for Badge

```bash
sui client call \
  --package $PACKAGE_ID \
  --module badge_registry \
  --function grant_badge \
  --args $BADGE_REGISTRY <AGENT_ADDRESS> <BADGE_TYPE> \
  --gas-budget 20000000

# Badge types: 1=Bronze, 2=Silver, 3=Gold
```

### Auto-Revocation

Badges are **automatically revoked** if:
- Agent success rate drops below threshold
- Agent is flagged for malicious behavior (high slippage, consecutive failures)
- Badge requirements are no longer met

---

## Agent Monitoring

### Query Agent Stats

```bash
# Get agent metrics
sui client view-object <REPUTATION_OBJECT_ID>

# Query BadgeRegistry for valid badges
sui client call \
  --package $PACKAGE_ID \
  --module badge_registry \
  --function get_all_valid_badges \
  --args $BADGE_REGISTRY \
  --gas-budget 5000000
```

### Dashboard Integration

Point your frontend to the BadgeRegistry object to display:
- All registered agents
- Badge status (valid/revoked)
- Trust scores

---

## Webhook Integration

For real-time updates, subscribe to events:

```
0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57::reputation::AgentRegistered
0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57::reputation::ExecutionRecorded
0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57::reputation::AgentFlagged
0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57::badge_registry::BadgeMinted
0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57::badge_registry::BadgeRevoked
```

---

## Best Practices

### For Agent Developers

1. **Report every execution** - even failures build trust
2. **Keep slippage low** - >500 BPS triggers flags
3. **Maintain consistency** - consecutive failures trigger auto-revocation
4. **Use Walrus for metadata** - reduces on-chain storage costs

### Security Considerations

- Store your wallet keys securely (use hardware wallet for production)
- Implement rate limiting on execution reporting
- Monitor your agent's reputation score

---

## Example: Python Agent Integration

```python
from aegis import AegisAgent

agent = AegisAgent(
    wallet_path="~/.sui/sui_config/sui.keystore",
    network="testnet"
)

# Register
rep_id = agent.register()

# Run your AI logic...
result = await your_ai.execute(task)

# Report to Aegis
agent.report_execution(
    rep_id=rep_id,
    success=result.success,
    volume=result.volume,
    slippage_bps=result.slippage
)
```

---

## Troubleshooting

### "Could not resolve function"
- Check function name spelling
- Verify module exists in package

### Transaction fails
- Ensure sufficient SUI balance for gas
- Check object IDs are valid

### Badge not showing
- Verify BadgeRegistry is initialized
- Check badge requirements met

---

## Support

- GitHub: https://github.com/EdCryptoFi/aegis
- Discord: [Aegis Channel]
- Documentation: /docs

---

## Contract Addresses

| Resource | Address |
|----------|---------|
| Package | `0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57` |
| BadgeRegistry | `0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8` |
| Network | testnet |