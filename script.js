async function getWeather() {
    const location = document.getElementById('location').value;
    const API_KEY = "a4defdd7afabe900133f210afa9638e5"; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.cod === 200) {
        document.getElementById('city-name').textContent = `📍 Location: ${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').textContent = `🌡 Temperature: ${data.main.temp}°C`;
        document.getElementById('wind-speed').textContent = `🌬 Wind Speed: ${data.wind.speed} km/h`;
        document.getElementById('humidity').textContent = `💧 Humidity: ${data.main.humidity}%`;
        document.getElementById('condition').textContent = `Condition: ${data.weather[0].description}`;
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }
  