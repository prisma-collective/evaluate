import { useRouter } from 'next/router';
import Timeline from './Timeline';
import AddEntryForm from './AddEntryForm';

async function fetchTimelineEntries(event_id: string) {
    const res = await fetch(`/api/timeline?event_id=${event_id}`);
    if (!res.ok) {
        throw new Error('Failed to fetch timeline entries');
    }
    return res.json();
}

export default async function EventPage() {
    const router = useRouter();
    const { event_id } = router.query;

    // Check if event_id is available
    if (!event_id) {
        return <div>Loading...</div>; // Handle loading state
    }

    // Fetch events based on event_id
    const events = await fetchTimelineEntries(event_id as string);

    return (
        <div>
            <h1>Interactive Timeline for {event_id}</h1>
            <Timeline events={events} />
            <AddEntryForm />
        </div>
    );
}