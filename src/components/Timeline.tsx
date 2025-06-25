import React, { useState, useEffect } from 'react';
import { TimelineEntry } from '@prisma/client';

interface TimelineProps {
  entries: TimelineEntry[];
}

const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);
  const [previewEntry, setPreviewEntry] = useState<TimelineEntry | null>(null);
  const [hoverEntry, setHoverEntry] = useState<TimelineEntry | null>(null);

  // Dynamic parameters based on viewport
  const [width, setWidth] = useState(window.innerWidth * 0.8);
  const [height, setHeight] = useState(window.innerHeight * 0.5);
  const [radius, setRadius] = useState(window.innerWidth * 1.5); // Adjust curvature based on width
  const [centerY, setCenterY] = useState(height + radius - 110);
  const [centerX, setCenterX] = useState(width / 2);
  
  const angleRange = Math.PI / 8; // Controls the visible arc angle (30 degrees)

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth * 0.9);
      setHeight(window.innerHeight* 0.5);
      setRadius(window.innerWidth * 1.5);
      setCenterY((window.innerHeight* 0.6) + (window.innerWidth * 1.5) - 110);
      setCenterX((window.innerWidth * 0.9) / 2);
    };
    
    window.addEventListener('resize', handleResize);
    console.log("Radius: ", window.innerWidth * 1.5)
    console.log("Center Y: ", (window.innerHeight* 0.6) + (window.innerWidth * 1.5) - 110)
    console.log("Center X: ", (window.innerWidth * 0.9) / 2)
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // Convert dates to timestamps
  const timestamps = entries.map((e) => new Date(e.happenedAt).getTime());

  // Calculate time range
  const timeRange = {
    start: Math.min(...timestamps),
    end: Math.max(...timestamps),
  };

  // Adjust dot positions along the arc based on parameters
  const calculatePosition = (entry: TimelineEntry) => {
    const timestamp = new Date(entry.happenedAt).getTime();
    const progress = (timestamp - timeRange.start) / (timeRange.end - timeRange.start);
    const angle = Math.PI / 2 + (angleRange / 2) - progress * angleRange; // Start and end angles calculated for the arc

    const x = centerX + radius * Math.cos(angle); // Center x based on width
    const y = centerY - radius * Math.sin(angle);

    return { x, y };
  };

  const handleDotClick = (entry: TimelineEntry) => {
    setPreviewEntry(null);
    setSelectedEntry(entry);
  };

  const handleMouseEnter = (entry: TimelineEntry) => {
    setPreviewEntry(entry);
    setHoverEntry(entry);
  };

  const handleMouseLeave = () => {
    setPreviewEntry(null);
    setHoverEntry(null);
  };

  const handleCloseModal = () => setSelectedEntry(null);

  return (
    <div className="relative w-full mx-auto overflow-hidden">
      {/* Arc Timeline */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height + 50}`} className="mx-auto">
        {/* Draw the arc path */}
        <path
          d={`M ${centerX - radius * Math.cos(angleRange / 2)} ${centerY - radius * Math.sin(angleRange / 2)}
             A ${radius} ${radius} 0 0 1 ${centerX + radius * Math.cos(angleRange / 2)} ${centerY - radius * Math.sin(angleRange / 2)}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          className="stroke-slate-800"
        />

        {/* Draw dots for each entry */}
        {entries.map((entry) => {
          const pos = calculatePosition(entry);
          return (
            <g
              key={entry.id}
              className="relative"
            >
              <circle
                onClick={() => handleDotClick(entry)}
                onMouseEnter={() => handleMouseEnter(entry)}
                onMouseLeave={handleMouseLeave}
                cx={pos.x}
                cy={pos.y}
                r={hoverEntry === entry ? "10" : "6"}
                className="fill-[#7faec2] hover:fill-[#003a53] cursor-pointer transition-all duration-300"
              />
              <text
                x={pos.x}
                y={pos.y + 25}
                textAnchor="middle"
                className="text-xs fill-slate-300"
              >
                {new Date(entry.happenedAt).toLocaleDateString()}
              </text>

              {/* Preview tooltip */}
              {previewEntry === entry && (
                <foreignObject
                  x={pos.x - 200}
                  y={pos.y - 60}
                  width="400"
                  height="40"
                >
                  <div className="bg-gray-800 bg-opacity-90 p-2 rounded-lg shadow-lg text-sm text-center border border-slate-200">
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
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-gray-700 bg-opacity-40 border border-gray-500 rounded-lg p-6 max-w-2xl w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-4 text-xl text-gray-300 hover:text-[#7faec2]"
            >
              x
            </button>

            <div className="mt-4 p-2">
              {selectedEntry.type === 'audio' ? (
                <audio controls className="w-full" src={selectedEntry.mediaUrl || undefined} />
              ) : selectedEntry.type === 'video' ? (
                <video controls className="w-full rounded-lg" src={selectedEntry.mediaUrl || undefined} />
              ) : (
                <p className="text-gray-300">{selectedEntry.text}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
