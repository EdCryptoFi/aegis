import { WalrusClient, TESTNET_WALRUS_PACKAGE_CONFIG } from '@mysten/walrus';

export interface ExecutionLogEntry {
  execution_id: number;
  action: string;
  params: string;
  result: string;
  gas_used: number;
  timestamp: number;
}

export interface AgentLog {
  agent_id: string;
  logs: ExecutionLogEntry[];
  created_at: number;
  updated_at: number;
}

const TESTNET_RPC = 'https://fullnode.testnet.sui.io:443';

const walrusClient = new WalrusClient({
  network: 'testnet',
  suiRpcUrl: TESTNET_RPC,
  packageConfig: TESTNET_WALRUS_PACKAGE_CONFIG,
});

export async function storeAgentLogs(
  agentId: string,
  logs: ExecutionLogEntry[],
  signer: any,
  epochs: number = 3
): Promise<{ blobId: string; storageOnChain: string } | null> {
  try {
    const agentLog: AgentLog = {
      agent_id: agentId,
      logs,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const blobData = new TextEncoder().encode(JSON.stringify(agentLog));

    const result = await walrusClient.writeBlob({
      blob: blobData,
      signer,
      epochs,
      deletable: true,
      signal: undefined,
    });

    return {
      blobId: result.blobId,
      storageOnChain: result.blobObject.id.id,
    };
  } catch (error) {
    console.error('Failed to store agent logs:', error);
    return null;
  }
}

export async function getAgentLogs(blobId: string): Promise<AgentLog | null> {
  try {
    const content = await walrusClient.readBlob({ blobId, signal: undefined });
    const text = new TextDecoder().decode(content);
    return JSON.parse(text) as AgentLog;
  } catch (error) {
    console.error('Failed to retrieve agent logs:', error);
    return null;
  }
}

export async function getBlobInfo(blobId: string): Promise<{
  blobId: string;
  size: number;
  storedUntil: number;
} | null> {
  try {
    const info = await walrusClient.getBlobMetadata({ blobId, signal: undefined });
    const unencodedLength = typeof info.metadata.V1.unencoded_length === 'string'
      ? BigInt(info.metadata.V1.unencoded_length)
      : info.metadata.V1.unencoded_length;
    return {
      blobId,
      size: Number(unencodedLength),
      storedUntil: 0,
    };
  } catch (error) {
    console.error('Failed to get blob info:', error);
    return null;
  }
}

export async function appendExecutionLog(
  existingBlobId: string | null,
  agentId: string,
  newEntry: ExecutionLogEntry,
  signer: any,
  epochs: number = 3
): Promise<{ blobId: string; storageOnChain: string } | null> {
  try {
    let existingLog: AgentLog | null = null;

    if (existingBlobId) {
      existingLog = await getAgentLogs(existingBlobId);
    }

    const logs = existingLog?.logs || [];
    logs.push(newEntry);

    return storeAgentLogs(agentId, logs, signer, epochs);
  } catch (error) {
    console.error('Failed to append execution log:', error);
    return null;
  }
}