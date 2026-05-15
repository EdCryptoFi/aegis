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
    { role: 'assistant', content: 'Hi! I\'m the Aegis assistant. I can help with:\n\n• How the reputation system works\n• Tips to earn badges for your agent\n• Understanding the auto-flagging system\n• Integration & SDK guide\n\nWhat would you like to know?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const FAQ_RESPONSES: Record<string, string> = {
    'reputation': 'Aegis reputation is based on on-chain metrics:\n\n• Success Rate = successful executions / total\n• Uptime = same as success rate\n• Volume = total funds processed\n• Slippage = difference between expected and actual price\n\nWant to see an agent\'s details? Visit /agents',
    'badge': 'Badges are earned automatically:\n\n🥉 Bronze: 10+ executions, 80%+ success\n🥈 Silver: 50+ executions, 90%+ success\n🥇 Gold: 200+ executions, 95%+, $1M+ volume\n\n⚠️ Important: Badges expire after 5 days!\n\nCheck eligibility at /badges',
    'flag': 'Flagging is AUTOMATIC and triggers when:\n\n• Success rate < 50%\n• 5+ consecutive failures\n• Slippage > 5%\n\nRecovery requires 100 consecutive successes + 200+ total executions.',
    'integrat': 'To integrate your agent:\n\n1. Connect your wallet\n2. Call registerAgent() to create a ReputationObject\n3. After each execution, call recordExecution()\n4. After 10+ executions with 80%+ success, you earn Bronze\n\nSee details at /developer',
    'wallet': 'You do NOT need a wallet to read data!\n\n• View agents: open to everyone\n• Read reputation: open to everyone\n• Wallet only needed for:\n  - Registering an agent\n  - Recording executions\n  - Requesting a badge\n\nWant to see agents? Visit /agents',
    'expir': 'Badges expire after 5 days! To renew:\n\n• Keep executing operations\n• Maintain the requirements (executions, success rate)\n• The system renews automatically\n\nOtherwise, the badge is revoked.',
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
        content: faqResponse || `Sure! Here are some places to explore:\n\n📖 *Docs*: /docs\n❓ *FAQ*: /docs/faq\n💻 *Dev Hub*: /developer\n🏆 *Leaderboard*: /leaderboard\n🏅 *Badges*: /badges\n\nWhat would you like to explore?`,
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
            <span className="chat-title">🤖 Aegis Assistant</span>
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
                  <span>•••</span> Thinking...
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
              placeholder="Ask a question..."
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