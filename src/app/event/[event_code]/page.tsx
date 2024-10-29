"use client";

import { useEffect, useState, use } from 'react';
import React from 'react';
import AddEntryForm from '../AddEntryForm'; // Import the AddEntryForm component
import Timeline from '../Timeline';

// Define the timeline entry interface
interface TimelineEntry {
    id: number;
    type: string;
    mediaUrl: string | null; // Allow undefined
    text: string | null; // Change from string | undefined to string | null
    preview: string | null; // Optional and can be null
    happenedAt: Date; // Use Date for JavaScript Date object
    createdAt: Date; // Use Date for JavaScript Date object
    event_code: string; // Foreign key to reference the Event
}

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
            console.log('Response status:', res.status);
            
            if (res.ok) {
                const data: TimelineEntry[] = await res.json(); // Expecting an array directly
                console.log('Fetched event data, length:', data.entries.length);
                console.log('Setting event state'); // Log before setting state
                setEventEntries({ entries: data });
            } else {
                console.error('Failed to fetch timeline entries, status:', res.status);
                setError('Failed to fetch timeline entries');
            }
            console.log('Setting loading state to false'); // Log before setting state
            setLoading(false);
        };

        fetchEventTimeline();
    }, [event_code]);

    // Render phase
    console.log('Rendering EventPage'); // Log during render

    if (loading) return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
    if (error) return <div className='flex items-center justify-center min-h-screen'>{error}</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col items-center justify-start pt-20">
                <h1 className="text-center mb-4">Timeline entries for event code: {event_code}</h1>
                <AddEntryForm />
            </div>
            
            <div className="flex-grow flex items-center justify-center md:justify-start">
                <div className="w-full h-full flex flex-col justify-end">
                    <div className="hidden md:flex md:items-center md:justify-center w-full h-full">
                        <Timeline entries={eventEntries.entries} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPage;
