import React, { useState, useEffect } from "react";
import {
  Monitor,
  Wifi,
  WifiOff,
  Battery,
  Zap,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Leaf,
  Snowflake,
  Flower,
  TreePine,
  Chrome,
  Globe,
  Smartphone,
  Laptop,
  Server,
  Activity,
  Clock,
  Calendar,
  MapPin,
} from "lucide-react";
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
          stroke="red"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${secondHandRotation} 50 50)`}
        />
        {/* Center pin */}
        <circle cx="50" cy="50" r="3" fill="#fff" />
      </svg>
    </div>
  );
};

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  const [performance, setPerformance] = useState({ memory: 0, fps: 60 });
  const [networkStatus, setNetworkStatus] = useState("online");

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const uptimeTimer = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(uptimeTimer);
  }, []);

  useEffect(() => {
    // Simulate performance monitoring
    const performanceTimer = setInterval(() => {
      setPerformance({
        memory: Math.floor(Math.random() * 20) + 40, // 40-60MB
        fps: Math.floor(Math.random() * 10) + 55, // 55-65 FPS
      });
    }, 2000);

    // Monitor network status
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? "online" : "offline");
    };

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      clearInterval(performanceTimer);
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
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

  // Format uptime
  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Get moon phase (simplified calculation)
  const getMoonPhase = (date) => {
    const cycles = 29.530588853; // Average lunar cycle
    const known = new Date(2000, 0, 6); // Known new moon date
    const days = (date - known) / (1000 * 60 * 60 * 24);
    const phase = (days % cycles) / cycles;

    if (phase < 0.125) return { icon: Moon, name: "New Moon", color: "text-text-tertiary" };
    if (phase < 0.25) return { icon: Moon, name: "Waxing Crescent", color: "text-text-secondary" };
    if (phase < 0.375) return { icon: Moon, name: "First Quarter", color: "text-accent" };
    if (phase < 0.5) return { icon: Moon, name: "Waxing Gibbous", color: "text-primary" };
    if (phase < 0.625) return { icon: Moon, name: "Full Moon", color: "text-accent" };
    if (phase < 0.75) return { icon: Moon, name: "Waning Gibbous", color: "text-primary" };
    if (phase < 0.875) return { icon: Moon, name: "Last Quarter", color: "text-text-secondary" };
    return { icon: Moon, name: "Waning Crescent", color: "text-text-tertiary" };
  };

  // Get season based on date
  const getSeason = (date) => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return { icon: Flower, name: "Spring", color: "text-accent" };
    if (month >= 5 && month <= 7) return { icon: Sun, name: "Summer", color: "text-primary" };
    if (month >= 8 && month <= 10) return { icon: Leaf, name: "Autumn", color: "text-accent" };
    return { icon: Snowflake, name: "Winter", color: "text-primary" };
  };

  // Calculate time until next hour
  const getTimeUntilNextHour = (date) => {
    const minutes = 59 - date.getMinutes();
    const seconds = 59 - date.getSeconds();
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get Unix timestamp
  const getUnixTimestamp = (date) => {
    return Math.floor(date.getTime() / 1000);
  };

  // Get battery status (if available)
  const getBatteryInfo = () => {
    if ("getBattery" in navigator) {
      return { icon: Battery, text: "Battery API", color: "text-accent" };
    }
    return { icon: Zap, text: "AC Power", color: "text-primary" };
  };

  // Get connection type
  const getConnectionType = () => {
    if ("connection" in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      return connection.effectiveType || "unknown";
    }
    return "ethernet";
  };

  // Calculate days until end of year
  const getDaysUntilNewYear = (date) => {
    const endOfYear = new Date(date.getFullYear() + 1, 0, 1);
    const diffTime = endOfYear - date;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get week progress percentage
  const getWeekProgress = (date) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutesInWeek = 7 * 24 * 60;
    const currentMinutes = dayOfWeek * 24 * 60 + hours * 60 + minutes;
    return Math.round((currentMinutes / totalMinutesInWeek) * 100);
  };

  // Get year progress percentage
  const getYearProgress = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const end = new Date(date.getFullYear() + 1, 0, 1);
    const current = date;
    return Math.round(((current - start) / (end - start)) * 100);
  };

  // Get sunrise/sunset info (simplified calculation for demo)
  const getSunInfo = (date) => {
    // This is a simplified calculation - in real app you'd use geolocation
    const dayOfYear = getDayOfYear(date);
    const sunriseHour = Math.round(6 + 2 * Math.sin((dayOfYear / 365) * 2 * Math.PI));
    const sunsetHour = Math.round(18 + 2 * Math.sin((dayOfYear / 365) * 2 * Math.PI));

    // Use day of year to generate consistent minutes for the entire day
    const sunriseMinutes = Math.floor((dayOfYear * 7) % 60);
    const sunsetMinutes = Math.floor((dayOfYear * 11) % 60);

    return {
      sunrise: `${sunriseHour.toString().padStart(2, "0")}:${sunriseMinutes.toString().padStart(2, "0")}`,
      sunset: `${sunsetHour.toString().padStart(2, "0")}:${sunsetMinutes.toString().padStart(2, "0")}`,
    };
  };

  // Get browser info
  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) return { icon: Chrome, text: "Chrome", color: "text-primary" };
    if (ua.includes("Firefox")) return { icon: Globe, text: "Firefox", color: "text-accent" };
    if (ua.includes("Safari")) return { icon: Globe, text: "Safari", color: "text-primary" };
    if (ua.includes("Edge")) return { icon: Globe, text: "Edge", color: "text-primary" };
    return { icon: Globe, text: "Browser", color: "text-text-secondary" };
  };

  // Get device info
  const getDeviceInfo = () => {
    const platform = navigator.platform;
    if (platform.includes("Win")) return { icon: Monitor, text: "Windows", color: "text-primary" };
    if (platform.includes("Mac")) return { icon: Laptop, text: "macOS", color: "text-text-secondary" };
    if (platform.includes("Linux")) return { icon: Server, text: "Linux", color: "text-accent" };
    if (platform.includes("iPhone") || platform.includes("iPad"))
      return { icon: Smartphone, text: "iOS", color: "text-text-secondary" };
    if (platform.includes("Android")) return { icon: Smartphone, text: "Android", color: "text-accent" };
    return { icon: Monitor, text: "Device", color: "text-text-secondary" };
  };

  // Format file size
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Widget title="System Time & Information" className="h-full">
      <div className="flex flex-col h-full space-y-2 overflow-y-auto scrollbar-hide">
        {/* Top section with analog and digital clocks */}
        <div className="flex items-center justify-around gap-2">
          <AnalogClock time={time} />
          <div className="text-left flex-1 min-w-0">
            <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-secondary text-glow break-all">
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="text-xs sm:text-sm text-text-secondary">
              UTC:{" "}
              {time.toLocaleTimeString("en-US", {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="text-xs sm:text-sm text-text-secondary">
              HMO:{" "}
              {time.toLocaleTimeString("en-US", {
                timeZone: "PST",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="text-xs text-text-secondary mt-1">Unix: {getUnixTimestamp(time)}</p>
          </div>
        </div>

        {/* Date and Astronomical Data */}
        <div className="text-center">
          <p className="text-sm sm:text-base text-text-secondary">{formatDate(time)}</p>
          <div className="flex items-center justify-center gap-3 mt-2 text-xs flex-wrap">
            <span className={`flex items-center gap-1 ${getSeason(time).color}`}>
              {React.createElement(getSeason(time).icon, { size: 14 })}
              {getSeason(time).name}
            </span>
            <span className={`flex items-center gap-1 ${getMoonPhase(time).color}`}>
              {React.createElement(getMoonPhase(time).icon, { size: 14 })}
              {getMoonPhase(time).name}
            </span>
            <span className="flex items-center gap-1 text-accent">
              <Sunrise size={14} />
              {getSunInfo(time).sunrise}
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Sunset size={14} />
              {getSunInfo(time).sunset}
            </span>
          </div>
        </div>

        {/* Progress Bars Section */}
        <div className="space-y-2">
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-secondary">Week Progress</span>
              <span className="text-primary font-bold">{getWeekProgress(time)}%</span>
            </div>
            <div className="w-full bg-gray-900/70 rounded-full h-1.5">
              <div
                className="bg-secondary h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${getWeekProgress(time)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-secondary">Year Progress</span>
              <span className="text-accent font-bold">{getYearProgress(time)}%</span>
            </div>
            <div className="w-full bg-gray-900/70 rounded-full h-1.5">
              <div
                className="bg-secondary h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${getYearProgress(time)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="font-bold text-text-main flex items-center justify-center gap-1">
              <Calendar size={12} />
              {getDayOfYear(time)}
            </p>
            <p className="text-text-secondary">Day</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="font-bold text-text0main flex items-center justify-center gap-1">
              <Calendar size={12} className="text-text-main" />
              {getWeekOfYear(time)}
            </p>
            <p className="text-text-main">Week</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="font-bold text-accent flex items-center justify-center gap-1">
              <Clock size={12} />
              {getDaysUntilNewYear(time)}
            </p>
            <p className="text-text-secondary">Days Left</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="font-bold text-accent flex items-center justify-center gap-1">
              <Clock size={12} />
              {getTimeUntilNextHour(time)}
            </p>
            <p className="text-text-secondary">Next Hour</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <p className="font-bold text-text-main flex items-center justify-center gap-1">
              <MapPin size={12} />
              {getTimezone(time)}
            </p>
            <p className="text-text-secondary">Timezone</p>
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-gray-800/50 rounded-lg p-2">
          <p className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            <Activity size={14} className="text-accent" />
            Performance Monitor
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center">
              <p className="font-bold text-accent">{performance.memory} MB</p>
              <p className="text-text-secondary">Memory</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-text-main">{performance.fps} FPS</p>
              <p className="text-text-secondary">Framerate</p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-800/50 rounded-lg p-2">
          <p className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
            <Monitor size={14} className="text-primary" />
            System Info
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className={`flex items-center gap-1 ${getDeviceInfo().color}`}>
                {React.createElement(getDeviceInfo().icon, { size: 12 })}
                {getDeviceInfo().text}
              </span>
              <span className={`flex items-center gap-1 ${getBrowserInfo().color}`}>
                {React.createElement(getBrowserInfo().icon, { size: 12 })}
                {getBrowserInfo().text}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`flex items-center gap-1 ${getBatteryInfo().color}`}>
                {React.createElement(getBatteryInfo().icon, { size: 12 })}
                {getBatteryInfo().text}
              </span>
              <span className="flex items-center gap-1 text-primary">
                {networkStatus === "online" ? <Wifi size={12} /> : <WifiOff size={12} />}
                {getConnectionType().toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced System Status */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              API Status: Online
            </span>
            <span className="text-text-secondary">Uptime: {formatUptime(uptime)}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-text-secondary">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              WebSocket: Connected
            </span>
            <span className={`text-text-secondary ${networkStatus === "online" ? "text-accent" : "text-red-400"}`}>
              Network: {networkStatus.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-text-secondary">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              Session: Active
            </span>
            <span className="text-text-secondary">
              {time.toLocaleDateString("en-US", { weekday: "short" })} • Week {getWeekOfYear(time)}
            </span>
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default ClockWidget;
