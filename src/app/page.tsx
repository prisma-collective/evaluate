"use client";

import Image from 'next/image'; 
import './styles/style.css'; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import dotenv from 'dotenv';

dotenv.config()

export default function Home() {

  const router = useRouter(); // Initialise the router

  const [event_code, setEventCode] = useState<string>(""); // Ensure type is specified

  const handleSubmit = async (event_code: string) => {
      if (!event_code.trim()) {
          alert("Please enter an event code.");
          return;
      }

      try {
          const response = await fetch(`/api/event?event_code=${encodeURIComponent(event_code.trim())}`, {
              method: 'GET',
          });

          const data = await response.json();

          if (data.valid) {
              router.push(`/event/${event_code}`);
          } else {
              alert("Event code not found. Please enter a valid event code.");
          }
      } catch (error) {
          console.error("Error validating event ID:", error);
          alert("There was an issue validating the event ID. Please try again later.");
      }
  };

  return (
    <div className="h-screen relative">
      <div className="min-h-screen flex flex-col items-center justify-center relative z-20 pt-5 pb-5">
        <a href="https://prisma.events" target="_blank" rel="noopener noreferrer" className="mb-6">
          <Image 
              src="/prisma-name-text-dark.svg" 
              alt="Prisma Events Logo" 
              className="h-16 w-auto animate-spin-slow" 
              width={64} // Specify width
              height={64} // Specify height
          />
        </a>

        <div className="container mx-auto px-16 max-w-2xl">
          <div className="relative overflow-hidden flex flex-col">
            <div className="p-4 flex flex-col items-center justify-center">
              {/* Instructions */}
              <p className="text-gray-300 mb-6 text-center">
                Please enter a valid event code
              </p>
              <form onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission
                handleSubmit(event_code); // Call handleSubmit with the event ID
              }}>
                <input
                  type="text"
                  id="event_code"
                  name="event_code"
                  placeholder="Event code"
                  className="border border-gray-800 p-2 rounded text-center text-white bg-slate-900 w-80"
                  value={event_code} // Bind the input value to state
                  onChange={(e) => setEventCode(e.target.value)} // Update state on change
                  autoComplete="off" // Prevent browser from auto-filling
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
