// src/app/api/timeline/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Adjust the import based on your db setup

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url); // Get the URL object from the request
    const event_code = searchParams.get('event_code'); // Extract the event_id from the query parameters

    console.log('Received event_code:', event_code); // Log the received event_code

    if (!event_code) {
        return NextResponse.json({ error: 'Event code required' }, { status: 400 });
    }

    try {
        console.log('Querying for event_code:', event_code); // Log the event_code being queried
        const events = await prisma.timelineEntry.findMany({
            where: { event_code: event_code },
        });
        console.log('Retrieved events:', events); // Log the retrieved events

        if (!events) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.error();
    }
}
