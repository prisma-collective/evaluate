"use client";

import './styles/globals.css'; 
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dotenv from 'dotenv';

dotenv.config()

export default function Home() {

  const router = useRouter(); // Initialise the router

  const [event_code, setEventCode] = useState<string>(""); // Ensure type is specified

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      router.push("/unsupported");
    }
  }, []);

  const handleSubmit = async (event_code: string) => {
      if (!event_code.trim()) {
          alert("Please enter an event code.");
          return;
      }

      try {
          if (event_code.trim() === "accra") {
              router.push(`/${encodeURIComponent(event_code)}`);
          } else {
              alert("Event code not found. Please enter a valid event code.");
          }
      } catch (error) {
          console.error("Error validating event code:", error);
          alert("There was an issue validating the event code. Please try again later.");
      }
  };

  return (
    <div className="h-screen relative">
      <div className="min-h-screen flex flex-col items-center justify-center relative z-20 pt-5 pb-5">
        <div className="container mx-auto px-16 max-w-2xl">
          <div className="relative overflow-hidden flex flex-col">
            <div className="p-4 flex flex-col items-center justify-center">
              {/* Instructions */}
              <p className="text-gray-300 mb-3 text-center">
                Please verify your Prisma ID to see the Cases you're currently subscribed to, or <a href="https://register.prisma.events/" className="text-prisma-a">register</a> to receive one.
              </p>
              <p className="text-gray-400 mb-6 text-center italic">
                ... or you can just type accra below.
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
                  className="border border-gray-800 p-2 rounded-xl text-center text-white bg-slate-800 w-80"
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
