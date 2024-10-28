// src/app/api/timeline/route.js
import { PrismaClient } from '@prisma/client';
import { VercelBlobStorage } from '@vercel/blob-storage';

const prisma = new PrismaClient();
const blobStorage = new VercelBlobStorage();

export async function POST(req) {
    try {
        const formData = await req.formData();
        const type = formData.get('type');
        const preview = formData.get('preview');
        const text = type === 'text' ? formData.get('text') : null;
        const file = formData.get('file');

        let mediaUrl = '';
        if (file) {
            // Upload file to Vercel Blob Storage
            const uploadResult = await blobStorage.upload(file);
            mediaUrl = uploadResult.url;  // Assuming it returns the URL of the uploaded file
        }

        const newEntry = await prisma.timelineEntry.create({
            data: { type, mediaUrl, text, preview }
        });

        return new Response(JSON.stringify(newEntry), { status: 201 });
    } catch (error) {
        console.error('Error creating entry:', error);
        return new Response('Error creating entry', { status: 500 });
    }
}

export async function GET(req) {
    try {
        const entries = await prisma.timelineEntry.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return new Response(JSON.stringify(entries), { status: 200 });
    } catch (error) {
        console.error('Error fetching entries:', error);
        return new Response('Error fetching entries', { status: 500 });
    }
}

