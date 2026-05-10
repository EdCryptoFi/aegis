'use client';

import { WalletProvider, AllWalletsProvider } from '@mysten/wallet-kit';
import AgentCard from './components/AgentCard';

export default function Home() {
  return (
    <WalletProvider>
      <AllWalletsProvider>
        <main className="container">
          <header>
            <h1>Aegis</h1>
            <p>Trust is not asked. It's proven. On-chain.</p>
          </header>

          <section className="demo">
            <h2>Agent Reputation Oracle</h2>
            <p>Enter an agent address to check their reputation:</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="0x..."
                id="agent-address"
              />
              <button onClick={() => {
                const input = document.getElementById('agent-address') as HTMLInputElement;
                const address = input.value;
                if (address) {
                  window.location.href = `/agent/${address}`;
                }
              }}>
                Check Reputation
              </button>
            </div>
          </section>

          <footer>
            <p>Built for Sui Overflow 2026</p>
          </footer>

          <style jsx>{`
            .container {
              min-height: 100vh;
              background: #0f0f1a;
              padding: 40px 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            header {
              text-align: center;
              margin-bottom: 60px;
            }
            h1 {
              font-size: 48px;
              color: #fff;
              margin: 0;
              background: linear-gradient(135deg, #8b5cf6, #ec4899);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            header p {
              color: #888;
              font-size: 18px;
              margin-top: 8px;
            }
            .demo {
              background: #1a1a2e;
              padding: 32px;
              border-radius: 16px;
              max-width: 600px;
              width: 100%;
            }
            .demo h2 {
              color: #fff;
              margin: 0 0 8px 0;
            }
            .demo p {
              color: #888;
              margin: 0 0 24px 0;
            }
            .input-group {
              display: flex;
              gap: 12px;
            }
            input {
              flex: 1;
              padding: 12px 16px;
              background: #0f0f1a;
              border: 1px solid #333;
              border-radius: 8px;
              color: #fff;
              font-size: 16px;
            }
            input:focus {
              outline: none;
              border-color: #8b5cf6;
            }
            button {
              padding: 12px 24px;
              background: linear-gradient(135deg, #8b5cf6, #ec4899);
              border: none;
              border-radius: 8px;
              color: white;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
            }
            button:hover {
              opacity: 0.9;
            }
            footer {
              margin-top: 60px;
              color: #666;
            }
          `}</style>
        </main>
      </AllWalletsProvider>
    </WalletProvider>
  );
}
