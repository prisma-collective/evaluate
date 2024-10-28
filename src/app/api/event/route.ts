import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const event_code = url.searchParams.get('event_code');

    if (!event_code) {
        return NextResponse.json({ message: 'Event code required' }, { status: 400 });
    }

    try {
        // Check if the event code exists in the database
        const event = await prisma.event.findUnique({
            where: { code: event_code },
        });

        if (event) {
            return NextResponse.json({ valid: true }); // Event found
        } else {
            return NextResponse.json({ valid: false }, { status: 404 }); // Event not found
        }
    } catch (error) {
        console.error('Error validating event code:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
