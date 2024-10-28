// src/app/event/page.tsx
'use client'; // This component needs to be a client component

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function EventContent() {
    const searchParams = useSearchParams(); // Get search parameters
    const router = useRouter(); // Get the router instance
    const slug = searchParams.get('slug'); // Extract the slug from search parameters

    useEffect(() => {
        // Check if slug is valid
        if (!slug || slug.length === 0) {
            // Redirect to the home page if slug is invalid
            router.push('/');
        }
    }, [slug, router]);

    // Optionally, you can return a loading state while checking the slug
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
}

export default function EventCatchAll() {
    return (
        <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
            <EventContent />
        </Suspense>
    );
}
