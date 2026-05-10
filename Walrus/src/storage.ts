import { SuiGrpcClient } from '@mysten/sui/grpc';
import { walrus, WalrusFile } from '@mysten/walrus';

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

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(walrus({
  uploadRelay: {
    host: 'https://upload-relay.testnet.walrus.space',
  },
}));

export async function storeAgentLogs(
  agentId: string,
  logs: ExecutionLogEntry[],
  signer: any,
  epochs: number = 3
): Promise<{ blobId: string; objectId: string }> {
  const agentLog: AgentLog = {
    agent_id: agentId,
    logs,
    created_at: Date.now(),
    updated_at: Date.now(),
  };

  const file = WalrusFile.from({
    contents: new TextEncoder().encode(JSON.stringify(agentLog)),
    identifier: `agent_${agentId}_logs.json`,
    tags: {
      'content-type': 'application/json',
      'agent-id': agentId,
    },
  });

  const result = await client.walrus.writeFiles({
    files: [file],
    epochs,
    deletable: true,
    signer,
  });

  return {
    blobId: result[0].blobId,
    objectId: result[0].blobObject.objectId,
  };
}

export async function getAgentLogs(blobId: string): Promise<AgentLog | null> {
  try {
    const file = await client.walrus.getFiles({ ids: [blobId] });
    const text = await file[0].text();
    return JSON.parse(text) as AgentLog;
  } catch (error) {
    console.error('Failed to retrieve agent logs:', error);
    return null;
  }
}

export async function appendExecutionLog(
  blobId: string,
  newEntry: ExecutionLogEntry,
  signer: any,
  epochs: number = 3
): Promise<{ blobId: string; objectId: string }> {
  const existingLog = await getAgentLogs(blobId);

  if (!existingLog) {
    return storeAgentLogs(newEntry.action.split('_')[0], [newEntry], signer, epochs);
  }

  existingLog.logs.push(newEntry);
  existingLog.updated_at = Date.now();

  return storeAgentLogs(existingLog.agent_id, existingLog.logs, signer, epochs);
}
