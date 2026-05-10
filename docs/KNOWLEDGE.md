# Aegis - Knowledge Base

## Sui Fundamentals

### Object Model
- Tudo é **objeto** no Sui com ID único on-chain
- Tipos: Owned (por endereço), Shared, Immutable, Party
- Versionamento: ID + versão para estado histórico
- PTB (Programmable Transaction Blocks): até 1024 operações por transação

### DeepBookV3
- CLOB (Central Limit Order Book) nativo no Sui
- Suporta market orders, limit orders, flash loans
- DEEP token para fees com desconto
- Staking DEEP para rebates de maker/taker
- Docs: https://docs.deepbook.tech/

### Eventos
```move
struct ExecutionRecorded has copy, drop {
    agent_id: address,
    success: bool,
    volume: u64,
    slippage: u64,
}
emit(ExecutionRecorded { ... });
```

---

## Walrus

### Conceitos
- Blobs armazenados em storage nodes via erasure coding (slivers)
- Bindado ao Sui - cada blob tem Sui Object ID
- Dois IDs: **Blob ID** (baseado no conteúdo) e **Sui Object ID**
- Armazenamento por epochs (1 dia testnet, 2 semanas mainnet)

### CLI
```bash
# Install via suiup
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
suiup install walrus

# Store blob
walrus store file.txt --epochs 2 --context testnet

# Read blob
walrus read <blob-id> --out output.txt --context testnet
```

### TypeScript SDK
```bash
npm install @mysten/walrus @mysten/sui
```

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { walrus } from '@mysten/walrus';

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(walrus());

// Write blob
const { blobId } = await client.walrus.writeBlob({
  blob: new TextEncoder().encode('Hello Aegis'),
  deletable: true,
  epochs: 3,
  signer: keypair,
});

// Read blob
const blob = await client.walrus.readBlob({ blobId });
```

### Upload Relay (Recomendado para frontend)
```typescript
const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(walrus({
  uploadRelay: {
    host: 'https://upload-relay.testnet.walrus.space',
  },
}));
```

---

## Aegis Architecture

### Fluxo
```
Agent executa DeepBook order
    ↓
Transaction confirma
    ↓
Event ExecutionRecorded emitido
    ↓
ReputationObject atualizado on-chain
    ↓
Logs enviados para Walrus (blob_id salvo)
    ↓
Qualquer um verifica reputação + audit trail
```

### ReputationObject Fields
- `agent_id`: endereço do agent
- `total_executions`: u64
- `successful_executions`: u64
- `failed_executions`: u64
- `total_volume`: u64 (MIST)
- `total_slippage`: u64 (basis points)
- `uptime_score`: u8 (0-100)
- `last_update`: u64 (epoch)
- `is_flagged`: bool
- `walrus_blob_id`: Option<vector<u8>>

### Walrus Integration
```typescript
interface ExecutionLogEntry {
  execution_id: u64,
  action: string,
  params: string,
  result: string,
  gas_used: u64,
  timestamp: u64,
}
```

---

## Setup Rápido

```bash
# 1. Install Sui + Walrus
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
suiup install sui@testnet
suiup install walrus

# 2. Configure
curl --create-dirs https://docs.wal.app/setup/client_config.yaml -o ~/.config/walrus/client_config.yaml
sui client  # configure testnet

# 3. Fund account
sui client active-address  # copy address
# https://faucet.sui.io/  # get test SUI
walrus get-wal --context testnet  # convert to WAL
```

---

## Referências

- Sui Docs: https://docs.sui.io/
- Walrus Docs: https://docs.wal.app/
- Walrus SDK: https://sdk.mystenlabs.com/walrus
- DeepBook: https://docs.deepbook.tech/
- Suiup: https://github.com/MystenLabs/suiup
