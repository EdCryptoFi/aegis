#!/usr/bin/env node
import { SuiClient, getFullNodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID = '0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a';
const NETWORK = 'testnet';

const client = new SuiClient({ url: getFullNodeUrl(NETWORK) });

interface AgentDemo {
  name: string;
  description: string;
  strategy: string;
  executions: { success: boolean; volume: number; slippage: number }[];
}

const DEMO_AGENTS: AgentDemo[] = [
  {
    name: 'AlphaTrader',
    description: 'High-frequency scalping bot with minimal slippage',
    strategy: 'Arbitrage across DEXs with tight spread targets',
    executions: [
      { success: true, volume: 500000000, slippage: 10 },
      { success: true, volume: 300000000, slippage: 15 },
      { success: true, volume: 200000000, slippage: 8 },
      { success: true, volume: 400000000, slippage: 12 },
      { success: true, volume: 600000000, slippage: 5 },
    ],
  },
  {
    name: 'BetaBot',
    description: 'Medium-risk swing trading bot',
    strategy: 'Trend-following with dynamic stop-loss',
    executions: [
      { success: true, volume: 1000000000, slippage: 100 },
      { success: true, volume: 800000000, slippage: 150 },
      { success: false, volume: 500000000, slippage: 300 },
      { success: true, volume: 1200000000, slippage: 80 },
      { success: false, volume: 300000000, slippage: 200 },
    ],
  },
  {
    name: 'GammaScam',
    description: 'Suspicious agent (for demo purposes)',
    strategy: 'Unknown - flagged for high slippage',
    executions: [
      { success: false, volume: 0, slippage: 600 },
      { success: false, volume: 0, slippage: 700 },
      { success: false, volume: 0, slippage: 550 },
    ],
  },
];

async function createDemoAgent(
  name: string,
  description: string,
  strategy: string,
  signerAddress: string
) {
  console.log(`\n🤖 Creating ${name}...`);
  console.log(`   Description: ${description}`);
  console.log(`   Strategy: ${strategy}`);

  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::reputation::register_agent`,
    arguments: [],
  });

  const result = await client.signAndExecuteTransaction({
    signer: { getPublicKey: () => ({ toSuiAddress: () => signerAddress }) } as any,
    transaction: tx,
    options: { showEffects: true },
  });

  if (result.effects?.status?.status !== 'success') {
    console.log(`   ❌ Failed to register`);
    return null;
  }

  let repObjectId = '';
  if (result.effects?.created) {
    for (const obj of result.effects.created) {
      if (obj.owner?.Shared) {
        repObjectId = obj.reference.objectId;
      }
    }
  }

  console.log(`   ✅ Registered! Object ID: ${repObjectId}`);
  return repObjectId;
}

async function recordExecutions(
  objectId: string,
  executions: { success: boolean; volume: number; slippage: number }[],
  signerAddress: string
) {
  for (const exec of executions) {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::reputation::record_execution`,
      arguments: [
        tx.object(objectId),
        tx.pure.bool(exec.success),
        tx.pure.u64(exec.volume),
        tx.pure.u64(exec.slippage),
      ],
    });

    await client.signAndExecuteTransaction({
      signer: { getPublicKey: () => ({ toSuiAddress: () => signerAddress }) } as any,
      transaction: tx,
      options: { showEffects: true },
    });

    console.log(`   📝 ${exec.success ? '✅' : '❌'} success=${exec.success} vol=${exec.volume} slip=${exec.slippage}`);
  }
}

async function verifyAgent(objectId: string, name: string) {
  const obj = await client.getObject({
    id: objectId,
    options: { showContent: true },
  });

  if (obj.data?.content?.dataType === 'moveObject') {
    const fields = obj.data.content.fields as any;
    const total = Number(fields.total_executions);
    const success = Number(fields.successful_executions);
    const rate = total > 0 ? (success / total * 100).toFixed(1) : '100';

    console.log(`\n   📊 ${name} Final Stats:`);
    console.log(`      Total: ${total} | Success: ${success} | Rate: ${rate}%`);
    console.log(`      Uptime: ${fields.uptime_score}% | Flagged: ${fields.is_flagged}`);
    console.log(`      Volume: ${(Number(fields.total_volume) / 1e9).toFixed(4)} SUI`);
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('    Aegis - Demo Agents Setup');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`Package ID: ${PACKAGE_ID}`);
  console.log(`Network: ${NETWORK}\n`);

  const signerAddress = process.env.SUI_ADDRESS || '0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1';
  console.log(`Signer: ${signerAddress}\n`);

  console.log('This script will create 3 demo agents with different');
  console.log('reputation profiles for testing purposes.\n');

  const results: { name: string; objectId: string }[] = [];

  for (const agent of DEMO_AGENTS) {
    const objectId = await createDemoAgent(
      agent.name,
      agent.description,
      agent.strategy,
      signerAddress
    );

    if (objectId) {
      await recordExecutions(objectId, agent.executions, signerAddress);
      await verifyAgent(objectId, agent.name);
      results.push({ name: agent.name, objectId });
    }
  }

  console.log('\n═══════════════════════════════════════════════════');
  console.log('    Setup Complete!');
  console.log('═══════════════════════════════════════════════════\n');

  console.log('Demo Agents Summary:\n');
  for (const r of results) {
    console.log(`  ${r.name}: ${r.objectId}`);
  }

  console.log('\n📖 View agents at: https://suivision.xyz/');
  console.log('💻 Or use the frontend demo at /agent/[address]\n');
}

main().catch(console.error);
