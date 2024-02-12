const fs = require('fs');
fs.readFile('index.txt', 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
  } else {
    try {
      const cities = JSON.parse(data);// reformat data type into json
      const selectedCity = selectRandomCity(cities);//look at selectedCity function    
      const { lat, lng, name/*paris*/  } = selectedCity;
      const temperature = await fetchTemperature(lat, lng);//look at temperature function
      const content = `Temperature in ${name} is: ${temperature}Â°C`;
      if(fs.existsSync(`${name}.txt`)){
        fs.unlink(`${name}.txt`, function (err) {
          if (err) throw err;
          console.log('File deleted!');
        })
      }

      await fs.promises.writeFile(`${name}.txt`, content);
      console.log('File created successfully.');
    } catch (error) {
      console.error('Error:', error);
    }
  }
});

//function to get rendom city from index.txt
function selectRandomCity(cities) {
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
}
// function fetch
async function fetchTemperature(lat, lng) {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
    const data = await response.json();
    const temperature = data.current_weather.temperature;
    return temperature;
  } catch (error) {
    throw new Error('Error fetching temperature data');
  }
}