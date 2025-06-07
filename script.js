const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
    const DEFAULT_CITY = 'Tehran';

    document.addEventListener('DOMContentLoaded', () => {
      const locationEl = document.getElementById('location');
      const tempEl = document.getElementById('temperature');
      const descEl = document.getElementById('description');
      const forecastEl = document.getElementById('forecast');
      const appEl = document.getElementById('app');

      function setTheme(sunrise, sunset) {
        const now = new Date().getTime() / 1000;
        appEl.className = now >= sunrise && now <= sunset ? 'bg-blue-100 text-gray-800' : 'bg-gray-800 text-white';
      }

      function displayWeather(data) {
        locationEl.textContent = `${data.name}, ${data.sys.country}`;
        tempEl.textContent = `${Math.round(data.main.temp)}°C`;
        descEl.textContent = data.weather[0].description;
        setTheme(data.sys.sunrise, data.sys.sunset);
      }

      function displayForecast(data) {
        forecastEl.innerHTML = '';
        const daily = {};
        data.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!daily[date]) {
            daily[date] = item;
          }
        });

        Object.values(daily).slice(0, 5).forEach(item => {
          const el = document.createElement('div');
          el.className = 'p-2 bg-white bg-opacity-20 rounded-lg';
          el.innerHTML = `
            <p>${new Date(item.dt_txt).toDateString()}</p>
            <p>${Math.round(item.main.temp)}°C</p>
            <p>${item.weather[0].main}</p>
          `;
          forecastEl.appendChild(el);
        });
      }

      function fetchWeatherByCoords(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
          .then(res => res.json())
          .then(displayWeather);

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
          .then(res => res.json())
          .then(displayForecast);
      }

      function fetchWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
          .then(res => res.json())
          .then(displayWeather);

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
          .then(res => res.json())
          .then(displayForecast);
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          },
          () => fetchWeather(DEFAULT_CITY)
        );
      } else {
        fetchWeather(DEFAULT_CITY);
      }
    });