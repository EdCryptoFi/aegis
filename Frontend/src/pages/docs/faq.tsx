'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR = [
  { title: 'Getting Started', items: [
    { name: 'Introduction', href: '/docs' },
    { name: 'Developer Hub', href: '/developer' },
    { name: 'FAQ', href: '/docs/faq' },
  ]},
  { title: 'Resources', items: [
    { name: 'Terms & Privacy', href: '/docs/terms' },
    { name: 'GitHub', href: 'https://github.com/EdCryptoFi/aegis' },
  ]},
];

const FAQS = [
  {
    q: 'O que é o Aegis?',
    a: 'Aegis é um oráculo de reputação decentralized para agentes de IA na blockchain Sui. Ele rastreia métricas on-chain como taxa de sucesso, volume e slippage para criar uma pontuação de confiança verificável.'
  },
  {
    q: 'Como um agente é "flagged"?',
    a: 'O flagging é automático! Quando um agente registra execuções, o contrato inteligente verifica: taxa de sucesso < 50%, 5+ falhas consecutivas, ou slippage > 5%. Se qualquer condição for atingida, o agente é automaticamente marcado como "flagged".'
  },
  {
    q: 'Quem pode chamar record_execution()?',
    a: 'Qualquer pessoa! O sistema é permissionless - qualquer um pode registrar uma execução para qualquer agente. Isso cria um mecanismo de vigilância descentralizado onde ninguém pode omitir falhas.'
  },
  {
    q: 'Como funcionam as badges?',
    a: 'As badges são concedidas automaticamente quando um agente atinge os requisitos: Bronze (10+ exec, 80%+), Silver (50+ exec, 90%+), Gold (200+ exec, 95%+, $1M+ volume). A verificação é feita on-chain.'
  },
  {
    q: 'Os dados são realmente à prova de manipulação?',
    a: 'Sim! Todas as métricas são armazenadas em smart contracts na Sui. Uma vez que uma execução é registrada, ela não pode ser alterada ou apagada. O histórico é completamente auditável.'
  },
  {
    q: 'O que é Walrus e por que é usado?',
    a: 'Walrus é um sistema de armazenamento decentralized da Mysten Labs. Aegis usa Walrus para armazenar logs detalhados de execução que não caberiam on-chain. Isso cria um trail de auditoria completo.'
  },
  {
    q: 'Posso usar Aegis sem conectar minha wallet?',
    a: 'Sim! A leitura é completamente pública. Você pode verificar reputação de qualquer agente sem conectar wallet. Apenas para escrever (registrar agente, gravar execuções) é necessária uma wallet.'
  },
  {
    q: 'O que acontece se um agente for flagged?',
    a: 'Um agent flagged aparece com alerta vermelho no frontend. A flag não pode ser removida manualmente - o agente deve se recuperar com 100 execuções consecutivas bem-sucedidas + 200+ total.'
  },
  {
    q: 'Aegis dá advice financeiro?',
    a: 'NÃO. Aegis apenas mostra métricas. É responsabilidade do usuário fazer sua própria pesquisa (DYOR). A reputação é uma ferramenta, não uma garantia.'
  },
  {
    q: 'Como integrar meu agente com Aegis?',
    a: 'Use nosso SDK TypeScript! Faça npm i @aegis/sdk, chame registerAgent() para criar seu ReputationObject, e depois recordExecution() após cada operação. Veja /developer para detalhes.'
  },
  {
    q: 'Qual a diferença entre Aegis e MemWal?',
    a: 'MemWal = memória privada para agents (raciocínio, contexto criptografado). Aegis = reputação pública para terceiros (métricas on-chain verificáveis). Quer os dois? Ancore o blob_id do MemWal no ReputationObject do Aegis para auditoria vinculada.'
  },
  {
    q: 'Posso usar MemWal junto com Aegis?',
    a: 'Sim! Use MemWal para armazenar decisões e raciocínio privado do agente. Aegis registra as métricas públicas no blockchain. Link o blob_id do MemWal no ReputationObject para: (1) rastreabilidade completa, (2) verificação descentralizada, (3) auditoria imutável.'
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open ? 'border-cyan-primary/20 bg-surface-1' : 'border-[rgba(255,255,255,0.06)] bg-surface-0/60 hover:border-[rgba(255,255,255,0.12)]'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-text-primary font-medium text-sm pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-text-muted transition-transform duration-200 ${open ? 'rotate-180 text-cyan-primary' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-text-secondary text-sm leading-relaxed border-t border-[rgba(255,255,255,0.06)] pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div className="flex min-h-screen bg-bg-base">

      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 fixed h-screen overflow-y-auto bg-surface-0 border-r border-[rgba(255,255,255,0.06)] z-10">
        <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <Link href="/" className="flex items-center gap-2 text-cyan-primary font-bold text-base hover:text-mint-secondary transition-colors">
            <BookOpen size={18} />
            Aegis Docs
          </Link>
        </div>
        <nav className="py-5">
          {SIDEBAR.map((section) => (
            <div key={section.title} className="mb-5 px-5">
              <p className="text-text-muted text-[10px] font-semibold uppercase tracking-widest mb-2">{section.title}</p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith('http') ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-all"
                      >
                        <ExternalLink size={12} className="flex-shrink-0" />
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-xl text-sm transition-all ${
                          item.href === '/docs/faq'
                            ? 'bg-cyan-primary/10 text-cyan-primary'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 px-12 py-12 max-w-[860px]">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle size={24} className="text-cyan-primary" />
          <h1 className="font-display text-4xl font-bold text-text-primary">FAQ</h1>
        </div>
        <p className="text-text-secondary text-lg mb-10">Frequently asked questions about Aegis.</p>

        <div className="space-y-3 mb-12">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>

        <div className="rounded-2xl p-6 bg-cyan-primary/[0.05] border border-cyan-primary/20">
          <h2 className="font-display text-lg font-bold text-text-primary mb-2">Still have questions?</h2>
          <p className="text-text-secondary text-sm">
            Check our{' '}
            <Link href="/docs" className="text-cyan-primary hover:text-mint-secondary transition-colors underline">full documentation</Link>
            {' '}or contact the team on{' '}
            <a href="https://github.com/EdCryptoFi/aegis" target="_blank" rel="noopener noreferrer" className="text-cyan-primary hover:text-mint-secondary transition-colors underline">GitHub</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
