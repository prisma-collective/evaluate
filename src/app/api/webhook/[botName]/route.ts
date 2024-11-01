import { NextRequest, NextResponse } from 'next/server';
import { botUpdateProcessor as storyProcessor } from '@/bots/storying/bot';

// Instructing nextjs to always render this route, not cache (useful for webhooks)
export const dynamic = 'force-dynamic';

const botUpdateProcessors: Record<string, (request: NextRequest) => Promise<NextResponse>> = {
    'storying': storyProcessor(),
    // 'anotherBot': createAnotherBotUpdateProcessor(), // Uncomment for additional bots
};

export async function POST(request: NextRequest) {
    const { pathname } = new URL(request.url);
    const botName = pathname.split('/').pop(); // Extract the bot name from the URL

    if (!botName || !botUpdateProcessors[botName]) {
        return NextResponse.json({ error: 'Invalid bot identifier' }, { status: 400 });
    }

    const botUpdateProcessor = botUpdateProcessors[botName];

    // Call the appropriate webhook handler
    return botUpdateProcessor(request);
}
