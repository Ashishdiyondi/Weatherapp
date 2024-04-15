import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const geoApiKey = "780bcdd791b565e6daa208049430d9fd";

const CityDetail = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [temperature, setTemperature] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [tempmax, setTempmax] = useState<string | null>(null);
  const [tempmin, setTempmin] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [windspeed, setWindspeed] = useState<string | null>(null);
  const [atmpressure, setAtmpreesure] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kelvinToCelsius = (temp: number) => {
    return (temp - 273.15).toFixed(1);
  };

  const msToKmph = (speed: number) => {
    return (speed * 3.6).toFixed(1);
  };

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${geoApiKey}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          fetchWeatherData(lat, lon);
        } else {
          setError("☹ No data for city");
        }
      } catch (error) {
        console.error("Error fetching geo data:", error);
        setError("Error fetching data");
      }
    };

    fetchGeoData();
  }, [cityName]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        // `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${geoApiKey}`
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude={part}&appid=${geoApiKey}`
      );
      const data = await response.json();
      if (data) {
        setTemperature(kelvinToCelsius(data.main.temp));
        setIcon(data.weather[0].icon);
        setTempmax(kelvinToCelsius(data.main.temp_max));
        setTempmin(kelvinToCelsius(data.main.temp_min));
        setDescription(data.weather[0].description);
        setHumidity(data.main.humidity);
        setWindspeed(msToKmph(data.wind.speed));
        setAtmpreesure(data.main.pressure);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const getDescriptionClass = (description: string | null) => {
    if (!description) {
      return "";
    }
    if (description.toLowerCase().includes("clear sky")) {
      return "clear-sky";
    } else if (
      description.toLowerCase().includes("few clouds") ||
      description.toLowerCase().includes("scattered clouds") ||
      description.toLowerCase().includes("broken clouds") ||
      description.toLowerCase().includes("overcast clouds")
    ) {
      return "cloudy";
    } else if (
      description.toLowerCase().includes("mist") ||
      description.toLowerCase().includes("smoke") ||
      description.toLowerCase().includes("haze") ||
      description.toLowerCase().includes("sand/dust whirls") ||
      description.toLowerCase().includes("fog") ||
      description.toLowerCase().includes("sand") ||
      description.toLowerCase().includes("dust") ||
      description.toLowerCase().includes("volcanic ash") ||
      description.toLowerCase().includes("squalls") ||
      description.toLowerCase().includes("tornado")
    ) {
      return "atmosphere";
    } else if (
      description.toLowerCase().includes("light rain") ||
      description.toLowerCase().includes("moderate rain") ||
      description.toLowerCase().includes("heavy intensity rain") ||
      description.toLowerCase().includes("very heavy rain") ||
      description.toLowerCase().includes("extreme rain") ||
      description.toLowerCase().includes("freezing rain") ||
      description.toLowerCase().includes("light intensity shower rain") ||
      description.toLowerCase().includes("shower rain") ||
      description.toLowerCase().includes("heavy intensity shower rain") ||
      description.toLowerCase().includes("ragged shower rain")
    ) {
      return "rain";
    } else if (
      description.toLowerCase().includes("thunderstorm with light rain") ||
      description.toLowerCase().includes("thunderstorm with rain") ||
      description.toLowerCase().includes("thunderstorm with heavy rain") ||
      description.toLowerCase().includes("light thunderstorm") ||
      description.toLowerCase().includes("thunderstorm") ||
      description.toLowerCase().includes("heavy thunderstorm") ||
      description.toLowerCase().includes("ragged thunderstorm") ||
      description.toLowerCase().includes("thunderstorm with light drizzle") ||
      description.toLowerCase().includes("thunderstorm with drizzle") ||
      description.toLowerCase().includes("thunderstorm with heavy drizzle")
    ) {
      return "thunderstorm";
    } else if (
      description.toLowerCase().includes("light snow") ||
      description.toLowerCase().includes("smoke") ||
      description.toLowerCase().includes("heavy snow") ||
      description.toLowerCase().includes("sleet") ||
      description.toLowerCase().includes("light shower sleet") ||
      description.toLowerCase().includes("shower sleet") ||
      description.toLowerCase().includes("light rain and snow") ||
      description.toLowerCase().includes("rain and snow") ||
      description.toLowerCase().includes("light shower snow") ||
      description.toLowerCase().includes("shower snow") ||
      description.toLowerCase().includes("heavy shower snow")
    ) {
      return "snow";
    } else if (
      description.toLowerCase().includes("light intensity drizzle") ||
      description.toLowerCase().includes("drizzle") ||
      description.toLowerCase().includes("heavy intensity drizzle") ||
      description.toLowerCase().includes("light intensity drizzle rain") ||
      description.toLowerCase().includes("drizzle rain") ||
      description.toLowerCase().includes("heavy intensity drizzle rain") ||
      description.toLowerCase().includes("shower rain and drizzle") ||
      description.toLowerCase().includes("heavy shower rain and drizzle") ||
      description.toLowerCase().includes("shower drizzle")
    ) {
      return "drizzle";
    }

    return "";
  };

  return (
    <div className={`main2 ${getDescriptionClass(description)}`}>
      {error ? (
        <p className="error">{error}</p>
      ) : !temperature || !description || !humidity || !windspeed ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="cityname">
            <h2 className="city">{cityName}</h2>
            <p>
              <img
                className="image"
                src={`https://openweathermap.org/img/wn/${icon}.png`}
                alt={description}
              />
            </p>
            <p className="temp">{temperature}°C</p>
            <p className="desc"> {description}</p>
          </div>

          <div className="description">
            <div className="entry">
              <p className="label">dayhigh</p>
              <p className="i">{tempmax}°C</p>
            </div>
            <div className="entry">
              <p className="label">daylow</p>
              <p className="i">{tempmin}°C</p>
            </div>
            <div className="entry">
              <p className="label">Humidity</p>
              <p className="i">{humidity}%</p>
            </div>
            <div className="entry">
              <p className="label">Windspeed</p>
              <p className="i">{windspeed}km/h</p>
            </div>
            <div className="entry">
              <p className="label">Pressure</p>
              <p className="i">{atmpressure}mbar</p>
            </div>
          </div>

          <div className="footer">
            <span className="footercontent">Designed and Developed by </span>
            <div>
              <span>
                <a
                  href="https://www.linkedin.com/in/ashish-diyondi-817510254/"
                  target="_blank"
                >
                  ASHISH DIYONDI
                </a>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CityDetail;
