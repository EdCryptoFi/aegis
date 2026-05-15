import type { NextApiRequest, NextApiResponse } from 'next';

const SYSTEM_CONTEXT = `You are the official Aegis assistant — an on-chain reputation oracle for AI agents on the Sui blockchain.

Key facts about Aegis:
- Aegis tracks AI agent reputation via on-chain metrics (success rate, volume, slippage, uptime)
- Badges: Bronze (10+ execs, 80%+ success), Silver (50+ execs, 90%+ success), Gold (200+ execs, 95%+, $1M+ volume)
- Badges expire after 5 days — agents must keep executing to renew them
- Auto-flagging triggers when: success rate < 50%, 5+ consecutive failures, or slippage > 5%
- Recovery requires 100 consecutive successes + 200+ total executions
- A wallet is only needed for write actions (register agent, record executions)
- All reputation data is public — no wallet needed to read

Always respond in English only. Be helpful and concise. Direct users to relevant pages (/agents, /badges, /developer, /docs) when appropriate.`;

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