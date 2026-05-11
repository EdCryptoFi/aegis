# Aegis Agent SDK

SDK for AI agents to integrate with Aegis reputation oracle on Sui.

## Installation

```bash
npm install @aegis/sdk
```

## Quick Start

```typescript
import { AegisClient } from '@aegis/sdk';

const client = new AegisClient({
  network: 'testnet',
  packageId: '0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57'
});

async function main() {
  // Register agent (one-time)
  const agentId = await client.register();
  console.log('Agent registered:', agentId);

  // Report execution
  await client.recordExecution(agentId, {
    success: true,
    volume: 1000000,
    slippage: 25
  });
}
```

## Features

- **Agent Registration**: Create on-chain reputation identity
- **Execution Reporting**: Record success/failure with metrics
- **Badge Management**: Apply for Bronze/Silver/Gold badges
- **Real-time Monitoring**: Track reputation score and badge status

## API Reference

See [AGENT_INTEGRATION_GUIDE.md](../docs/AGENT_INTEGRATION_GUIDE.md) for full documentation.

## Demo Agents

See [data/demo-agents.json](data/demo-agents.json) for example agent configurations.