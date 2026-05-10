# Aegis - Agent Reputation Oracle

**Trust is not asked. It's proven. On-chain.**

Aegis is a trust layer for AI agents on Sui that enables verifiable reputation tracking through on-chain metrics and persistent memory via Walrus storage.

## Problem

Autonomous AI agents operate without any verifiable mechanism of trustworthiness. Wallets and users fear delegating funds to unknown agents.

## Solution

1. **On-Chain Reputation**: Verifiable execution metrics stored as a `ReputationObject`
2. **Persistent Memory**: Complete operation history preserved via Walrus blobs
3. **Certifiable Badges**: Kiosk NFTs for trusted agents (Bronze/Silver/Gold)

## Quick Start

### Setup

```bash
# Install Sui CLI
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
suiup install sui@testnet

# Clone repo
git clone https://github.com/aegis/aegis.git
cd aegis/Move
```

### Deploy

```bash
# Build
mv build

# Deploy to testnet
mv deploy --network testnet --epochs 50
```

### Integrate

```typescript
import { getAgentReputation } from '@aegis/sdk';

const rep = await getAgentReputation(agentAddress);
if (rep.uptime_score < 80) {
  showWarning('Agent uptime below ideal threshold');
}
```

## Architecture

```
[Agent] → [DeepBook Order] → [ReputationObject On-chain]
                             → [Walrus Log]
                             → [Badge NFT]
```

## Tracks

- **Agentic Web** (Primary): Agent wallet with verifiable reputation
- **Walrus** (Secondary): Persistent cross-session memory

## Documentation

- [SPEC.md](./SPEC.md) - Full specification
- [Knowledge Base](./docs/KNOWLEDGE.md) - Sui & Walrus reference

## License

MIT
