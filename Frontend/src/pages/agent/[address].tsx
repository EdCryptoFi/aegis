'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import AgentCard from '../../components/AgentCard';
import { config } from '../../config';

export default function AgentPage() {
  const router = useRouter();
  const agentAddress = router.query.address as string;

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors mb-6">
            ← Back to Agents
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-cyan-primary" />
            <h1 className="font-display text-4xl font-bold gradient-text-cyan">Agent Profile</h1>
          </div>
          <p className="font-mono text-text-muted text-xs">
            Contract: {config.packageId.slice(0, 16)}...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <AgentCard agentAddress={agentAddress} />
        </motion.div>

      </div>
    </main>
  );
}
