'use client';

import { useRouter } from 'next/router';
import AgentCard from '../../components/AgentCard';
import { config } from '../../config';

export default function AgentPage() {
  const router = useRouter();
  const agentAddress = router.query.address as string;

  return (
        <main className="container">
          <header>
            <a href="/" className="back-link">← Back to Home</a>
            <h1>Aegis</h1>
            <p className="subtitle">Agent Reputation Oracle</p>
          </header>

          <section className="info">
            <p className="contract">Contract: {config.packageId}</p>
          </section>

          <section className="agent-section">
            <AgentCard agentAddress={agentAddress} />
          </section>

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
              margin-bottom: 40px;
            }
            .back-link {
              color: #8b5cf6;
              text-decoration: none;
              margin-bottom: 16px;
              display: inline-block;
            }
            .back-link:hover {
              text-decoration: underline;
            }
            h1 {
              font-size: 36px;
              color: #fff;
              margin: 0;
              background: linear-gradient(135deg, #8b5cf6, #ec4899);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .subtitle {
              color: #888;
              font-size: 14px;
              margin-top: 8px;
            }
            .info {
              margin-bottom: 20px;
            }
            .contract {
              color: #666;
              font-size: 12px;
              font-family: monospace;
            }
            .agent-section {
              width: 100%;
              display: flex;
              justify-content: center;
            }
          `}</style>
        </main>
  );
}
