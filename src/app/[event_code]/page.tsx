"use client";

import { useEffect, useState, use, useRef } from 'react';
import React from 'react';
import Timeline from '@/components/Timeline';
import RAGChat from '@/components/RAGChat';

export interface Node {
  id: string | number | null; // Some IDs are numbers (e.g., TelegramChat), some are strings (UUIDs), some null
  label: string; // e.g., 'Participant', 'TextContent', 'Voice', 'TelegramChat'
  properties: Record<string, unknown>; // Properties vary by label
}

export interface TimelineEntry {
  id: string;
  date: Date; // Normalize this to a real Date object in preprocessing
  connections: Node[];
}

interface TimelineEntries {
  entries: TimelineEntry[];
}

// Define the expected shape of params
interface Params {
    event_code: string;
}

const EventPage = ({ params }: { params: Promise<Params> }) => {
    // Unwrap params using React.use() with type assertion
    const { event_code } = use(params) as Params; // Assert the type of params

    const [eventEntries, setEventEntries] = useState<TimelineEntries>({ entries: [] }); // Initialize with an empty entries array
    const [error, setError] = useState<string | null>(null);
    const entriesRef = useRef<TimelineEntry[]>([]);

    useEffect(() => {
        const fetchEventTimelineStream = async () => {
          console.log('Fetching event timeline stream');
          console.log(`${process.env.NEXT_PUBLIC_TIMELINING_URI}/api/visualise/nodes?event_code=${event_code}`);
          const res = await fetch(`${process.env.NEXT_PUBLIC_TIMELINING_URI}/api/visualise/nodes?event_code=${event_code}`);
          if (!res.body) {
            setError('No response body');
            return;
          }
      
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let isFirstLine = true;
          let tempEntries: TimelineEntry[] = [];

          const flushInterval = 100; // ms
          
          const flushToState = () => {
            if (tempEntries.length > 0) {
              entriesRef.current = [...entriesRef.current, ...tempEntries];
              setEventEntries({ entries: [...entriesRef.current] });
              tempEntries = [];
            }
          };
          
          const flushTimer = setInterval(flushToState, flushInterval);
      
          // Start flushing every 100ms
          console.log('Flush timer started');

          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
        
              buffer += decoder.decode(value, { stream: true });
        
              const lines = buffer.split('\n');
              buffer = lines.pop() || ''; // Last line might be incomplete

              let i = 0;
        
              for (const line of lines) {
                try {
                  const entry = JSON.parse(line);

                  // Skip the dummy ping if it's the first line and doesn't have `happenedAt` or other expected fields
                  if (isFirstLine) {
                    isFirstLine = false;
                    if (!entry.happenedAt || !entry.id) {
                      console.log('Skipping dummy line:', entry);
                      continue;
                    }
                  }

                  if (i < 5 || i > lines.length - 5) console.log('Parsed entry (first/ last 5):', entry);
                  i++;

                  tempEntries.push(entry); // Buffer instead of setState directly
                } catch (err) {
                  console.error('Failed to parse line', line, err);
                }
              }
            }

            // Final flush after stream ends
            flushToState();
          } catch (err) {
            console.error('Streaming error', err);
            setError('Streaming error');
          } finally {
            clearInterval(flushTimer); // Stop flushing
          }
        };
      
        if (event_code) {
          fetchEventTimelineStream();
        } else {
          setError('Missing event code');
        }
      }, [event_code]);

    // Render phase
    console.log('Rendering EventPage'); // Log during render

    if (error) return <div className='flex items-center justify-center min-h-screen'>{error}</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col items-center justify-start pt-40">
                <h1 className="text-center text-gray-200">Timeline entries for {event_code}</h1>
                <p className='text-center text-sm text-gray-400'>{eventEntries.entries.length}</p>
            </div>
            
            <div className="flex-grow flex items-center justify-center md:justify-start">
                <div className="w-full h-full flex flex-col justify-end">
                    <div className="hidden md:flex md:items-center md:justify-center w-full h-full">
                        <Timeline entries={eventEntries.entries} />
                        <RAGChat />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPage;
