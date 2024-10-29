// src/app/event/AddEntryForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';

const AddEntryForm: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [type, setType] = useState<'text' | 'audio' | 'image' | 'video'>('text');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [text, setText] = useState<string>('');
    const formRef = useRef<HTMLDivElement>(null); // Create a ref for the form container
    const [showButton, setShowButton] = useState(true); // State to control button visibility
    const [error, setError] = useState<string | null>(null); // Add state for error
    
    useEffect(() => {
        if (isOpen) {
            setShowButton(false); // Hide button when opening
        } else {
            // Show button after the form transition is complete
            const timer = setTimeout(() => setShowButton(true), 600); // Match the duration of the transition
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setIsOpen(false); // Close the form if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Effect to reset file and error when `type` changes
    useEffect(() => {
        setFile(null);
        setError(null);
    }, [type]); // Run effect whenever `type` changes

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('type', type);
        formData.append('preview', preview);
        formData.append('text', text);
        if (file) formData.append('file', file);

        const res = await fetch('/api/timeline', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            // Reset form and close pop-up
            setFile(null);
            setText('');
            setPreview('');
            setIsOpen(false);
            console.log('Entry added successfully');
            // Optionally, refresh the timeline here or handle UI update
        } else {
            console.error('Error adding entry');
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]; // Use optional chaining
        const validTypes = [
            "audio/mpeg", "audio/mp3", "audio/wav", "audio/aac", 
            "image/jpeg", "image/png", "image/gif", 
            "video/mp4", "video/webm", "video/ogg"
        ];

        // Validate file type
        if (selectedFile && validTypes.includes(selectedFile.type)) {
            setFile(selectedFile);
            setError(null); // Clear any previous errors
        } else {
            setFile(null);
            setError("Invalid file type. Please upload audio, image, or video files.");
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-1000 flex flex-col items-end">
            {/* Button container */}
            {showButton && (
                <div className={`transition-opacity duration-500 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        className="bg-[#8067ff] hover:bg-[#5533ff] text-white text-2xl py-2 px-4 rounded-xl shadow-lg hover:scale-110 duration-200"
                        onClick={() => setIsOpen(true)} // Open the form on click
                    >
                        +
                    </button>
                </div>
            )}

            <div
                ref={formRef}
                className={`mt-2 overflow-hidden bg-gray-800 bg-opacity-50 text-white rounded-xl border border-gray-600 shadow-lg transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{ width: '300px' }}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 px-5">
                    <label>
                        Preview Text
                        <input
                            type="text"
                            value={preview}
                            onChange={(e) => setPreview(e.target.value)}
                            required
                            placeholder="Enter preview"
                            className="w-full mt-1 p-2 bg-gray-900 rounded text-gray-200"
                        />
                    </label>
                    <label>
                        Type
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'text' | 'audio' | 'image' | 'video')}
                            className="w-full mt-1 p-2 bg-gray-900 rounded text-gray-200"
                        >
                            <option value="text">Text</option>
                            <option value="audio">Audio</option>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                    </label>
                    {type === 'text' && (
                        <label>
                            Text
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                                placeholder="Enter your text"
                                className="w-full mt-1 p-2 bg-gray-900 rounded text-gray-200 resize-none overflow-auto"
                                rows={3} // Initial rows for textarea
                                style={{
                                    maxHeight: 'calc(100vh - 200px)', // Keep textarea within viewport
                                    overflowY: isOpen && text.length > 0 ? 'auto' : 'hidden' // Scroll if expanded
                                }}
                            />
                        </label>
                    )}
                    {(type === 'audio' || type === 'video' || type === 'image') && (
                        <div className="mt-4">
                            {/* Custom styled upload button */}
                            <label htmlFor="file-upload" className="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-lg cursor-pointer transition duration-200 hover:bg-gray-500">
                                {file ? `File: ${file.name}` : "Upload Media"} {/* Show file name if file is selected */}
                            </label>
                            
                            <input
                                id="file-upload"
                                type="file"
                                accept="audio/*,image/*,video/*"
                                onChange={handleFileChange}
                                required
                                className="hidden" // Hide default file input
                            />

                            {/* Error message for invalid files */}
                            {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
                        </div>
                    )}
                    <button
                        className="bg-[#8067ff] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#5533ff] transition duration-200"
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEntryForm;
