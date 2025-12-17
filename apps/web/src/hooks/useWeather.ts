import { useEffect, useState } from 'react';

export function useWeather(location?: string | null) {
  const [weather, setWeather] = useState<{ humidity?: number; temperature?: number; name?: string }>({});
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.warn('OpenWeather API key not found');
      setLoading(false);
      return;
    }

    // If location is provided and not empty, use it
    if (location && location.trim()) {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location.trim())}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Weather API error: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setWeather({
            humidity: data.main?.humidity,
            temperature: data.main?.temp,
            name: data.name,
          });
        })
        .catch((err) => {
          console.error('Failed to fetch weather by location:', err);
          setWeather({});
        })
        .finally(() => setLoading(false));
      return;
    }

    // If no location, try to use geolocation
    if (!coords && 'geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCoords(newCoords);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLoading(false);
        }
      );
      return;
    }

    // If we have coordinates, fetch weather
    if (coords) {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Weather API error: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setWeather({
            humidity: data.main?.humidity,
            temperature: data.main?.temp,
            name: data.name,
          });
        })
        .catch((err) => {
          console.error('Failed to fetch weather by coordinates:', err);
          setWeather({});
        })
        .finally(() => setLoading(false));
    }
  }, [location, coords]);

  return { weather, loading };
} 