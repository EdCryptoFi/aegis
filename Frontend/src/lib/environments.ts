export interface EnvironmentConfig {
  name: string;
  packageId: string;
  badgeRegistry: string;
  network: string;
  rpcUrl: string;
  isProduction: boolean;
  showDebugInfo: boolean;
  memwal: {
    relayerUrl: string;
    namespace: string;
  };
}

export const environments: Record<string, EnvironmentConfig> = {
  testnet: {
    name: 'Testnet',
    packageId: '0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d',
    badgeRegistry: '0xd7f704c15109a42a56b74e962745831af33fb05cece15103b928bc7d9bd4adb3',
    network: 'testnet',
    rpcUrl: 'https://fullnode.testnet.sui.io:443',
    isProduction: true,
    showDebugInfo: false,
    memwal: {
      relayerUrl: 'https://relayer.staging.memwal.ai',
      namespace: 'aegis',
    },
  },

  development: {
    name: 'Development',
    packageId: '0x0',
    badgeRegistry: '0x0',
    network: 'localnet',
    rpcUrl: 'http://localhost:9000',
    isProduction: false,
    showDebugInfo: true,
    memwal: {
      relayerUrl: 'http://localhost:3000',
      namespace: 'aegis-dev',
    },
  },
};

export function getCurrentEnvironment(): EnvironmentConfig {
  const env = process.env.NEXT_PUBLIC_ENV || 'development';
  return environments[env] || environments.development;
}

export const currentEnv = getCurrentEnvironment();
