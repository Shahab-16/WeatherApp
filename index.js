const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const grantPermission = document.querySelector('[data-grantPermission]');
const searchSection = document.querySelector('[data-search]');
const loadingSection = document.querySelector('[data-loading]');
const weatherSection = document.querySelector('[data-weather]');
const searchBtn = document.querySelector('.btn');
const error = document.querySelector('[data-error]');
const searchInput = document.querySelector('[data-input]'); 
const grantAccessBtn = document.querySelector('[data-Grant_access_btn]'); 

let currTab = userTab;
currTab.classList.add('current_tab');
const api = "a7873156148e21e32cfe46f3d39daf12";
getFromSessionStorage();

// Switch tab function
function switchTab(clickedTab) {
    if (clickedTab == currTab) {
        return;
    }
    currTab.classList.remove("current_tab");
    currTab = clickedTab;
    currTab.classList.add("current_tab");

    // Handle tab visibility
    if (currTab === searchTab) {
        searchSection.classList.add("active");
        weatherSection.classList.remove("active");
        grantPermission.classList.remove("active");
    } else {
        searchSection.classList.remove("active");
        getFromSessionStorage();
    }
}

userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);

});

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if (!localCoordinates) {
        grantPermission.classList.add("active");
        console.log("From Session Storage");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        const { latitude, longitude } = coordinates;
        fetchWeatherApiByCoords(latitude, longitude); // Fixed: Changed to fetchWeatherApiByCoords
    }
}

// Fetch weather data by coordinates
async function fetchWeatherApiByCoords(latitude, longitude) { // Fixed: Renamed function to avoid duplicate names
    grantPermission.classList.remove("active");
    loadingSection.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api}&units=metric`);
        const data = await response.json();
        loadingSection.classList.remove("active");
        weatherSection.classList.add("active");
        renderWeatherData(data);
    } catch (err) {
        loadingSection.classList.remove("active");
        //error.classList.add("active"); // Commented out to avoid unnecessary class addition
    }
}

// Fetch weather data by city
async function fetchWeatherApiByCity(city) { // Fixed: Renamed function to avoid duplicate names
    loadingSection.classList.add("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`);
        const data = await response.json();
        loadingSection.classList.remove("active");
        weatherSection.classList.add("active");
        renderWeatherData(data);
    } catch (err) {
        loadingSection.classList.remove("active");
        error.classList.add("active");
    }
}


function renderWeatherData(data) {
    const place = document.querySelector('[data-place]');
    const flag = document.querySelector('[data-flag]');
    const weatherCondition = document.querySelector('[data-weather_condition]');
    const weatherConditionImg = document.querySelector('[data-weather_condition_img]');
    const temp = document.querySelector('[data-temp]');
    const windSpeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const clouds = document.querySelector('[data-pressure]');

    place.innerText = data?.name;
    flag.src = `https://countryflagsapi.com/png/${data?.sys?.country.toLowerCase()}.png`;
    weatherCondition.innerText = data?.weather[0]?.main;
    weatherConditionImg.src = `http://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    clouds.innerText = `${data?.clouds?.all} %`;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchWeatherApiByCoords(userCoordinates.latitude, userCoordinates.longitude); // Fixed: Changed to fetchWeatherApiByCoords
}

grantAccessBtn.addEventListener('click', () => {
    getLocation();
});



searchSection.addEventListener('submit', (e) => {
    e.preventDefault();
    let city = searchInput.value.trim();
    if(city){
        fetchWeatherApiByCity(city);
        error.classList.remove("active");
    }
    else{
        error.classList.add("active");
    }
});
