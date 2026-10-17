import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages payload' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
      messages: messages.map((m: { role: 'system' | 'user' | 'assistant'; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ response: aiResponse });
  } catch (error: unknown) {
    console.error('Groq API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to communicate with AI provider.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}