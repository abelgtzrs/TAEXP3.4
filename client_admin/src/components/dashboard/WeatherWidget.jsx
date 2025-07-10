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
    <Widget title="Weather Status" padding="p-4">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="font-semibold text-text-secondary">{weather.location}</p>
        <div className="my-2 text-primary">
          <WeatherIcon icon={weather.icon} className="w-16 h-16" />
        </div>
        <p className="text-5xl font-bold text-white">{weather.temperature}°C</p>
        <p className="text-text-secondary">{weather.condition}</p>
        <div className="flex justify-around w-full mt-4 text-xs text-text-secondary">
          <div>
            <p className="font-bold text-white">{weather.humidity}%</p>
            <p>Humidity</p>
          </div>
          <div>
            <p className="font-bold text-white">{weather.windSpeed} km/h</p>
            <p>Wind</p>
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default WeatherWidget;
