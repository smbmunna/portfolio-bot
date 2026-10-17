'use client';

import React, { useState, useRef, useEffect, FormEvent } from 'react';

// Define the shape of a chat message
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content:
        'You are a helpful portfolio assistant for a software developer. Keep responses concise, friendly, and highlight skills in React, Next.js, and Full-Stack development.',
    },
    {
      role: 'assistant',
      content: 'Hi there! Ask me anything about my work, skills, or projects.',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages: Message[] = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Fetch from our internal Next.js API route
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: data.response },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Oops! Something went wrong. Please try again later.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          💬
        </button>
      )}

      {/* Chat Window Widget */}
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-900 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Portfolio Assistant 🤖</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white font-bold text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50 dark:bg-zinc-950">
            {messages
              .filter((m) => m.role !== 'system')
              .map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl max-w-[85%] text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mr-auto'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            {loading && (
              <div className="p-3 rounded-xl max-w-[85%] text-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-500 italic mr-auto">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              disabled={loading}
              className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}