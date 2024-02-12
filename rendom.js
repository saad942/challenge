async function fetchTemperature(city) {
  try {
      const fetch = await import('node-fetch');
      const response = await fetch.default(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true`);
      const data = await response.json();
      return data.current_weather.temperature;
  } catch (error) {
      console.error('Error fetching temperature data:', error);
      return null;
  }
}

async function run() {
  const selectedCity = selectRandomCity(cities);
  console.log('Selected City:', selectedCity.name);

  const temperature = await fetchTemperature(selectedCity);

  if (temperature !== null) {
      console.log(`Temperature in ${selectedCity.name}: ${temperature}°C`);
  } else {
      console.log('Failed');
  }
}

run();
