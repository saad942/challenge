const fs = require('fs');
const http = require('http');

const server = http.createServer(async (req, res) => {
    if (req.url === '/weather') {
        res.write('Choose city');
        res.end();
    } else if (req.url.startsWith('/weather/')) {
        const cityName = req.url.split('/')[2];
        const data = await fs.promises.readFile("./index.txt");
        const datau = JSON.parse(data);
        const cityData = datau.find(city => city.name === cityName);
        if (cityData) {
            const temperature = await fetchData(cityData.lat, cityData.lng);
            res.write(`Temperature in ${cityName}: ${temperature}°C`);
        } else {
            res.write('City not found');
        }
        res.end();
    } 
});

async function fetchData(lat, lng) {
    const fetch = await import('node-fetch');
    const response = await fetch.default(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
    const data = await response.json();
    return data.current_weather.temperature;
}


server.listen(3001, () => {
    console.log('Your server is running on port 3001');
});
