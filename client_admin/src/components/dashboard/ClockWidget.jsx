import { useState, useEffect } from "react";
import Widget from "./Widget";

// A new sub-component to render the analog clock face using SVG.
const AnalogClock = ({ time }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate the rotation for each clock hand.
  const secondHandRotation = seconds * 6; // 360 degrees / 60 seconds = 6 deg/sec
  const minuteHandRotation = minutes * 6 + seconds * 0.1; // 6 deg/min + 0.1 deg/sec
  const hourHandRotation = (hours % 12) * 30 + minutes * 0.5; // 30 deg/hr + 0.5 deg/min

  return (
    <div className="w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Clock face */}
        <circle cx="50" cy="50" r="48" stroke="#374151" strokeWidth="2" fill="#161B22" />

        {/* Hour Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="25"
          stroke="#9CA3AF"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${hourHandRotation} 50 50)`}
        />
        {/* Minute Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke="#E5E7EB"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minuteHandRotation} 50 50)`}
        />
        {/* Second Hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          stroke="#2DD4BF"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${secondHandRotation} 50 50)`}
        />
        {/* Center pin */}
        <circle cx="50" cy="50" r="3" fill="#2DD4BF" />
      </svg>
    </div>
  );
};

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // --- Helper Functions for more complex data ---

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimezone = (date) => {
    const timezoneMatch = date.toLocaleTimeString("en-US", { timeZoneName: "short" }).split(" ");
    return timezoneMatch.length > 2 ? timezoneMatch[2] : "";
  };

  const getDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  // Calculates the week number of the year
  const getWeekOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
  };

  return (
    <Widget title="System Time & Date" className="h-full">
      <div className="flex flex-col justify-between h-full">
        {/* Top section with analog and digital clocks */}
        <div className="flex items-center justify-around gap-4">
          <AnalogClock time={time} />
          <div className="text-right flex-1 min-w-0">
            <p className="text-xl sm:text-2xl lg:text-4xl font-mono font-bold text-primary text-glow break-all">
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="text-xs sm:text-sm text-text-secondary">
              UTC:{" "}
              {time.toLocaleTimeString("en-US", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: false })}
            </p>
          </div>
        </div>

        {/* Middle section with full date */}
        <div className="text-center my-4">
          <p className="text-sm sm:text-base text-text-secondary">{formatDate(time)}</p>
        </div>

        {/* Bottom section with detailed information */}
        <div className="w-full mt-2 pt-3 border-t border-gray-700/50 grid grid-cols-3 text-center text-xs text-text-secondary">
          <div>
            <p className="font-bold text-white">{getDayOfYear(time)}</p>
            <p>Day</p>
          </div>
          <div>
            <p className="font-bold text-white">{getWeekOfYear(time)}</p>
            <p>Week</p>
          </div>
          <div>
            <p className="font-bold text-white">{getTimezone(time)}</p>
            <p>Timezone</p>
          </div>
        </div>

        {/* Fictional System Status */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>API Link: Responsive</span>
        </div>
      </div>
    </Widget>
  );
};

export default ClockWidget;
