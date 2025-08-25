import { useEffect, useState } from 'react';

export function useWeather(location?: string) {
  const [weather, setWeather] = useState<{ humidity?: number; temperature?: number; name?: string }>({});
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!location && !coords) {
      // Request geolocation permission and get coordinates
      if ('geolocation' in navigator) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            setLoading(false);
          },
          () => {
            setLoading(false);
            // Optionally handle error (user denied, etc.)
          }
        );
      }
      return;
    }
    setLoading(true);
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    let url = '';
    if (coords) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
    } else if (location) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    }
    if (!url) return;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setWeather({
          humidity: data.main?.humidity,
          temperature: data.main?.temp,
          name: data.name,
        });
      })
      .catch(() => setWeather({}))
      .finally(() => setLoading(false));
  }, [location, coords]);

  return { weather, loading };
} 