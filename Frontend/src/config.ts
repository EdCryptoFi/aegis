export const config = {
  network: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
  packageId: process.env.NEXT_PUBLIC_PACKAGE_ID || '0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9',
  badgeRegistry: process.env.NEXT_PUBLIC_BADGE_REGISTRY || '0xd79da82c2490d212b3892a17a0c22c2f6adaed30a412daafb765ad2ec0a448b3',
  walrus: {
    uploadRelay: process.env.NEXT_PUBLIC_WALRUS_UPLOAD_RELAY || 'https://upload-relay.testnet.walrus.space',
  },
  memwal: {
    relayerUrl: process.env.NEXT_PUBLIC_MEMWAL_RELAYER_URL || 'https://relayer.staging.memwal.ai',
    namespace: process.env.NEXT_PUBLIC_MEMWAL_NAMESPACE || 'aegis',
  },
};
