// One-off script: registers 3 brand-new demo agents with the app's own
// working demo wallet (DEMO_WALLET_PRIVATE_KEY) and records enough real
// executions for each to genuinely earn its badge tier on-chain — no mock
// data, no fabricated numbers. Run from Frontend/ (needs its node_modules):
//   cd Frontend && node ../scripts/seed-fresh-demo-agents.mjs
// Then update Frontend/src/lib/demo-agents.ts with the printed object IDs,
// plus the other hardcoded references (see git grep for the old addresses).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { SuiGrpcClient } from '@mysten/sui/grpc';

const frontendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../Frontend');
const envContent = fs.readFileSync(path.join(frontendDir, '.env.local'), 'utf8');
const pkMatch = envContent.match(/^DEMO_WALLET_PRIVATE_KEY=(.*)$/m);
const pkgMatch = envContent.match(/^NEXT_PUBLIC_PACKAGE_ID=(.*)$/m);
const regMatch = envContent.match(/^NEXT_PUBLIC_BADGE_REGISTRY=(.*)$/m);
if (!pkMatch) throw new Error('DEMO_WALLET_PRIVATE_KEY not set in Frontend/.env.local');

const pk = pkMatch[1].trim();
const PACKAGE_ID = pkgMatch[1].trim();
const BADGE_REGISTRY_ID = regMatch[1].trim();

const keypair = pk.startsWith('suiprivkey')
  ? Ed25519Keypair.fromSecretKey(pk)
  : Ed25519Keypair.fromSecretKey(Buffer.from(pk.startsWith('0x') ? pk.slice(2) : pk, 'hex'));

const client = new SuiGrpcClient({ network: 'testnet', baseUrl: 'https://fullnode.testnet.sui.io:443' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function signAndExecute(transaction, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction,
        include: { effects: true, objectTypes: true },
      });
      if (result.$kind === 'FailedTransaction') {
        throw new Error(`Transaction failed: ${JSON.stringify(result.FailedTransaction.status)}`);
      }
      return result.Transaction;
    } catch (err) {
      if (attempt === retries - 1) throw err;
      console.log(`  retry ${attempt + 1} after error: ${err.message}`);
      await sleep(2000);
    }
  }
}

function findCreatedObjectId(tx, typeIncludes) {
  const created = tx.effects?.changedObjects.find(
    (o) => o.idOperation === 'Created' && tx.objectTypes?.[o.objectId]?.includes(typeIncludes)
  );
  return created?.objectId ?? null;
}

async function registerAgent(label) {
  const tx = new Transaction();
  tx.moveCall({ target: `${PACKAGE_ID}::reputation::register_agent`, arguments: [] });
  const result = await signAndExecute(tx);
  const objectId = findCreatedObjectId(result, 'ReputationObject');
  if (!objectId) throw new Error(`${label}: failed to find created ReputationObject`);
  console.log(`✓ ${label} registered: ${objectId}`);
  // A freshly created shared object needs a moment to propagate before the
  // next PTB can reference it — skipping this caused "Object not found" on
  // the very first record_execution when this script first ran.
  await sleep(3000);
  return objectId;
}

async function recordExecution(objectId, success, volumeMist, slippageBps) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::reputation::record_execution`,
    arguments: [
      tx.object(objectId),
      tx.pure.bool(success),
      tx.pure.u64(volumeMist),
      tx.pure.u64(slippageBps),
    ],
  });
  return signAndExecute(tx);
}

async function autoCheckBadge(objectId) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::badge_registry::auto_check`,
    arguments: [
      tx.object(BADGE_REGISTRY_ID),
      tx.pure.address(keypair.getPublicKey().toSuiAddress()),
      tx.object(objectId),
    ],
  });
  return signAndExecute(tx);
}

async function seedGold(label, count, volEach, slipEach) {
  const objectId = await registerAgent(label);
  for (let i = 0; i < count; i++) {
    await recordExecution(objectId, true, volEach, slipEach);
    if ((i + 1) % 20 === 0) console.log(`  ${label}: ${i + 1}/${count} executions recorded`);
  }
  await autoCheckBadge(objectId);
  console.log(`🥇 ${label}: badge auto_check complete`);
  return objectId;
}

async function seedSilver(label, total, volEach, slipEach) {
  const objectId = await registerAgent(label);
  const failEvery = Math.floor(total / Math.max(1, Math.round(total * 0.02))); // ~2% failure rate
  for (let i = 0; i < total; i++) {
    const success = (i + 1) % failEvery !== 0;
    await recordExecution(objectId, success, success ? volEach : 0, success ? slipEach : 150);
    if ((i + 1) % 20 === 0) console.log(`  ${label}: ${i + 1}/${total} executions recorded`);
  }
  await autoCheckBadge(objectId);
  console.log(`🥈 ${label}: badge auto_check complete`);
  return objectId;
}

async function seedFlagged(label) {
  const objectId = await registerAgent(label);
  // Single failed execution at >=500 bps slippage trips the on-chain auto-flag immediately.
  await recordExecution(objectId, false, 0, 550);
  console.log(`🚫 ${label}: flagged via high slippage on first execution`);
  return objectId;
}

(async () => {
  console.log('Wallet:', keypair.getPublicKey().toSuiAddress());
  console.log('Package:', PACKAGE_ID);
  console.log('');

  const alpha = await seedGold('AlphaTrader', 200, 5_500_000_000, 15); // 200 execs, 1100 SUI volume, 100% success -> Gold
  const beta = await seedSilver('BetaBot', 60, 900_000_000, 80); // 60 execs, ~98% success -> Silver
  const gamma = await seedFlagged('GammaScam');

  console.log('\n=== Update Frontend/src/lib/demo-agents.ts with these ===');
  console.log(JSON.stringify({ AlphaTrader: alpha, BetaBot: beta, GammaScam: gamma }, null, 2));
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
