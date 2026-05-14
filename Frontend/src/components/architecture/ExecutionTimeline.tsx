'use client';

const executionSteps = [
  {
    step: 1,
    title: 'Agent Executa Trade',
    description: 'O agente IA analisa o mercado DeepBook e executa um swap',
    details: ['Análise de oportunidade', 'Preparação de transação', 'Estimativa de slippage'],
    icon: '🤖',
    color: 'from-purple-500 to-purple-600',
  },
  {
    step: 2,
    title: 'Contract Registra',
    description: 'Smart contract Move registra o resultado da execução on-chain',
    details: ['Atualiza métricas', 'Calcula sucesso/falha', 'Emite evento'],
    icon: '📜',
    color: 'from-blue-500 to-blue-600',
  },
  {
    step: 3,
    title: 'MemWal Armazena',
    description: 'Logs detalhados são persistidos no MemWal de forma descentralizada',
    details: ['Serializa log completo', 'Armazena em blob', 'Cria sessão'],
    icon: '💾',
    color: 'from-green-500 to-green-600',
  },
  {
    step: 4,
    title: 'Frontend Exibe',
    description: 'Dashboard atualiza com as novas métricas e dados do agente',
    details: ['Query ReputationObject', 'Busca logs em MemWal', 'Renderiza dashboard'],
    icon: '📊',
    color: 'from-amber-500 to-amber-600',
  },
];

export default function ExecutionTimeline() {
  return (
    <div className="w-full">
      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-700 to-slate-600 -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-12">
            {executionSteps.map((step, idx) => (
              <div key={step.step} className="relative">
                {/* Step content */}
                <div className={`grid grid-cols-2 gap-8 items-center ${idx % 2 === 0 ? '' : 'direction-rtl'}`}>
                  {/* Left side (or right for alternating) */}
                  <div className={idx % 2 === 0 ? 'text-right pr-12' : 'col-start-2'}>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-end gap-2">
                        <span>{step.title}</span>
                        <span className="text-2xl">{step.icon}</span>
                      </h3>
                      <p className="text-sm text-slate-300 mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-1">
                        {step.details.map((detail, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-center justify-end gap-2">
                            <span>{detail}</span>
                            <span>→</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center circle */}
                  <div className="absolute left-1/2 top-8 -translate-x-1/2 z-10 flex items-center justify-center">
                    <div className={`bg-gradient-to-br ${step.color} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg border-4 border-slate-900`}>
                      {step.step}
                    </div>
                  </div>

                  {/* Right side (or left for alternating) */}
                  <div className={idx % 2 === 0 ? 'col-start-2' : 'text-left pl-12'}>
                    <div className="h-24 flex items-center justify-center">
                      <div className={`text-center p-4 bg-slate-900/50 rounded-lg`}>
                        <p className="text-xs text-slate-400">
                          {step.step < 4 ? '⏱️ ~500ms' : '✓ Real-time'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-6">
        {executionSteps.map((step) => (
          <div key={step.step} className="relative pl-12">
            {/* Timeline dot and line */}
            <div className="absolute left-0 top-0 flex flex-col items-center">
              <div className={`bg-gradient-to-br ${step.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {step.step}
              </div>
              {step.step < 4 && (
                <div className="w-1 h-12 bg-gradient-to-b from-slate-700 to-slate-600" />
              )}
            </div>

            {/* Content */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span>{step.icon}</span>
                <span>{step.title}</span>
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                {step.description}
              </p>
              <ul className="space-y-1">
                {step.details.map((detail, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="mt-12 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-6">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span>💡</span> Como Funciona
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed">
          Cada execução de trade passa por um pipeline de 4 etapas: o agente executa, o contrato registra as métricas on-chain,
          os logs são armazenados de forma persistente no MemWal, e por fim o frontend consulta e exibe as informações em tempo real.
          Isso garante transparência total, imutabilidade e confiança verificável.
        </p>
      </div>
    </div>
  );
}
