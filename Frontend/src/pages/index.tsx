'use client';

import Link from 'next/link';

export default function Home() {
  return (
        <main className="container">
          <header>
            <h1>Aegis</h1>
            <p>Trust is not asked. It's proven. On-chain.</p>
          </header>

          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <Link href="/agents" className="action-card">
                <span className="icon">👥</span>
                <span className="title">Browse Agents</span>
                <span className="desc">View all registered agents</span>
              </Link>
              <Link href="/leaderboard" className="action-card">
                <span className="icon">🏆</span>
                <span className="title">Leaderboard</span>
                <span className="desc">Top performers ranked</span>
              </Link>
              <Link href="/badges" className="action-card">
                <span className="icon">🏅</span>
                <span className="title">Badges</span>
                <span className="desc">Certified trust levels</span>
              </Link>
              <Link href="/developer" className="action-card">
                <span className="icon">⚙️</span>
                <span className="title">For Developers</span>
                <span className="desc">Integrate your agent</span>
              </Link>
            </div>
          </section>

          <section className="demo">
            <h2>Check Agent Reputation</h2>
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
            <div className="demo-agents">
              <span className="demo-label">Try with demo agents:</span>
              <button className="demo-btn" onClick={() => { window.location.href = '/agent/0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc'; }}>
                AlphaTrader
              </button>
              <button className="demo-btn" onClick={() => { window.location.href = '/agent/0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec'; }}>
                BetaBot
              </button>
              <button className="demo-btn danger" onClick={() => { window.location.href = '/agent/0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6'; }}>
                GammaScam
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
            .quick-actions {
              margin-bottom: 60px;
              width: 100%;
              max-width: 800px;
            }
            .quick-actions h2 {
              color: #fff;
              font-size: 20px;
              margin: 0 0 20px 0;
              text-align: center;
            }
            .action-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
            }
            @media (max-width: 768px) {
              .action-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            .action-card {
              background: #1a1a2e;
              border: 1px solid #333;
              border-radius: 12px;
              padding: 24px 16px;
              text-align: center;
              text-decoration: none;
              transition: all 0.2s;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            }
            .action-card:hover {
              border-color: #8b5cf6;
              transform: translateY(-2px);
            }
            .action-card .icon {
              font-size: 32px;
            }
            .action-card .title {
              color: #fff;
              font-weight: bold;
              font-size: 14px;
            }
            .action-card .desc {
              color: #666;
              font-size: 12px;
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
            .demo-agents {
              margin-top: 20px;
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              align-items: center;
            }
            .demo-label {
              color: #666;
              font-size: 12px;
            }
            .demo-btn {
              padding: 6px 12px;
              background: #0f0f1a;
              border: 1px solid #333;
              border-radius: 6px;
              color: #888;
              font-size: 12px;
              font-weight: normal;
            }
            .demo-btn:hover {
              border-color: #8b5cf6;
              color: #fff;
            }
            .demo-btn.danger {
              border-color: #ef4444;
              color: #ef4444;
            }
            .demo-btn.danger:hover {
              background: rgba(239, 68, 68, 0.2);
            }
            footer {
              margin-top: 60px;
              color: #666;
            }
          `}</style>
        </main>
  );
}
