// app/unsupported/page.tsx
"use client";

export default function Unsupported() {
  return (
    <div className="h-screen flex items-center justify-center bg-black text-white text-center px-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">Unsupported Device</h1>
        <p className="text-lg">
          This application is designed for desktop devices only.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Please access it from a larger screen for the best experience.
        </p>
      </div>
    </div>
  );
}
