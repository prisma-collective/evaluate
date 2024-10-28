"use client";

import { useEffect, useState, use } from 'react';
import React from 'react';

// Define the timeline entry interface
interface TimelineEntry {
    id: number;
    type: string;
    mediaUrl?: string; // Optional
    text?: string; // Optional
    preview?: string; // Optional
    createdAt: Date; // Use Date for JavaScript Date object
    event_code: string; // Foreign key to reference the Event
}

// Define the expected shape of params
interface Params {
    event_code: string;
}

const EventPage = ({ params }: { params: Promise<Params> }) => {
    // Unwrap params using React.use() with type assertion
    const { event_code } = use(params) as Params; // Assert the type of params

    const [eventEntires, setEventEntries] = useState<TimelineEntry[]>([]);
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
                setEventEntries(data);
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
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1>Timeline entries for event code: {event_code}</h1>
            {eventEntires.length ? (
                <ul>
                    {eventEntires.map(entry => (
                        <li key={entry.id}>
                            <h2>{entry.type}</h2>
                            <p>{entry.text}</p>
                            {entry.mediaUrl ? ( // Conditional rendering for the image
                                <img src={entry.mediaUrl} alt={entry.preview} />
                            ) : null} {/* Render nothing if mediaUrl is not available */}
                            <p>Created at: {entry.createdAt.toString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No entries found for this event.</p>
            )}
        </div>
    );
};

export default EventPage;
