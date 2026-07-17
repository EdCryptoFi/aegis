'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import AgentDashboard from '../../components/AgentDashboard';

export default function AgentPage() {
  const router = useRouter();
  const address = router.query.address as string;

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors">
            <ArrowLeft size={14} /> Back to Agents
          </Link>
        </motion.div>

        {address && <AgentDashboard address={address} />}
      </div>
    </main>
  );
}
