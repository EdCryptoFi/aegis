export const config = {
  network: process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet',
  packageId: process.env.NEXT_PUBLIC_PACKAGE_ID || '0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d',
  badgeRegistry: process.env.NEXT_PUBLIC_BADGE_REGISTRY || '0xd7f704c15109a42a56b74e962745831af33fb05cece15103b928bc7d9bd4adb3',
  walrus: {
    uploadRelay: 'https://upload-relay.testnet.walrus.space',
  },
  memwal: {
    relayerUrl: process.env.NEXT_PUBLIC_MEMWAL_RELAYER_URL || 'https://relayer.staging.memwal.ai',
    namespace: process.env.NEXT_PUBLIC_MEMWAL_NAMESPACE || 'aegis',
  },
};
