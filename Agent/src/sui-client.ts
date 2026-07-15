import { SuiGrpcClient } from '@mysten/sui/grpc';
import { config } from './config';

/**
 * gRPC-Web client for Sui testnet. JSON-RPC public endpoints were shut down
 * by the Sui Foundation the week of 2026-07-06 (full deactivation 2026-07-31),
 * and GraphQL RPC is mainnet-only — gRPC is the only remaining transport for
 * testnet reads/writes. Same host as before (fullnode.<network>.sui.io:443),
 * just a different protocol on the same port. Mirrors Frontend/src/lib/sui-client.ts.
 */
export const suiClient = new SuiGrpcClient({
  network: config.network as 'mainnet' | 'testnet' | 'devnet' | 'localnet',
  baseUrl: `https://fullnode.${config.network}.sui.io:443`,
});

export async function getObjectFields(objectId: string): Promise<Record<string, any> | null> {
  try {
    const res = await suiClient.getObject({ objectId, include: { json: true } });
    return (res.object.json as Record<string, any> | null) ?? null;
  } catch (err) {
    console.error('getObjectFields failed:', err);
    return null;
  }
}

export async function signAndExecute(params: { signer: any; transaction: any }) {
  const result = await suiClient.signAndExecuteTransaction({
    signer: params.signer,
    transaction: params.transaction,
    include: { effects: true, objectTypes: true },
  });
  if (result.$kind === 'FailedTransaction') {
    throw new Error(`Transaction failed: ${JSON.stringify(result.FailedTransaction.status)}`);
  }
  return result.Transaction;
}

export function findCreatedObjectId(
  tx: { effects?: { changedObjects: { objectId: string; idOperation: string }[] }; objectTypes?: Record<string, string> },
  typeIncludes: string
): string | null {
  const created = tx.effects?.changedObjects.find(
    (o) => o.idOperation === 'Created' && tx.objectTypes?.[o.objectId]?.includes(typeIncludes)
  );
  return created?.objectId ?? null;
}
