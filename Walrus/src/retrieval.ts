import { WalrusClient, TESTNET_WALRUS_PACKAGE_CONFIG } from '@mysten/walrus';

const TESTNET_RPC = 'https://fullnode.testnet.sui.io:443';

const walrusClient = new WalrusClient({
  network: 'testnet',
  suiRpcUrl: TESTNET_RPC,
  packageConfig: TESTNET_WALRUS_PACKAGE_CONFIG,
});

export interface BlobInfo {
  blobId: string;
  size: number;
  storedUntil: number;
}

export async function getBlobInfo(blobId: string): Promise<BlobInfo | null> {
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

export async function verifyBlobExists(blobId: string): Promise<boolean> {
  try {
    await walrusClient.getBlobMetadata({ blobId, signal: undefined });
    return true;
  } catch {
    return false;
  }
}

export async function getBlobContent(blobId: string): Promise<string | null> {
  try {
    const content = await walrusClient.readBlob({ blobId, signal: undefined });
    return new TextDecoder().decode(content);
  } catch (error) {
    console.error('Failed to read blob:', error);
    return null;
  }
}