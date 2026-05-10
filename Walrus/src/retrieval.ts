import { SuiGrpcClient } from '@mysten/sui/grpc';
import { walrus } from '@mysten/walrus';

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(walrus());

export interface BlobInfo {
  blobId: string;
  objectId: string;
  size: number;
  storedUntil: number;
}

export async function getBlobInfo(blobId: string): Promise<BlobInfo | null> {
  try {
    const blob = await client.walrus.getBlob({ blobId });
    return {
      blobId,
      objectId: blob.objectId,
      size: blob.contentLength,
      storedUntil: blob.storageEndEpoch,
    };
  } catch (error) {
    console.error('Failed to get blob info:', error);
    return null;
  }
}

export async function verifyBlobExists(blobId: string): Promise<boolean> {
  try {
    await client.walrus.getBlob({ blobId });
    return true;
  } catch {
    return false;
  }
}

export async function getBlobContent(blobId: string): Promise<string | null> {
  try {
    const blob = await client.walrus.readBlob({ blobId });
    return new TextDecoder().decode(blob);
  } catch (error) {
    console.error('Failed to read blob:', error);
    return null;
  }
}
