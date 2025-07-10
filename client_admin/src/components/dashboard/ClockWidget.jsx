import { useState, useEffect } from "react";
import Widget from "./Widget";

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timerId = setInterval(() => setTime(new Date()), 1000);
    // Clean up the timer when the component unmounts
    return () => clearInterval(timerId);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Widget title="System Time" className="widget-cut-corners">
      <div className="text-center py-12">
        <p className="text-[60px] font-mono font-bold text-tertiary text-glow">
          {time.toLocaleTimeString("en-US", { hour12: true })}
        </p>
        <p className="text-sm text-text-secondary mt-2">{formatDate(time)}</p>
      </div>
    </Widget>
  );
};

export default ClockWidget;
