import type { Config } from '@aegis/sdk';

export const config: Config = {
  network: 'testnet',
  packageId: process.env.NEXT_PUBLIC_PACKAGE_ID || '0x0',
  walrus: {
    uploadRelay: 'https://upload-relay.testnet.walrus.space',
  },
};
