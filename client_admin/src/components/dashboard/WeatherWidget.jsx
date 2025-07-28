import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";
import Widget from "../ui/Widget";

// Mock weather data function
const getMockWeatherData = async () => ({
  location: "Fort Pierce, FL",
  temperature: 28,
  condition: "Partly Cloudy",
  icon: "Cloud",
  windSpeed: 15,
  humidity: 75,
  uv: 7,
  feelsLike: 30,
  precipitation: 0.2,
  dewPoint: 22,
  pressure: 1012,
  visibility: 10,
  sunrise: "6:32 AM",
  sunset: "8:14 PM",
  forecast: [
    { day: "Mon", temp: 29, icon: "Sun", rain: 0, wind: 12, humidity: 70 },
    { day: "Tue", temp: 26, icon: "CloudRain", rain: 0.4, wind: 18, humidity: 80 },
    { day: "Wed", temp: 24, icon: "CloudRain", rain: 0.6, wind: 20, humidity: 85 },
    { day: "Thu", temp: 27, icon: "Cloud", rain: 0.1, wind: 10, humidity: 65 },
    { day: "Fri", temp: 30, icon: "Sun", rain: 0, wind: 8, humidity: 60 },
    { day: "Sat", temp: 31, icon: "Sun", rain: 0, wind: 7, humidity: 55 },
    { day: "Sun", temp: 28, icon: "Cloud", rain: 0.2, wind: 11, humidity: 68 },
  ],
});

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
      <div className="h-full flex flex-col items-stretch justify-center gap-2">
        {/* Top: Location and Current */}
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-xs text-text-secondary font-semibold truncate">{weather.location}</span>
            <WeatherIcon icon={weather.icon} className="w-9 h-9 text-primary" />
            <span className="text-3xl font-extrabold text-text-main drop-shadow-lg leading-none rounded px-2 py-1 mt-1 mb-1 shadow-lg">
              {weather.temperature}°C
            </span>
            <span className="text-xs text-text-secondary truncate">{weather.condition}</span>
          </div>
          {/* Current Details - more info dense */}
          <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-xs text-center flex-1">
            <div>
              <span className="font-bold text-white">{weather.humidity}%</span>
              <div className="text-text-secondary">Humidity</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.windSpeed}</span>
              <div className="text-text-secondary">Wind km/h</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.feelsLike}°</span>
              <div className="text-text-secondary">Feels</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.uv}</span>
              <div className="text-text-secondary">UV</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.precipitation}mm</span>
              <div className="text-text-secondary">Precip</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.dewPoint}°</span>
              <div className="text-text-secondary">Dew Pt</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.pressure}hPa</span>
              <div className="text-text-secondary">Pressure</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.visibility}km</span>
              <div className="text-text-secondary">Visibility</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.sunrise}</span>
              <div className="text-text-secondary">Sunrise</div>
            </div>
            <div>
              <span className="font-bold text-white">{weather.sunset}</span>
              <div className="text-text-secondary">Sunset</div>
            </div>
          </div>
        </div>
        {/* 7-Day Forecast */}
        <div className="mt-2 w-full">
          <div className="text-xs font-semibold text-text-secondary text-center mb-1">7-Day Forecast</div>
          <div className="grid grid-cols-7 gap-1 w-full">
            {weather.forecast.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center bg-surface/60 rounded p-1 min-w-0">
                <span className="text-xs text-text-secondary truncate">{day.day}</span>
                <WeatherIcon icon={day.icon} className="w-5 h-5 text-primary" />
                <span className="text-base font-bold text-white">{day.temp}°</span>
                <span className="text-[10px] text-blue-400">{day.rain > 0 ? `${day.rain}mm` : ""}</span>
                <span className="text-[10px] text-text-secondary">{day.wind}km/h</span>
                <span className="text-[10px] text-text-secondary">{day.humidity}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default WeatherWidget;
