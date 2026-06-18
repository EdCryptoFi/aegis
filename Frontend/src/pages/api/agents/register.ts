import type { NextApiRequest, NextApiResponse } from 'next';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { requestSuiFromFaucetV2, getFaucetHost } from '@mysten/sui/faucet';
import { checkRateLimit, rateLimitResponse } from '../../../lib/rate-limit';
import { methodNotAllowed, serverError, sanitizeString } from '../../../lib/api-utils';
import { config } from '../../../config';

const client = new SuiJsonRpcClient({ url: 'https://fullnode.testnet.sui.io:443', network: 'testnet' });
const PACKAGE_ID = config.packageId;
const BADGE_REGISTRY_ID = config.badgeRegistry;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  const { limited, resetInMs } = checkRateLimit(req, 'strict');
  if (limited) return rateLimitResponse(res, resetInMs);

  try {
    let keypair: Ed25519Keypair;

    const privateKey = process.env.DEMO_WALLET_PRIVATE_KEY;
    if (privateKey) {
      if (privateKey.startsWith('suiprivkey')) {
        keypair = Ed25519Keypair.fromSecretKey(privateKey);
      } else {
        const raw = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
        keypair = Ed25519Keypair.fromSecretKey(Buffer.from(raw, 'hex'));
      }
    } else {
      keypair = Ed25519Keypair.generate();
      const address = keypair.getPublicKey().toSuiAddress();
      try {
        await requestSuiFromFaucetV2({ host: getFaucetHost('testnet'), recipient: address });
        await new Promise(r => setTimeout(r, 2000));
      } catch {
        return res.status(429).json({
          success: false,
          error: 'Faucet rate limit reached. Try again later or configure DEMO_WALLET_PRIVATE_KEY.',
        });
      }
    }

    const agentName = sanitizeString(req.body?.name, 50) || `Demo #${Date.now().toString(36).toUpperCase()}`;
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
      return res.status(500).json({ error: 'Failed to create agent on-chain' });
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
          target: `${PACKAGE_ID}::badge_registry::auto_check`,
          arguments: [
            badgeTx.object(BADGE_REGISTRY_ID),
            badgeTx.pure.address(keypair.getPublicKey().toSuiAddress()),
            badgeTx.object(objectId),
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

    return res.status(201).json({
      success: true,
      agent: {
        objectId,
        address: keypair.getPublicKey().toSuiAddress(),
        label: agentName,
        totalExecutions: totalExecs,
        successfulExecutions: successes,
        failedExecutions: failures,
        totalVolume,
        successRate,
        avgSlippage,
        isFlagged,
        badge,
        digest: result.digest,
        execDigests: execDigests.slice(0, 5),
      },
    });
  } catch (error: unknown) {
    serverError(res, error, 'POST /api/agents/register');
  }
}
