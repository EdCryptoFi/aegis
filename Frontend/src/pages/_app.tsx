import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { I18nProvider } from '../lib/i18n';
// WalletButton moved inside Navbar
import AIAssistant from '../components/AIAssistant';
import { ThemeProvider } from '../lib/theme';
import Navbar from '../components/Navbar';
import CookieBanner from '../components/CookieBanner';
import ParticleBackground from '../components/ParticleBackground';
import GlowOrbs from '../components/GlowOrbs';
import '@mysten/dapp-kit/dist/index.css';
import '../styles/globals.css';

const queryClient = new QueryClient();

const suiClient = new SuiJsonRpcClient({
  url: getJsonRpcFullnodeUrl('testnet'),
  network: 'testnet',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={{ testnet: suiClient }} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <ThemeProvider>
            <I18nProvider>
            {/* Global animated background - sits behind all pages */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
              <ParticleBackground />
              <GlowOrbs />
            </div>
            <Navbar />
            <Component {...pageProps} />
            <AIAssistant />
            <CookieBanner />
            </I18nProvider>
          </ThemeProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
