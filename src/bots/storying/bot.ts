import { Bot } from 'grammy';
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN);

if (!token) {
    throw new Error('Environment variable TELEGRAM_BOT_TOKEN is not set.');
}

// Initialize the bot with the token from environment variables
export const bot = new Bot(token);

// Attach middleware to handle incoming messages
bot.on('message', async (ctx) => {
    await ctx.reply('Hi there!');
});

// Modify the createWebhookHandler to accept NextRequest
export const createWebhookHandler = () => {
    return async (req: NextRequest, res: { end: () => void; status: (code: number) => { json: (json: Record<string, unknown>) => NextResponse; send: (json: Record<string, unknown>) => NextResponse; }; }) => {
        // Convert NextRequest to the format expected by the bot
        const body = await req.json(); // Assuming the body is JSON

        // Handle the incoming update
        try {
            await bot.handleUpdate(body); // Adjust this based on your bot's API
            res.status(200).send({ success: true });
        } catch (error) {
            console.error('Error handling webhook:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    };
};
