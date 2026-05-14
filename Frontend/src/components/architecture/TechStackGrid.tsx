'use client';

const technologies = [
  {
    name: 'Sui Blockchain',
    category: 'Layer 1',
    icon: '⛓️',
    description: 'Layer-1 blockchain rápido e escalável',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Move',
    category: 'Smart Contracts',
    icon: '📜',
    description: 'Linguagem de programação para contratos Sui',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    name: 'TypeScript',
    category: 'Backend',
    icon: '🔧',
    description: 'Linguagem tipada para SDK e agentes',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'Sui SDK',
    category: 'Integration',
    icon: '🔌',
    description: 'Biblioteca oficial para interagir com Sui',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'MemWal',
    category: 'Storage',
    icon: '💾',
    description: 'Protocolo de memória persistente descentralizada',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Walrus',
    category: 'Blob Storage',
    icon: '📦',
    description: 'Sistema de armazenamento de blobs on-chain',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Next.js 14',
    category: 'Frontend',
    icon: '⚡',
    description: 'Framework React com SSR e otimizações',
    color: 'from-gray-600 to-gray-800',
  },
  {
    name: 'React 18',
    category: 'UI Library',
    icon: '⚛️',
    description: 'Biblioteca para componentes interativos',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    icon: '🎨',
    description: 'Framework de CSS utility-first',
    color: 'from-cyan-400 to-blue-400',
  },
  {
    name: 'DeepBook',
    category: 'Trading',
    icon: '📈',
    description: 'Protocolo de exchange descentralizado na Sui',
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'React Query',
    category: 'Data Fetching',
    icon: '🔄',
    description: 'Gerenciamento de estado assíncrono',
    color: 'from-red-500 to-pink-500',
  },
  {
    name: 'Recharts',
    category: 'Visualization',
    icon: '📊',
    description: 'Biblioteca de gráficos para React',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function TechStackGrid() {
  return (
    <div className="w-full">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className={`bg-gradient-to-br ${tech.color} p-0.5 rounded-xl hover:shadow-lg transition-shadow`}
          >
            <div className="bg-slate-900 rounded-xl p-5 h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{tech.icon}</div>
                  <div>
                    <h4 className="font-bold text-white">{tech.name}</h4>
                    <p className="text-xs text-slate-400">{tech.category}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 line-clamp-2">
                {tech.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Layer 1 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="flex items-center gap-2 font-semibold text-white mb-3">
            <span className="text-xl">⛓️</span> Blockchain Layer
          </h4>
          <p className="text-sm text-slate-300 mb-3">
            Construído no Sui testnet com Move smart contracts para máxima segurança e escalabilidade.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Sui', 'Move', 'DeepBook'].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Backend */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="flex items-center gap-2 font-semibold text-white mb-3">
            <span className="text-xl">🔧</span> Backend & SDK
          </h4>
          <p className="text-sm text-slate-300 mb-3">
            TypeScript SDK com integração nativa ao Sui SDK para comunicação com contratos.
          </p>
          <div className="flex flex-wrap gap-2">
            {['TypeScript', 'Sui SDK', 'MemWal'].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Storage */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="flex items-center gap-2 font-semibold text-white mb-3">
            <span className="text-xl">💾</span> Persistent Storage
          </h4>
          <p className="text-sm text-slate-300 mb-3">
            MemWal + Walrus para armazenamento descentralizado de logs com disponibilidade permanente.
          </p>
          <div className="flex flex-wrap gap-2">
            {['MemWal', 'Walrus', 'Blob Storage'].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Frontend */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="flex items-center gap-2 font-semibold text-white mb-3">
            <span className="text-xl">📊</span> Frontend & UI
          </h4>
          <p className="text-sm text-slate-300 mb-3">
            Next.js + React com Tailwind CSS para interface responsiva e otimizada.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Next.js', 'React', 'Tailwind'].map((tag) => (
              <span
                key={tag}
                className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-xl p-6">
        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
          <span>🚀</span> Stack Moderno e Open
        </h4>
        <p className="text-sm text-slate-300">
          Todo o stack utiliza tecnologias modernas, bem mantidas e com comunidades ativas.
          Aegis é construído com foco em segurança, escalabilidade e experiência do usuário.
        </p>
      </div>
    </div>
  );
}
