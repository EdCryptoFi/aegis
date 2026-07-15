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
    packageId: '0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9',
    badgeRegistry: '0xd79da82c2490d212b3892a17a0c22c2f6adaed30a412daafb765ad2ec0a448b3',
    network: 'testnet',
    rpcUrl: 'https://sui-testnet.mystenlabs.com/graphql',
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
