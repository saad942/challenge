const http = require('http');
const { URL } = require('url');
const fetch = require('node-fetch');

const server = http.createServer(async (req, res) => {
    const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
    
    if (pathname === '/weather') {
        const cityName = searchParams.get('city');

        if (!cityName) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('City name is required.');
        }

        try {
            const temperature = await fetchWeather(cityName);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Temperature in ${cityName}: ${temperature}°C`);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal server error.');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found.');
    }
});

async function fetchWeather(cityName) {
    const apiKey = 'YOUR_WEATHER_API_KEY'; // Replace with your weather API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('City not found.');
    }
    const data = await response.json();
    return data.main.temp;
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
