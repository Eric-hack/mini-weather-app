const API_KEY = 'ba428c206c42eed40ce79e74a200bf63'; // Replace with your OpenWeatherMap API key
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');

// Search on button click
searchBtn.addEventListener('click', searchWeather);

// Search on Enter key press
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    // Hide previous results and errors
    weatherResult.classList.remove('show');
    errorMessage.classList.remove('show');
    loading.classList.add('show');

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        loading.classList.remove('show');

        if (!response.ok) {
            if (response.status === 404) {
                showError('City not found. Please try again.');
            } else {
                showError('Unable to fetch weather. Check your connection.');
            }
            return;
        }

        const data = await response.json();
        displayWeather(data);
        cityInput.value = ''; // Clear input after successful search

    } catch (error) {
        loading.classList.remove('show');
        showError('Unable to fetch weather. Check your connection.');
    }
}

function displayWeather(data) {
    // Update date and time
    const now = new Date();
    const dateTimeString = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('dateTime').textContent = dateTimeString;

    // Update location
    document.getElementById('location').textContent = 
        `${data.name}, ${data.sys.country}`;

    // Update weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = 
        `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Update temperature
    const temp = data.main.temp.toFixed(1);
    document.getElementById('temperature').innerHTML = 
        `${temp}<span>°C</span>`;

    // Update description
    document.getElementById('description').textContent = 
        data.weather[0].description;

    // Update humidity
    document.getElementById('humidity').textContent = 
        `${data.main.humidity}%`;

    // Update wind speed (convert m/s to km/h)
    const windSpeedKmh = (data.wind.speed * 3.6).toFixed(1);
    document.getElementById('windSpeed').textContent = 
        `${windSpeedKmh} km/h`;

    // Change background based on weather
    changeBackground(data.weather[0].main.toLowerCase());

    // Show weather result
    weatherResult.classList.add('show');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

function changeBackground(weatherCondition) {
    // Remove all weather classes
    document.body.classList.remove('sunny', 'cloudy', 'rainy', 'clear', 'snow');
    
    // Add appropriate class based on weather
    if (weatherCondition.includes('clear')) {
        document.body.classList.add('clear');
    } else if (weatherCondition.includes('cloud')) {
        document.body.classList.add('cloudy');
    } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
        document.body.classList.add('rainy');
    } else if (weatherCondition.includes('snow')) {
        document.body.classList.add('snow');
    } else if (weatherCondition.includes('sun')) {
        document.body.classList.add('sunny');
    }
}