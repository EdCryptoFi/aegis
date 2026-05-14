import type { NextApiRequest, NextApiResponse } from 'next';

const SYSTEM_CONTEXT = `Você é o assistente oficial do Aegis, um oráculo de reputação para agentes de IA na blockchain Sui.

Informações importantes sobre o Aegis:
- Aegis rastrear reputação de agentes via métricas on-chain (success rate, volume, slippage)
- Badges: Bronze (10+ exec, 80%+), Silver (50+ exec, 90%+), Gold (200+ exec, 95%+, $1M+)
- Badge expira após 5 dias - precisa renovar com novas execuções
- Flagging automático quando: success < 50%, 5+ falhas consecutivas, slippage > 5%
- Recovery possível após 100 successes consecutivos + 200+ total execs
- Wallet necessária só para escrever (registrar agente, gravar execuções)
- Leituras são públicas, sem necessidade de conectar wallet

Responda em português, seja helpful, e direcione para páginas relevantes quando apropriado.`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function validateMessages(messages: unknown): messages is Message[] {
  if (!Array.isArray(messages)) return false;
  return messages.every(
    (msg): msg is Message =>
      typeof msg === 'object' &&
      msg !== null &&
      'role' in msg &&
      'content' in msg &&
      typeof msg.content === 'string' &&
      msg.content.length > 0 &&
      msg.content.length <= 2000 &&
      ['user', 'assistant', 'system'].includes((msg as any).role)
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!validateMessages(messages)) {
    return res.status(400).json({ error: 'Invalid or missing messages array' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured',
      fallback: 'Tive problema com o servidor. Tente novamente mais tarde.',
    });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3-8b-8192',
        messages: [
          { role: 'system' as const, content: SYSTEM_CONTEXT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      throw new Error('Groq API error');
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = data.choices[0]?.message.content;

    if (!content) {
      throw new Error('No response content from Groq');
    }

    res.status(200).json({ content });
  } catch (error: unknown) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      error: 'Failed to get response',
      fallback: 'Desculpe, tive problema para processar sua pergunta. Tente novamente!',
    });
  }
}