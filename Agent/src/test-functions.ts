import { SuiClient, getFullNodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/walrus/keypair';

// Test Configuration
const PACKAGE_ID = '0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9';
const NETWORK = 'testnet';

const client = new SuiClient({ url: getFullNodeUrl(NETWORK) });

// Demo keypair (replace with your actual keypair for production)
// This is just for testing - DO NOT use in production
const DEMO_PRIVATE_KEY = process.env.DEMO_PRIVATE_KEY || '';

async function main() {
  console.log('🚀 Aegis Function Tests\n');
  console.log(`Package ID: ${PACKAGE_ID}`);
  console.log(`Network: ${NETWORK}\n`);

  // Get active address
  const address = process.env.SUI_ADDRESS || '0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1';
  console.log(`Test Address: ${address}\n`);

  // Test 1: Register Agent
  console.log('📝 Test 1: Register Agent');
  try {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::reputation::register_agent`,
      arguments: [],
    });

    const result = await client.signAndExecuteTransaction({
      signer: { getPublicKey: () => ({ toSuiAddress: () => address }) } as any,
      transaction: tx,
      options: { showEffects: true },
    });

    console.log(`  ✅ Success!`);
    console.log(`  Transaction: ${result.digest}`);

    if (result.effects?.created) {
      for (const obj of result.effects.created) {
        if (obj.owner?.Shared) {
          console.log(`  ReputationObject ID: ${obj.reference.objectId}`);
        }
      }
    }
  } catch (error: any) {
    console.log(`  ❌ Failed: ${error.message}`);
  }

  // Test 2: Get Objects
  console.log('\n📦 Test 2: Get Objects');
  try {
    const objects = await client.getOwnedObjects({
      owner: address,
      options: { showContent: true },
    });

    console.log(`  Found ${objects.data.length} objects`);

    for (const obj of objects.data) {
      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;
        if (fields.total_executions !== undefined) {
          console.log(`  - ReputationObject: ${obj.data.objectId}`);
          console.log(`    - Total Executions: ${fields.total_executions}`);
          console.log(`    - Uptime Score: ${fields.uptime_score}%`);
          console.log(`    - Is Flagged: ${fields.is_flagged}`);
        }
      }
    }
  } catch (error: any) {
    console.log(`  ❌ Failed: ${error.message}`);
  }

  // Test 3: Record Execution (Success)
  console.log('\n✅ Test 3: Record Successful Execution');
  try {
    // Find ReputationObject ID
    const objects = await client.getOwnedObjects({
      owner: address,
      options: { showContent: true },
    });

    let repObjectId = '';
    for (const obj of objects.data) {
      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;
        if (fields.total_executions !== undefined) {
          repObjectId = obj.data.objectId;
          break;
        }
      }
    }

    if (!repObjectId) {
      console.log('  ❌ No ReputationObject found. Run Test 1 first.');
    } else {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::reputation::record_execution`,
        arguments: [
          tx.object(repObjectId),
          tx.pure.bool(true),
          tx.pure.u64(100000000), // volume in MIST
          tx.pure.u64(50),        // slippage in basis points
        ],
      });

      const result = await client.signAndExecuteTransaction({
        signer: { getPublicKey: () => ({ toSuiAddress: () => address }) } as any,
        transaction: tx,
        options: { showEffects: true },
      });

      console.log(`  ✅ Success!`);
      console.log(`  Transaction: ${result.digest}`);
    }
  } catch (error: any) {
    console.log(`  ❌ Failed: ${error.message}`);
  }

  // Test 4: Record Execution (Failure)
  console.log('\n❌ Test 4: Record Failed Execution');
  try {
    const objects = await client.getOwnedObjects({
      owner: address,
      options: { showContent: true },
    });

    let repObjectId = '';
    for (const obj of objects.data) {
      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;
        if (fields.total_executions !== undefined) {
          repObjectId = obj.data.objectId;
          break;
        }
      }
    }

    if (!repObjectId) {
      console.log('  ❌ No ReputationObject found.');
    } else {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::reputation::record_execution`,
        arguments: [
          tx.object(repObjectId),
          tx.pure.bool(false),
          tx.pure.u64(0),
          tx.pure.u64(0),
        ],
      });

      const result = await client.signAndExecuteTransaction({
        signer: { getPublicKey: () => ({ toSuiAddress: () => address }) } as any,
        transaction: tx,
        options: { showEffects: true },
      });

      console.log(`  ✅ Success!`);
      console.log(`  Transaction: ${result.digest}`);
    }
  } catch (error: any) {
    console.log(`  ❌ Failed: ${error.message}`);
  }

  // Final Status
  console.log('\n📊 Final Status');
  try {
    const objects = await client.getOwnedObjects({
      owner: address,
      options: { showContent: true },
    });

    for (const obj of objects.data) {
      if (obj.data?.content?.dataType === 'moveObject') {
        const fields = obj.data.content.fields as any;
        if (fields.total_executions !== undefined) {
          const successRate = fields.total_executions > 0
            ? (fields.successful_executions / fields.total_executions * 100).toFixed(1)
            : '100.0';
          console.log(`  ReputationObject: ${obj.data.objectId}`);
          console.log(`  - Total Executions: ${fields.total_executions}`);
          console.log(`  - Successful: ${fields.successful_executions}`);
          console.log(`  - Failed: ${fields.failed_executions}`);
          console.log(`  - Success Rate: ${successRate}%`);
          console.log(`  - Uptime Score: ${fields.uptime_score}%`);
          console.log(`  - Total Volume: ${(Number(fields.total_volume) / 1e9).toFixed(4)} SUI`);
          console.log(`  - Is Flagged: ${fields.is_flagged}`);
        }
      }
    }
  } catch (error: any) {
    console.log(`  ❌ Failed: ${error.message}`);
  }

  console.log('\n✨ Tests Complete!\n');
}

main().catch(console.error);
