import { SuiGrpcClient } from '@mysten/sui/grpc';
import { config } from '../config';

/**
 * gRPC-Web client for Sui testnet. JSON-RPC public endpoints were shut down
 * by the Sui Foundation the week of 2026-07-06 (full deactivation 2026-07-31),
 * and GraphQL RPC is mainnet-only — gRPC is the only remaining transport for
 * testnet reads/writes. Same host as before (fullnode.<network>.sui.io:443),
 * just a different protocol on the same port.
 */
export const suiClient = new SuiGrpcClient({
  network: config.network as 'mainnet' | 'testnet' | 'devnet' | 'localnet',
  baseUrl: `https://fullnode.${config.network}.sui.io:443`,
});

/**
 * Reads a Move object's struct fields as JSON. Move field names (snake_case,
 * e.g. `agent_id`) come straight from the on-chain struct, so they read the
 * same under gRPC's `json` include as they did under the old JSON-RPC
 * `content.fields`. Returns null if the object doesn't exist or isn't a
 * Move object (mirrors the old JSON-RPC null-on-not-found behavior).
 */
export async function getObjectFields(objectId: string): Promise<Record<string, any> | null> {
  try {
    const res = await suiClient.getObject({ objectId, include: { json: true } });
    return (res.object.json as Record<string, any> | null) ?? null;
  } catch (err) {
    console.error('getObjectFields failed:', err);
    return null;
  }
}

/**
 * Signs and executes a transaction, unwrapping the gRPC client's
 * `{ $kind: 'Transaction' | 'FailedTransaction' }` result into the
 * transaction body, or throwing with the failure status.
 */
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

/** Finds the object ID of a newly created object whose type includes `typeIncludes`. */
export function findCreatedObjectId(
  tx: { effects?: { changedObjects: { objectId: string; idOperation: string }[] }; objectTypes?: Record<string, string> },
  typeIncludes: string
): string | null {
  const created = tx.effects?.changedObjects.find(
    (o) => o.idOperation === 'Created' && tx.objectTypes?.[o.objectId]?.includes(typeIncludes)
  );
  return created?.objectId ?? null;
}
