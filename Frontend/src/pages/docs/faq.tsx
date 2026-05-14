'use client';

import Link from 'next/link';

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

export default function FAQPage() {
  return (
    <div className="docs-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="logo">📖 Aegis Docs</Link>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR.map((section) => (
            <div key={section.title} className="nav-section">
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className="docs-content">
        <h1>Frequently Asked Questions</h1>

        {FAQS.map((faq, i) => (
          <details key={i} className="faq-item">
            <summary>{faq.q}</summary>
            <p>{faq.a}</p>
          </details>
        ))}

        <section className="more-help">
          <h2>Still have questions?</h2>
          <p>Check our <Link href="/docs">full documentation</Link> or contact the team.</p>
        </section>

        <style jsx>{`
          .docs-layout {
            display: flex;
            min-height: 100vh;
            background: #0f0f1a;
          }
          .sidebar {
            width: 260px;
            background: #0a0a12;
            border-right: 1px solid #222;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
          }
          .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid #222;
          }
          .logo {
            color: #8b5cf6;
            font-size: 18px;
            font-weight: bold;
            text-decoration: none;
          }
          .sidebar-nav {
            padding: 20px 0;
          }
          .nav-section {
            margin-bottom: 20px;
          }
          .nav-section h3 {
            color: #666;
            font-size: 11px;
            text-transform: uppercase;
            padding: 0 20px;
            margin: 0 0 8px 0;
          }
          .nav-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .nav-section li a {
            display: block;
            padding: 8px 20px;
            color: #888;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s;
          }
          .nav-section li a:hover {
            color: #fff;
            background: rgba(139, 92, 246, 0.1);
          }
          .docs-content {
            flex: 1;
            margin-left: 260px;
            padding: 40px 60px;
            max-width: 800px;
          }
          h1 {
            color: #fff;
            font-size: 32px;
            margin: 0 0 40px 0;
          }
          .faq-item {
            background: #1a1a2e;
            border: 1px solid #333;
            border-radius: 8px;
            margin-bottom: 12px;
          }
          .faq-item summary {
            padding: 16px 20px;
            cursor: pointer;
            color: #fff;
            font-weight: 500;
            list-style: none;
          }
          .faq-item summary::-webkit-details-marker {
            display: none;
          }
          .faq-item summary::after {
            content: '▼';
            float: right;
            color: #666;
            font-size: 12px;
          }
          .faq-item[open] summary::after {
            content: '▲';
          }
          .faq-item p {
            padding: 0 20px 20px;
            color: #aaa;
            line-height: 1.6;
            margin: 0;
          }
          .more-help {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #222;
          }
          .more-help h2 {
            color: #fff;
            font-size: 20px;
            margin: 0 0 12px 0;
          }
          .more-help a {
            color: #8b5cf6;
          }
          @media (max-width: 768px) {
            .docs-layout { flex-direction: column; }
            .sidebar { position: static; width: 100%; }
            .docs-content { margin-left: 0; padding: 20px; }
          }
        `}</style>
      </main>
    </div>
  );
}