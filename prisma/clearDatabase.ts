// prisma/clearDatabase.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
    try {
        console.log('Deleting all timeline entries...');
        await prisma.timelineEntry.deleteMany(); // Deletes all entries from TimelineEntry

        console.log('Deleting all events...');
        await prisma.event.deleteMany(); // Deletes all entries from Event

        console.log('Database cleared successfully.');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await prisma.$disconnect(); // Disconnect after operations
    }
}

clearDatabase().catch((e) => {
    console.error(e);
    process.exit(1);
});
