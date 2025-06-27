'use client';

import { useState } from 'react';

export default function RAGChat() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    
    const res = await fetch('/api/rag', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
    setQuery('');
    setLoading(false);
  };

  return (
    <div className="absolute bottom-4 right-4 w-1/3 bg-slate-800 bg-opacity-90 border border-slate-500 rounded-2xl p-4 shadow-xl z-50">
      <div className="h-80 overflow-y-auto space-y-4 flex-1 px-4 pr-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`text-sm ${msg.role === 'user' ? 'ml-auto max-w-[80%] bg-prisma-a/50 text-white p-3 rounded-xl text-left' : 'text-left text-gray-300'}`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendQuery()}
          className="flex-grow border border-slate-500 rounded px-2 py-1 text-sm bg-slate-600"
          placeholder="Ask the timeline..."
        />
        <button onClick={sendQuery} disabled={loading} className="bg-prisma-a text-white px-3 py-1 rounded text-sm">
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
