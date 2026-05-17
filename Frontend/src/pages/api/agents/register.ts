import type { NextApiRequest, NextApiResponse } from 'next';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { requestSuiFromFaucetV2, getFaucetHost } from '@mysten/sui/faucet';

const client = new SuiJsonRpcClient({ url: 'https://fullnode.testnet.sui.io:443', network: 'testnet' });
const PACKAGE_ID = '0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d';
const BADGE_REGISTRY_ID = '0xd7f704c15109a42a56b74e962745831af33fb05cece15103b928bc7d9bd4adb3';

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let keypair: Ed25519Keypair;

    const privateKey = process.env.DEMO_WALLET_PRIVATE_KEY;
    if (privateKey) {
      const raw = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
      keypair = Ed25519Keypair.fromSecretKey(Buffer.from(raw, 'hex'));
    } else {
      keypair = Ed25519Keypair.generate();
      const address = keypair.getPublicKey().toSuiAddress();
      try {
        await requestSuiFromFaucetV2({ host: getFaucetHost('testnet'), recipient: address });
        await new Promise(r => setTimeout(r, 2000));
      } catch {
        return res.status(200).json({
          success: false,
          demo: true,
          agents: [],
          note: 'faucet_unavailable',
        });
      }
    }

    const agentLabel = `Demo Agent ${req.body?.name || `#${Date.now().toString(36).toUpperCase()}`}`;
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::reputation::register_agent`,
      arguments: [],
    });
    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showEffects: true, showObjectChanges: true },
    });

    const objectId = (result.objectChanges as any[])?.find(
      (change: any) => change.type === 'created' && change.objectType?.includes('ReputationObject')
    )?.objectId || '';

    if (!objectId) {
      return res.status(500).json({ error: 'Failed to get objectId from registration' });
    }

    const totalExecs = rand(15, 40);
    let successes = 0;
    let failures = 0;
    let totalVolume = 0;
    let totalSlippage = 0;
    let execDigests: string[] = [];

    for (let i = 0; i < totalExecs; i++) {
      const success = Math.random() < 0.85;
      const vol = rand(100_000_000, 3_000_000_000);
      const slip = success ? rand(5, 100) : rand(100, 500);

      try {
        const execTx = new Transaction();
        execTx.moveCall({
          target: `${PACKAGE_ID}::reputation::record_execution`,
          arguments: [
            execTx.object(objectId),
            execTx.pure.bool(success),
            execTx.pure.u64(vol),
            execTx.pure.u64(slip),
          ],
        });
        const execResult = await client.signAndExecuteTransaction({
          signer: keypair,
          transaction: execTx,
          options: { showEffects: true },
        });
        execDigests.push(execResult.digest);
      } catch {
        // skip failed execution recordings
      }

      if (success) {
        successes++;
        totalVolume += vol;
        totalSlippage += slip;
      } else {
        failures++;
      }
    }

    const successRate = totalExecs > 0 ? Math.round((successes / totalExecs) * 1000) / 10 : 100;
    const avgSlippage = totalExecs > 0 ? Math.round(totalSlippage / totalExecs) : 0;
    const volumeSUI = totalVolume / 1_000_000_000;
    const isFlagged = successRate < 50 || avgSlippage > 500;

    let badge: string = 'none';
    if (!isFlagged) {
      if (totalExecs >= 200 && successRate >= 95 && volumeSUI >= 1000) badge = 'gold';
      else if (totalExecs >= 50 && successRate >= 90) badge = 'silver';
      else if (totalExecs >= 10 && successRate >= 80) badge = 'bronze';
    }

    if (badge !== 'none' && !isFlagged) {
      const badgeMap: Record<string, number> = { bronze: 1, silver: 2, gold: 3 };
      try {
        const badgeTx = new Transaction();
        badgeTx.moveCall({
          target: `${PACKAGE_ID}::badge_registry::grant_badge`,
          arguments: [
            badgeTx.object(BADGE_REGISTRY_ID),
            badgeTx.pure.address(keypair.getPublicKey().toSuiAddress()),
            badgeTx.pure.u8(badgeMap[badge]),
          ],
        });
        await client.signAndExecuteTransaction({
          signer: keypair,
          transaction: badgeTx,
          options: { showEffects: true },
        });
      } catch {
        // badge mint failed, ignore
      }
    }

    return res.status(200).json({
      success: true,
      demo: true,
      agent: {
        objectId,
        address: keypair.getPublicKey().toSuiAddress(),
        label: agentLabel,
        totalExecutions: totalExecs,
        successfulExecutions: successes,
        failedExecutions: failures,
        totalVolume: totalVolume,
        successRate,
        avgSlippage: avgSlippage,
        isFlagged,
        badge,
        digest: result.digest,
        execDigests: execDigests.slice(0, 5),
      },
    });
  } catch (error: any) {
    console.error('Demo agent registration failed:', error);
    return res.status(200).json({
      success: false,
      demo: true,
      agents: [],
      error: error.message,
      note: 'registration_failed',
    });
  }
}
