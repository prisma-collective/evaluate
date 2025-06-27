import React, { useState, useEffect } from 'react';

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


interface TimelineProps {
  entries: TimelineEntry[];
}

interface DateObject {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  second?: number;
  nanosecond?: number;
}

const getTimestamp = (date: string | Date | DateObject): number => {

  if (typeof date === 'string' || date instanceof Date) {
    return new Date(date).getTime();
  }

  if (
    typeof date === 'object' &&
    'year' in date &&
    'month' in date &&
    'day' in date
  ) {
    const d = new Date(
      date.year,
      date.month - 1, // JS months are 0-based
      date.day,
      date.hour ?? 0,
      date.minute ?? 0,
      date.second ?? 0,
      Math.floor((date.nanosecond ?? 0) / 1e6) // convert ns to ms
    );
    return d.getTime();
  }

  return NaN;
};

const toDate = (date: string | Date | DateObject): Date | null => {
  if (typeof date === 'string' || date instanceof Date) {
    return new Date(date);
  }

  if (
    typeof date === 'object' &&
    'year' in date &&
    'month' in date &&
    'day' in date
  ) {
    return new Date(
      date.year,
      date.month - 1, // JS months are 0-based
      date.day,
      date.hour ?? 0,
      date.minute ?? 0,
      date.second ?? 0,
      Math.floor((date.nanosecond ?? 0) / 1e6) // convert ns to ms
    );
  }

  return null;
};

function getEntryPreview(entry: TimelineEntry) {
    const connectionLabels = entry.connections.map(c => c.label);
    const participant = entry.connections.find(c => c.label === 'Participant')?.properties?.handle ?? 'Unknown';
    const chatTitle = entry.connections.find(c => c.label === 'TelegramChat')?.properties?.title ?? 'Unknown Chat';
  
    return `${participant} in ${chatTitle} — ${connectionLabels.length} connections:\n${connectionLabels.join(', ')}`;  
}

const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null);
  const [previewEntry, setPreviewEntry] = useState<TimelineEntry | null>(null);
  const [hoverEntry, setHoverEntry] = useState<TimelineEntry | null>(null);

  // Dynamic parameters based on viewport
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [radius, setRadius] = useState<number>(0);
  const [centerY, setCenterY] = useState<number>(0);
  const [centerX, setCenterX] = useState<number>(0);
  
  const angleRange = Math.PI / 8; // Controls the visible arc angle (30 degrees)

  // Update dimensions on resize
  useEffect(() => {
    const calculateLayout = () => {
      const newWidth = window.innerWidth * 0.9;
      const newHeight = window.innerHeight * 0.5;
      const newRadius = window.innerWidth * 1.5;
      const newCenterY = (window.innerHeight * 0.6) + newRadius - 110;
      const newCenterX = newWidth / 2;

      setWidth(newWidth);
      setHeight(newHeight);
      setRadius(newRadius);
      setCenterY(newCenterY);
      setCenterX(newCenterX);

      console.log("Radius:", newRadius);
      console.log("Center Y:", newCenterY);
      console.log("Center X:", newCenterX);
    };
    
    window.addEventListener('resize', calculateLayout);
    calculateLayout();
    return () => window.removeEventListener('resize', calculateLayout);
  }, [width, height]);

  // Convert dates to timestamps using the helper function
  const timestamps = entries.map((e) => getTimestamp(e.date));

  // Calculate time range
  const timeRange = {
    start: Math.min(...timestamps),
    end: Math.max(...timestamps),
  };

  // Adjust dot positions along the arc based on parameters
  const calculatePosition = (entry: TimelineEntry) => {
    const timestamp = getTimestamp(entry.date);
  
    const progress = (timestamp - timeRange.start) / (timeRange.end - timeRange.start);
  
    const angle = Math.PI / 2 + (angleRange / 2) - progress * angleRange;
  
    const x = centerX + radius * Math.cos(angle);
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
          strokeWidth="1.5"
          className="stroke-gray-500"
        />

        {/* Draw dots for each entry */}
        {entries.map((entry) => {
          const pos = calculatePosition(entry);
          return (
            <g
              key={entry.id}
              className="relative group"
            >
              <circle
                onClick={() => handleDotClick(entry)}
                onMouseEnter={() => handleMouseEnter(entry)}
                onMouseLeave={handleMouseLeave}
                cx={pos.x}
                cy={pos.y}
                r={hoverEntry === entry ? "6" : "4"}
                className="fill-slate-300 hover:fill-prisma-a cursor-pointer transition-all duration-300 opacity-60 group-hover:opacity-100"
              />
              <text
                x={pos.x}
                y={pos.y + 25}
                textAnchor="middle"
                className="text-xs fill-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                {toDate(entry.date)?.toLocaleDateString()}
              </text>

              {/* Preview tooltip */}
              {previewEntry === entry && (
                <foreignObject
                  x={pos.x - 200}
                  y={pos.y - 100}
                  width="400"
                  height="100"
                >
                  <div className="bg-gray-800 bg-opacity-90 p-2 rounded-lg shadow-lg text-sm text-center border border-slate-200">
                    {getEntryPreview(entry)}
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
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
