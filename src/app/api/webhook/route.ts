import { NextRequest, NextResponse } from 'next/server';
import { createWebhookHandler as createStoryingWebhookHandler } from '@/bots/storying/bot';
// Import additional bots and their handlers as needed
// import { createWebhookHandler as createAnotherBotWebhookHandler } from '@/bots/anotherBot';

// Define a type for valid bot identifiers
type BotIdentifier = 'storying'; // Add more identifiers as needed

// Define a more specific type for the webhook handler
type WebhookHandler = (req: NextRequest, res: { end: () => void; status: (code: number) => { json: (json: Record<string, unknown>) => NextResponse; send: (json: Record<string, unknown>) => NextResponse; }; }) => Promise<void>;

const webhookHandlers: Record<BotIdentifier, WebhookHandler> = {
    'storying': createStoryingWebhookHandler(),
    // 'anotherBot': createAnotherBotWebhookHandler(), // Uncomment for additional bots
};

export async function POST(request: NextRequest) {
    // Determine which bot to use based on the request or some other logic
    const botIdentifier = request.headers.get('X-Bot-Identifier') as BotIdentifier | null; // Cast to BotIdentifier or null

    // Check if botIdentifier is null or undefined
    if (!botIdentifier) {
        return NextResponse.json({ error: 'Bot identifier is required' }, { status: 400 });
    }

    const webhookHandler = webhookHandlers[botIdentifier];

    // Call the appropriate webhook handler
    return webhookHandler(request, {
        end: () => {},
        status: (code: number) => ({
            json: (json: Record<string, unknown>) => NextResponse.json(json, { status: code }),
            send: (json: Record<string, unknown>) => NextResponse.json(json),
        }),
    });
}
