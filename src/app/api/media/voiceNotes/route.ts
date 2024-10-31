// app/api/media/voiceNotes/route.js
// import fetch from 'node-fetch';
import { NextResponse, NextRequest } from 'next/server';

// export async function GET(request: Request) {
//     const { searchParams } = new URL(request.url);
//     const chatId = searchParams.get('chat_id');
//     const botToken = process.env.TELEGRAM_BOT_TOKEN;

//     if (!chatId || !botToken) {
//         return NextResponse.json({ error: 'Missing chat_id or Telegram bot token' }, { status: 400 });
//     }

//     try {
//         // Fetch updates from the Telegram API
//         const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
//         const data = await response.json() as { ok: boolean; description?: string; result: any[] };

//         if (!data.ok) {
//             throw new Error(`Telegram API error: ${data.description}`);
//         }

//         // Filter for voice messages in the specified chat
//         console.log('Logging data result', data)
//         const voiceNotes = data.result
//             .filter(update => update.message && update.message.voice && update.message.chat.id.toString() === chatId)
//             .map(update => ({
//                 file_id: update.message.voice.file_id,
//                 duration: update.message.voice.duration,
//                 date: new Date(update.message.date * 1000), // Convert from Unix timestamp
//                 chat_id: update.message.chat.id,
//             }));

//         // Log voice note metadata to the console
//         console.log('Fetched Voice Notes:', voiceNotes);

//         // Return the voice notes as a JSON response
//         return NextResponse.json({ success: true, voiceNotes });
//     } catch (error) {
//         console.error('Error fetching voice notes:', error);
//         return NextResponse.json({ error: 'Failed to fetch voice notes' }, { status: 500 });
//     }
// }

// Add a new POST endpoint for the webhook
export async function POST(request: NextRequest) {
    const update = await request.json(); // Parse the incoming JSON data

    // Process the update (you can add your logic here)
    console.log('Received update from Telegram:', update);

    // Respond with a 200 OK to acknowledge receipt of the update
    return NextResponse.json({ status: 'success' }, { status: 200 });
}
