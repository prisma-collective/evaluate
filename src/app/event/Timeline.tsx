import React, { useState } from 'react';
import { TimelineEntry } from '@prisma/client';

interface TimelineProps {
  entries: TimelineEntry[];
}

const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);
  const [previewEntry, setPreviewEntry] = useState<TimelineEntry | null>(null);

  // Calculate timeline parameters
  const width = 800;
  const height = 600;
  const radius = 300;
  const centerX = width / 2;
  const centerY = height - 50;

  // Safely convert all dates to timestamps
  const timestamps = entries.map(e => new Date(e.happenedAt).getTime());
  
  // Create time range using the converted timestamps
  const timeRange = {
    start: Math.min(...timestamps),
    end: Math.max(...timestamps)
  };

  // Calculate dot positions along the arc
  const calculatePosition = (entry: TimelineEntry) => {
    console.log("Calculating positions")
    const timestamp = new Date(entry.happenedAt).getTime();
    const progress = (timestamp - timeRange.start) / (timeRange.end - timeRange.start);
    const angle = Math.PI - (progress * Math.PI);
  
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);
    
    console.log({
      entry: entry.id,
      timestamp,
      timeRange,
      progress,
      angle,
      position: { x, y },
      centerX,
      centerY,
      radius
    });
    
    return { x, y };
  };

  const handleDotClick = (entry: TimelineEntry) => {
    setPreviewEntry(null);
    setSelectedEntry(entry);
  };

  const handleMouseEnter = (entry: TimelineEntry) => {
    setPreviewEntry(entry);
  };

  const handleMouseLeave = () => {
    setPreviewEntry(null);
  };

  const handleCloseModal = () => setSelectedEntry(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Arc Timeline */}
      <svg width={width} height={height} className="mx-auto">
        {/* Draw the arc path */}
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="2"
          className="stroke-slate-200"
        />

        {/* Draw dots for each entry */}
        {entries.map((entry) => {
          const pos = calculatePosition(entry);
          return (
            <g 
              key={entry.id}
              onClick={() => handleDotClick(entry)}
              onMouseEnter={() => handleMouseEnter(entry)}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r="8"
                className="fill-blue-500 hover:fill-blue-600 cursor-pointer transition-colors"
              />
              <text
                x={pos.x}
                y={pos.y + 25}
                textAnchor="middle"
                className="text-xs fill-slate-600"
              >
                {new Date(entry.happenedAt).toLocaleDateString()}
              </text>
              
              {/* Preview tooltip */}
              {previewEntry === entry && (
                <foreignObject
                  x={pos.x - 100}
                  y={pos.y - 60}
                  width="200"
                  height="40"
                >
                  <div className="bg-white p-2 rounded-lg shadow-lg text-sm text-center border border-slate-200">
                    {entry.preview || entry.text || 'No preview available'}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* Modal */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              x
            </button>
            
            <div className="mt-4">
              {selectedEntry.type === 'audio' ? (
                <audio 
                  controls 
                  className="w-full"
                  src={selectedEntry.mediaUrl || undefined}
                />
              ) : selectedEntry.type === 'video' ? (
                <video
                  controls
                  className="w-full rounded-lg"
                  src={selectedEntry.mediaUrl || undefined}
                />
              ) : (
                <p className="text-gray-700">{selectedEntry.text}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
