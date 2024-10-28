// src/app/event/AddEntryForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import styles from '@AddEntryForm.module.css';  // Import CSS for styling

const AddEntryForm: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [type, setType] = useState<'text' | 'audio' | 'video'>('text');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [text, setText] = useState<string>('');

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
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <>
            <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? 'Close' : 'Add Entry'}
            </button>

            {isOpen && (
                <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Preview Text:
                            <input
                                type="text"
                                value={preview}
                                onChange={(e) => setPreview(e.target.value)}
                                required
                                placeholder="Enter preview"
                            />
                        </label>
                        <label>
                            Type:
                            <select value={type} onChange={(e) => setType(e.target.value as 'text' | 'audio' | 'video')}>
                                <option value="text">Text</option>
                                <option value="audio">Audio</option>
                                <option value="video">Video</option>
                            </select>
                        </label>
                        {type === 'text' && (
                            <label>
                                Text:
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    required
                                    placeholder="Enter your text"
                                />
                            </label>
                        )}
                        {(type === 'audio' || type === 'video') && (
                            <label>
                                Upload {type}:
                                <input
                                    type="file"
                                    accept={type === 'audio' ? 'audio/*' : 'video/*'}
                                    onChange={handleFileChange}
                                    required
                                />
                            </label>
                        )}
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AddEntryForm;
