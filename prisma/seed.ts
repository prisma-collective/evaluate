import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create an event
    const event = await prisma.event.create({
        data: {
            code: 'atreyu-barcelona',
            title: 'Atreyu Regenerative Investing Barcelona',
            description: 'A two-day event to introduce Atreyu\'s approach to regenerative investing.',
        },
    });

    console.log(`Seeded event: ${event.title} (Code: ${event.code})`);

    // Seed timeline entries associated with the created event
    const timelineEntries = await prisma.timelineEntry.createMany({
        data: [
            {
                type: 'text',
                mediaUrl: '',
                text: 'This is the first event entry.',
                preview: 'First event entry preview',
                event_code: event.code, // Associate with the created event
            },
            {
                type: 'audio',
                mediaUrl: 'https://example.com/audio1.mp3',
                text: null,
                preview: 'Audio event entry preview',
                event_code: event.code, // Associate with the created event
            },
            {
                type: 'video',
                mediaUrl: 'https://example.com/video1.mp4',
                text: null,
                preview: 'Video event entry preview',
                event_code: event.code, // Associate with the created event
            },
            {
                type: 'text',
                mediaUrl: '',
                text: 'This is the second event entry.',
                preview: 'Second event entry preview',
                event_code: event.code, // Associate with the created event
            },
        ],
    });

    console.log(`Seeded ${timelineEntries.count} entries to the database for event: ${event.title}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
