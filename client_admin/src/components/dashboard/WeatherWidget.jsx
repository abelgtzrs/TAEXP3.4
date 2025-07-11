import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
import Widget from "./Widget";

// This is a mock function. In a real app, this would fetch from a weather API.
const getMockWeatherData = async () => {
  return {
    location: "Fort Pierce, FL",
    temperature: 28, // Celsius
    condition: "Partly Cloudy",
    icon: "Cloud",
    windSpeed: 15, // km/h
    humidity: 75,
    forecast: [
      { day: "Mon", temp: 29, icon: "Sun" },
      { day: "Tue", temp: 26, icon: "CloudRain" },
      { day: "Wed", temp: 24, icon: "CloudRain" },
      { day: "Thu", temp: 27, icon: "Cloud" },
      { day: "Fri", temp: 30, icon: "Sun" },
    ],
  };
};

const WeatherIcon = ({ icon, className }) => {
  switch (icon) {
    case "Sun":
      return <Sun className={className} />;
    case "Cloud":
      return <Cloud className={className} />;
    case "CloudRain":
      return <CloudRain className={className} />;
    case "CloudSnow":
      return <CloudSnow className={className} />;
    default:
      return <Sun className={className} />;
  }
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // To use a real API like OpenWeatherMap, you would replace this mock call.
      // You'll need an API key stored in your .env file.
      // Example: const response = await api.get(`/weather?q=FortPierce`);
      const data = await getMockWeatherData();
      setWeather(data);
    };
    fetchWeather();
  }, []);

  if (!weather) {
    return (
      <Widget title="Weather Status">
        <div className="text-center">Loading Weather...</div>
      </Widget>
    );
  }

  return (
    <Widget title="Weather Status">
      <div className="h-full grid grid-cols-2 gap-3 pb-6">
        {/* Left Column - Current Weather */}
        <div className="flex flex-col justify-between h-full pb-2">
          {/* Location */}
          <div className="text-center">
            <p className="text-xs font-semibold text-text-secondary truncate">{weather.location}</p>
          </div>

          {/* Current Weather */}
          <div className="flex flex-col items-center text-center">
            <div className="text-primary mb-1">
              <WeatherIcon icon={weather.icon} className="w-8 h-8" />
            </div>
            <p className="text-xl font-bold text-white">{weather.temperature}°C</p>
            <p className="text-xs text-text-secondary truncate">{weather.condition}</p>
          </div>

          {/* Current Weather Details */}
          <div className="grid grid-cols-2 gap-1 text-center pb-2">
            <div>
              <p className="text-xs font-bold text-white">{weather.humidity}%</p>
              <p className="text-xs text-text-secondary">Humidity</p>
            </div>
            <div>
              <p className="text-xs font-bold text-white">{weather.windSpeed}</p>
              <p className="text-xs text-text-secondary">km/h</p>
            </div>
          </div>
        </div>

        {/* Right Column - 5-Day Forecast */}
        <div className="flex flex-col h-full pb-2">
          <div className="text-center mb-2">
            <p className="text-xs font-semibold text-text-secondary">5-Day Forecast</p>
          </div>

          <div className="flex-1 space-y-1">
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-text-secondary w-8">{day.day}</span>
                <div className="text-primary">
                  <WeatherIcon icon={day.icon} className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-white w-8 text-right">{day.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default WeatherWidget;
