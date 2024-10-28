// src/app/event/page.js
import { useRouter } from 'next/router';

export default function EventCatchAll() {
    const router = useRouter();
    const { slug } = router.query;

    // Check if slug is valid, if not, redirect or show a 404
    if (!slug || slug.length === 0) {
        return <div>404 - Event Not Found</div>; // Or redirect to a specific event
    }

    return null; // No content to display
}