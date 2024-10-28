// src/app/event/Timeline.tsx
import { useState } from 'react';
import styles from '@Timeline.module.css';

// Define types for the event object
interface Event {
    id: string; // Assuming id is a string, change if it's a number
    preview: string;
    type: 'text' | 'audio' | 'video';
    mediaUrl?: string; // Optional for text events
    text?: string; // Optional for audio and video events
}

interface TimelineProps {
    events: Event[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleDotClick = (event: Event) => setSelectedEvent(event);
    const handleCloseModal = () => setSelectedEvent(null);

    return (
        <div className={styles.timelineContainer}>
            <div className={styles.arc}>
                {events.map((event, index) => (
                    <div
                        key={event.id}
                        className={styles.timelineDot}
                        style={{ left: `${(index / events.length) * 100}%` }}
                        onClick={() => handleDotClick(event)}
                        onMouseEnter={() => setSelectedEvent(event)}
                        onMouseLeave={() => setSelectedEvent(null)}
                    >
                        {selectedEvent === event && (
                            <div className={styles.preview}>
                                <p>{event.preview}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div className={styles.modal} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        {selectedEvent.type === 'audio' ? (
                            <audio controls src={selectedEvent.mediaUrl} />
                        ) : selectedEvent.type === 'video' ? (
                            <video controls src={selectedEvent.mediaUrl} />
                        ) : (
                            <p>{selectedEvent.text}</p>
                        )}
                        <button className={styles.closeButton} onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timeline;
