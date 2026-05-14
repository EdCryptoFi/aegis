'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ExecutionLogEntry {
  agentId: string;
  poolName: string;
  side: string;
  action: string;
  params: string;
  result: string;
  success: boolean;
  quantity: number;
  price: number;
  volume: number;
  slippageBps: number;
  expectedPrice: number;
  actualPrice: number;
  gasUsed: number;
  timestamp: number;
  digest: string;
  error: string | null;
  blobId: string | null;
}

interface PerformanceChartProps {
  totalExecutions: number;
  successfulExecutions: number;
  totalVolume: number;
  uptimeScore: number;
  executionHistory?: ExecutionLogEntry[];
}

function generateChartData(executions: number, successRate: number, volume: number, history?: ExecutionLogEntry[]) {
  if (history && history.length > 0) {
    const sortedLogs = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const dayMs = 24 * 60 * 60 * 1000;

    const data: any[] = [];
    let cumulativeSuccess = 0;

    for (let i = 0; i < sortedLogs.length; i++) {
      const log = sortedLogs[i];

      cumulativeSuccess++;

      const dayIndex = Math.floor((log.timestamp - sortedLogs[0].timestamp) / dayMs);
      const dayLabel = new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (!data[dayIndex]) {
        data[dayIndex] = {
          day: dayLabel,
          executions: 0,
          cumulativeSuccess: 0,
          cumulativeVolume: 0,
        };
      }

      data[dayIndex].executions++;
      if (log.success) data[dayIndex].cumulativeSuccess++;
      data[dayIndex].cumulativeVolume += log.volume || 0;
    }

    return data.filter(d => d).map(d => ({
      ...d,
      successRate: Math.round((d.cumulativeSuccess / d.executions) * 100),
    }));
  }
  
  const data = [];
  const days = Math.min(30, Math.max(7, Math.floor(executions / 5)));
  let cumulativeSuccess = 0;
  let cumulativeVolume = 0;
  
  for (let i = days; i >= 0; i--) {
    const dayExecutions = Math.max(1, Math.floor(executions / days));
    const daySuccess = Math.floor(dayExecutions * (successRate / 100));
    const dayVolume = Math.floor(volume / days * (0.8 + Math.random() * 0.4));
    
    cumulativeSuccess += daySuccess;
    cumulativeVolume += dayVolume;
    
    data.push({
      day: `Day ${days - i + 1}`,
      executions: dayExecutions,
      cumulativeSuccess: cumulativeSuccess,
      cumulativeVolume: cumulativeVolume,
      successRate: Math.round((cumulativeSuccess / (cumulativeSuccess + (dayExecutions - daySuccess))) * 100),
    });
  }
  return data;
}

type ChartType = 'volume' | 'success' | 'executions';

export default function PerformanceChart({ totalExecutions, successfulExecutions, totalVolume, uptimeScore, executionHistory }: PerformanceChartProps) {
  const [chartType, setChartType] = useState<ChartType>('success');
  
  const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 100;
  const data = generateChartData(totalExecutions, successRate, totalVolume, executionHistory);
  const isRealData = executionHistory && executionHistory.length > 0;

  return (
    <div className="chart-container">
      <div className="chart-tabs">
        <button className={chartType === 'success' ? 'active' : ''} onClick={() => setChartType('success')}>
          📈 Success Rate
        </button>
        <button className={chartType === 'volume' ? 'active' : ''} onClick={() => setChartType('volume')}>
          💰 Volume
        </button>
        <button className={chartType === 'executions' ? 'active' : ''} onClick={() => setChartType('executions')}>
          🔢 Executions
        </button>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={200}>
          {chartType === 'success' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#666" fontSize={10} />
              <YAxis domain={[0, 100]} stroke="#666" fontSize={10} />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="successRate" stroke="#22c55e" fillOpacity={1} fill="url(#colorSuccess)" />
            </AreaChart>
          ) : chartType === 'volume' ? (
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} tickFormatter={(v) => `${(v/1e9).toFixed(1)}B`} />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }}
                formatter={(value: number) => [`${(value/1e9).toFixed(2)} SUI`, 'Volume']}
              />
              <Line type="monotone" dataKey="cumulativeVolume" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} />
              <Tooltip 
                contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="executions" stroke="#ec4899" strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="chart-stats">
        <div className="stat">
          <span className="label">Avg/Day</span>
          <span className="value">{Math.round(totalExecutions / Math.max(1, data.length))}</span>
        </div>
        <div className="stat">
          <span className="label">Total</span>
          <span className="value">{totalExecutions}</span>
        </div>
        <div className="stat">
          <span className="label">Success Rate</span>
          <span className="value" style={{ color: successRate >= 80 ? '#22c55e' : '#ef4444' }}>{successRate}%</span>
        </div>
        <div className="stat">
          <span className="label">Data</span>
          <span className="value" style={{ color: isRealData ? '#22c55e' : '#f59e0b', fontSize: '11px' }}>
            {isRealData ? `📊 ${executionHistory?.length} real` : '🎲 simulated'}
          </span>
        </div>
      </div>

      <style jsx>{`
        .chart-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }
        .chart-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .chart-tabs button {
          padding: 8px 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .chart-tabs button:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }
        .chart-tabs button.active {
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border-color: transparent;
          color: white;
        }
        .chart-wrapper {
          margin: 16px 0;
        }
        .chart-stats {
          display: flex;
          justify-content: space-around;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }
        .stat {
          text-align: center;
        }
        .stat .label {
          display: block;
          color: var(--text-muted);
          font-size: 11px;
        }
        .stat .value {
          color: var(--text-primary);
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}