import { Bot } from 'grammy';
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error('Environment variable TELEGRAM_BOT_TOKEN is not set.');
}

// Initialize the bot with the token from environment variables
const bot = new Bot(token);

// Flag to track if the bot has been initialized

let isInitialized = false;
console.log("Just after let: ", isInitialized)

// Attach middleware to handle incoming messages
bot.on('message', async (ctx) => {
    await ctx.reply('Hi there!');
});

// Function to initialize the bot
if (!isInitialized) {
    await bot.init(); // Initialize the bot
    isInitialized = true; // Set the flag to true after initialization
    console.log('Bot initialized successfully');
    console.log(isInitialized)
};

// Modify the createWebhookHandler to accept NextRequest
export const botUpdateProcessor = () => {
    return async (req: NextRequest) => {
        // Convert NextRequest to the format expected by the bot
        const body = await req.json(); // Assuming the body is JSON
        console.log('Received webhook update:', body);

        // Handle the incoming update
        try {
            await bot.handleUpdate(body);
            return NextResponse.json({ success: true }, { status: 200 });
        } catch (error) {
            console.error('Error handling webhook:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    };
};
