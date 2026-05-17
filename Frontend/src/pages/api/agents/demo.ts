import type { NextApiRequest, NextApiResponse } from 'next';

interface DemoAgentEntry {
  id: string;
  objectId: string;
  name: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  uptimeScore: number;
  totalVolume: number;
  successRate: number;
  avgSlippage: number;
  isFlagged: boolean;
  badge: string;
  createdAt: number;
}

const store: DemoAgentEntry[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return res.status(200).json({
        success: true,
        count: store.length,
        agents: store.sort((a, b) => b.createdAt - a.createdAt),
      });
    }
    case 'POST': {
      const body = req.body || {};
      const entry: DemoAgentEntry = {
        id: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        objectId: body.objectId || `0xDEMO_${Date.now().toString(36).toUpperCase()}`,
        name: body.name || `Demo Agent #${store.length + 1}`,
        totalExecutions: body.totalExecutions || 0,
        successfulExecutions: body.successfulExecutions || 0,
        failedExecutions: body.failedExecutions || 0,
        uptimeScore: body.uptimeScore ?? Math.round((body.successRate || 85)),
        totalVolume: body.totalVolume || 0,
        successRate: body.successRate || 0,
        avgSlippage: body.avgSlippage || 0,
        isFlagged: body.isFlagged || false,
        badge: body.badge || 'none',
        createdAt: Date.now(),
      };
      store.push(entry);
      return res.status(200).json({ success: true, agent: entry });
    }
    case 'DELETE': {
      store.length = 0;
      return res.status(200).json({ success: true, message: 'Store cleared' });
    }
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
