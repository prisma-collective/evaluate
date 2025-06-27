export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import neo4j from 'neo4j-driver';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

const INDEX_NAME = 'voice-vector-index';
const TOP_K = 25;

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  // Step 1: Embed the query
  const embeddingResponse = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: query,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;

  // Step 2: Retrieve top-k chunks from Neo4j
  const session = driver.session();

  const result = await session.run(
    `
    CALL db.index.vector.queryNodes($indexName, $topK, $embedding)
    YIELD node, score
    WHERE $label IN labels(node)
    RETURN node.chunk_text AS content
  `,
    {
      indexName: INDEX_NAME,
      topK: TOP_K,
      embedding: queryEmbedding,
      label: 'VoiceChunk',
    }
  );

  await session.close();

  const chunks = result.records.map((r) => r.get('content')).filter(Boolean);

  const context = chunks.join('\n---\n');

  // Step 3: Feed retrieved context + original query to LLM
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant. Use the provided context to answer the question.`,
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion:\n${query}`,
      },
    ],
  });

  const answer = completion.choices[0].message.content;

  return NextResponse.json({ answer });
}
