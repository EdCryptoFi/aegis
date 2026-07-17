'use client';

export default function PipelineFlowDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 min-w-max md:min-w-full">
        {/* Desktop version */}
        <div className="hidden md:flex items-center justify-center gap-4 min-h-48">
          {/* Agent Box */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 w-40 text-center shadow-lg">
              <div className="text-3xl mb-2">🤖</div>
              <div className="font-bold text-white">Agent (SDK)</div>
              <div className="text-xs text-purple-100 mt-1">Execute Trade</div>
            </div>
            <div className="text-xs text-slate-400 mt-2 text-center">TypeScript<br/>Sui SDK</div>
          </div>

          {/* Arrow 1 */}
          <div className="flex flex-col items-center justify-center h-32">
            <div className="text-2xl mb-2">→</div>
            <div className="text-xs text-slate-400 text-center">Executa<br/>Trade</div>
          </div>

          {/* Contract Box */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 w-40 text-center shadow-lg">
              <div className="text-3xl mb-2">📜</div>
              <div className="font-bold text-white">Smart Contract</div>
              <div className="text-xs text-blue-100 mt-1">Record Execution</div>
            </div>
            <div className="text-xs text-slate-400 mt-2 text-center">Move<br/>ReputationObject</div>
          </div>

          {/* Arrow 2 */}
          <div className="flex flex-col items-center justify-center h-32">
            <div className="text-2xl mb-2">→</div>
            <div className="text-xs text-slate-400 text-center">Registra<br/>Métricas</div>
          </div>

          {/* Storage Box */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 w-40 text-center shadow-lg">
              <div className="text-3xl mb-2">💾</div>
              <div className="font-bold text-white">MemWal Storage</div>
              <div className="text-xs text-green-100 mt-1">Store Logs</div>
            </div>
            <div className="text-xs text-slate-400 mt-2 text-center">Distributed<br/>Persistent Memory</div>
          </div>

          {/* Arrow 3 */}
          <div className="flex flex-col items-center justify-center h-32">
            <div className="text-2xl mb-2">→</div>
            <div className="text-xs text-slate-400 text-center">Armazena<br/>Logs</div>
          </div>

          {/* Frontend Box */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 w-40 text-center shadow-lg">
              <div className="text-3xl mb-2">📊</div>
              <div className="font-bold text-white">Frontend</div>
              <div className="text-xs text-amber-100 mt-1">Display Metrics</div>
            </div>
            <div className="text-xs text-slate-400 mt-2 text-center">Next.js<br/>React Dashboard</div>
          </div>
        </div>

        {/* Mobile version - Vertical */}
        <div className="flex md:hidden flex-col items-center gap-6">
          {/* Agent */}
          <div className="flex flex-col items-center w-full">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 w-32 text-center shadow-lg">
              <div className="text-2xl mb-1">🤖</div>
              <div className="font-bold text-white text-sm">Agent</div>
            </div>
            <div className="text-xs text-slate-400 mt-1">TypeScript SDK</div>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-slate-400">↓</div>

          {/* Contract */}
          <div className="flex flex-col items-center w-full">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 w-32 text-center shadow-lg">
              <div className="text-2xl mb-1">📜</div>
              <div className="font-bold text-white text-sm">Contract</div>
            </div>
            <div className="text-xs text-slate-400 mt-1">Move</div>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-slate-400">↓</div>

          {/* Storage */}
          <div className="flex flex-col items-center w-full">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 w-32 text-center shadow-lg">
              <div className="text-2xl mb-1">💾</div>
              <div className="font-bold text-white text-sm">MemWal</div>
            </div>
            <div className="text-xs text-slate-400 mt-1">Storage</div>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-slate-400">↓</div>

          {/* Frontend */}
          <div className="flex flex-col items-center w-full">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 w-32 text-center shadow-lg">
              <div className="text-2xl mb-1">📊</div>
              <div className="font-bold text-white text-sm">Frontend</div>
            </div>
            <div className="text-xs text-slate-400 mt-1">Next.js</div>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t border-slate-700">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Onchain Verification</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Todas as execuções são registradas no blockchain Sui de forma imutável
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Persistent Logs</h4>
                <p className="text-xs text-slate-400 mt-1">
                  MemWal garante disponibilidade permanente dos logs de execução
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Reputation Score</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Score calculado em tempo real baseado em métricas de execução
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏅</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Badge Rewards</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Agentes ganham badges (Bronze, Silver, Gold) baseado em desempenho
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
