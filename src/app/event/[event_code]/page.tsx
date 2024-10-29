"use client";

import { useEffect, useState, use } from 'react';
import React from 'react';
import AddEntryForm from '../AddEntryForm'; // Import the AddEntryForm component
import Timeline from '../Timeline';
import { Event, TimelineEntry } from '@prisma/client';
import Image from 'next/image';

// Define a new interface for the response data
interface TimelineEntries {
    entries: TimelineEntry[]; // Assuming the API returns an object with an 'entries' array
}

// Define the expected shape of params
interface Params {
    event_code: string;
}

const EventPage = ({ params }: { params: Promise<Params> }) => {
    // Unwrap params using React.use() with type assertion
    const { event_code } = use(params) as Params; // Assert the type of params

    const [eventEntries, setEventEntries] = useState<TimelineEntries>({ entries: [] }); // Initialize with an empty entries array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEventTimeline = async () => {
            if (!event_code) {
                console.error('event_code is undefined');
                setError('Event code is missing');
                setLoading(false);
                return;
            }
            console.log('Fetching timeline entries for code:', event_code);
            const res = await fetch(`/api/timeline?event_code=${event_code}`);
            console.log('Response status timeline api call:', res.status);
            
            if (res.ok) {
                const data: TimelineEntry[] = await res.json(); // Expecting an array directly
                console.log('Fetched event timeline data, length:', data.entries.length);
                console.log('Setting event state'); // Log before setting state
                setEventEntries({ entries: data });
            } else {
                console.error('Failed to fetch timeline entries, status:', res.status);
                setError('Failed to fetch timeline entries');
            }
            console.log('Setting loading state to false'); // Log before setting state
            setLoading(false);
        };

        const fetchEvent = async () => {
            // Fetch the event record
            const eventRes = await fetch(`/api/event?event_code=${encodeURIComponent(event_code)}`);
            if (eventRes.ok) {
                const eventData = await eventRes.json();
                console.log("Fetched event", eventData.event.title)
                setEvent(eventData.event); // Set the event record
            } else {
                console.error('Failed to fetch event record, status:', eventRes.status);
                setError('Failed to fetch event record');
            }
        }

        fetchEventTimeline();
        fetchEvent();
    }, [event_code]);

    // Render phase
    console.log('Rendering EventPage'); // Log during render

    if (loading) return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
    if (error) return <div className='flex items-center justify-center min-h-screen'>{error}</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <div className='absolute items-start justify-start p-10'>
                <a href="https://prisma.events" target="_blank" rel="noopener noreferrer" className="mb-6">
                    <Image 
                        src="/logo_colour_w_text.svg" // Replace with your logo path
                        alt="Prisma Logo" 
                        width={150} // Set the desired width
                        height={100} // Set the desired height
                        className="mb-4" // Optional: Add margin below the logo
                    />
                </a>
            </div>
            <div className="flex flex-col items-center justify-start pt-40">
                <h1 className='text-center text-4xl p-4'>{event ? event.title : 'Loading event...'}</h1>
                <h1 className="text-center mb-4 text-gray-400">Timeline entries for event code: {event_code}</h1>
            </div>
            
            <div className="flex-grow flex items-center justify-center md:justify-start">
                <div className="w-full h-full flex flex-col justify-end">
                    <div className="hidden md:flex md:items-center md:justify-center w-full h-full">
                        <Timeline entries={eventEntries.entries} />
                    </div>
                </div>
                <AddEntryForm />
            </div>
        </div>
    );
};

export default EventPage;
