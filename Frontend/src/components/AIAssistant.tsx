'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente do Aegis. Posso ajudar com:\n\n• Explicar como funciona a reputação\n• Dicas para seu agente ganhar badges\n• Entender o sistema de flagging\n• Guia de integração\n\nO que gostaria de saber?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const FAQ_RESPONSES: Record<string, string> = {
    'reputação': 'A reputação no Aegis é baseada em métricas on-chain:\n\n• Success Rate = execuções bem-sucedidas / total\n• Uptime = mesma coisa que success rate\n• Volume = total de fundos processados\n• Slippage = diferença entre preço esperado e execução\n\nQuer ver os detalhes de um agente? Vá para /agents',
    'badge': 'As badges são conquistadas automaticamente:\n\n🥉 Bronze: 10+ execuções, 80%+ success\n🥈 Silver: 50+ execuções, 90%+ success\n🥇 Gold: 200+ execuções, 95%+, $1M+ volume\n\n⚠️ Importante: Badges expiram após 5 dias!\n\nQuer verificar elegibilidade? Vá para /badges',
    'flag': 'O flagging é AUTOMÁTICO! Ocorre quando:\n\n• Success rate < 50%\n• 5+ falhas consecutivas\n• Slippage > 5%\n\nPara recuperar, precisa de 100 successes consecutivos + 200+ total.',
    'integrar': 'Para integrar seu agente:\n\n1. Conecte sua wallet\n2. Execute registerAgent() para criar ReputationObject\n3. Após cada execução, chame recordExecution()\n\n4. Após 10+ execuções com 80%+ success, ganha Bronze\n\nVeja detalhes em /developer',
    'wallet': 'Você NÃO precisa de wallet para ler dados!\n\n• Ver agentes: aberto a todos\n• Ler reputação: aberto a todos\n• Conectar wallet apenas para:\n  - Registrar agente\n  - Gravar execução\n  - Solicitar badge\n\nQuer ver os agentes? Vá para /agents',
    'expir': 'As badges expiram após 5 dias! Para renovar:\n\n• Continue executando operações\n• Mantenha os requisitos (executions, success rate)\n• O sistema renova automaticamente\n\nCaso contrário, o badge é revogado.',
  };

  function getFAQResponse(question: string): string | null {
    const q = question.toLowerCase();
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (q.includes(key)) return response;
    }
    return null;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (data.content) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('No content');
      }
    } catch (error) {
      const faqResponse = getFAQResponse(input);
      const fallbackMessage: Message = {
        role: 'assistant',
        content: faqResponse || `Interessante! Posso ajudar com:\n\n📖 *Documentação*: /docs\n❓ *FAQ*: /docs/faq\n💻 *Dev Hub*: /developer\n🏆 *Leaderboard*: /leaderboard\n❌ *Badges*: /badges\n\nO que gostaria de explorar?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span className="chat-title">🤖 Assistente Aegis</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content typing">
                  <span>•••</span> Pensando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>

          <div className="chat-footer">
            <small>Powered by Groq</small>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .chat-toggle:hover { transform: scale(1.1); }
        .chat-window {
          position: fixed;
          bottom: 90px;
          right: 24px;
          width: 380px;
          height: 500px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          background: linear-gradient(135deg, #8b5cf620, #ec489920);
          border-radius: 16px 16px 0 0;
        }
        .chat-title { color: var(--text-primary); font-weight: 600; font-size: 14px; }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 16px; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .message { max-width: 85%; }
        .message.user { align-self: flex-end; }
        .message.assistant { align-self: flex-start; }
        .message-content { padding: 12px 16px; border-radius: 16px; font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
        .message.user .message-content { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; border-bottom-right-radius: 4px; }
        .message.assistant .message-content { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); border-bottom-left-radius: 4px; }
        .typing { color: var(--text-muted); font-style: italic; }
        .chat-input { display: flex; gap: 8px; padding: 16px; border-top: 1px solid var(--border-color); }
        .chat-input input { flex: 1; padding: 12px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 24px; color: var(--text-primary); font-size: 13px; outline: none; }
        .chat-input input:focus { border-color: var(--accent-primary); }
        .chat-input button { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #ec4899); border: none; color: white; cursor: pointer; font-size: 16px; transition: transform 0.2s; }
        .chat-input button:hover:not(:disabled) { transform: scale(1.1); }
        .chat-input button:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-footer { padding: 8px 16px; text-align: center; border-top: 1px solid var(--border-color); }
        .chat-footer small { color: var(--text-muted); font-size: 10px; }
        @media (max-width: 480px) {
          .chat-window { width: calc(100vw - 32px); right: 16px; bottom: 80px; height: 60vh; }
        }
      `}</style>
    </>
  );
}