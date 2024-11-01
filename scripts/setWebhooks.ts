import { readFileSync } from 'fs';
import { join } from 'path';
import { Bot } from 'grammy';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const host = process.env.VERCEL_URL; // Get the Vercel URL from environment variables
console.log('VERCEL_URL:', process.env.VERCEL_URL);

const webhookBase = `${host}/api/webhook`; // Set the webhook URL or use the default

async function setWebhookForBot(bot: Bot, botName: string) {
    const webhook = `${webhookBase}/${botName}`; // Set a unique webhook for each bot
    try {
        await bot.api.setWebhook(webhook);
        console.log(`Webhook set for ${botName}: ${webhook}`);
    } catch (error) {
        console.error(`Failed to set webhook for ${botName}:`, error);
    }
}

async function setWebhooks() {
    // Load bot configurations from JSON file
    const configPath = join(process.cwd(), 'bots.json'); // Path to the configuration file
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));

    for (const botConfig of config.bots) {
        const { name, path } = botConfig;
        console.log(`Importing bot from file: ${path}`);

        // Dynamically import the bot module
        const botModule = await import(path);

        if (botModule.bot) {
            console.log(`Setting webhook for bot: ${name}`);
            await setWebhookForBot(botModule.bot, name);
        } else {
            console.warn(`No bot found in module: ${path}`);
        }
    }

    console.log('All webhooks have been processed.');
}

// Call the function to set the webhooks
void setWebhooks();
