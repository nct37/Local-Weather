document.addEventListener('DOMContentLoaded', () => {
  let today = new Date();
  let hours = today.getHours();
  let date = today.toLocaleDateString();
  let setLocation = 'fetch:ip';
  let coords = '';

  window.navigator.geolocation.getCurrentPosition(
    getLocationWeather,
    getLocationWeather
  );

  function getLocation(position) {
    if (!position.coords) {
      return setLocation;
    } else {
      coords = `${position.coords.latitude},${position.coords.longitude}`;
      setLocation = coords;
      return setLocation;
    }
  }

  async function getLocationWeather(setLocation) {
    let location = getLocation(setLocation);
    try {
      const data = await fetch(
        `https://cors-anywhere.herokuapp.com/http://api.weatherstack.com/current?access_key=ef6a33e6d6213a6b9322e8e3501396d2&query=${location}&units=f`
      );
      const json = await data.json();
      getData(json);
      return loadDateandTime();
    } catch (error) {
      alert('There was a problem with the data. Please try again!');
      console.error(error);
    }
  }

  function loadDateandTime() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('loading-message').style.display = 'none';
    document.getElementById('date').innerHTML = date;
    time();
  }

  function getData(data) {
    const location = `${data.location.name},
                      ${data.location.region}`;
    const condition = data.current.weather_descriptions[0];
    const tempC = `${Math.floor(
      ((data.current.temperature - 32) * 5) / 9
    )}&deg;C`;
    const tempF = `${Math.floor(data.current.temperature)}&deg;F`;
    const feelsLikeC = `${Math.floor(
      ((data.current.feelslike - 32) * 5) / 9
    )}&deg;C`;
    const feelsLikeF = `${Math.floor(data.current.feelslike)}&deg;F`;
    const humidity = `${data.current.humidity}%`;
    const windDirection = data.current.wind_dir;
    const clouds = data.current.cloudcover;
    const precipInch = `${data.current.precip}in`;
    const precipMM = `${Math.floor(data.current.precip * 25.4)}mm`;
    const uv = `${data.current.uv_index}`;
    const windSpeedMph = `${data.current.wind_speed || 0}mph`;
    const windSpeedKph = `${Math.ceil(data.current.wind_speed * 1.609)}kph`;

    let measurementIsF = false;
    let windSpeed = windSpeedMph;
    let feelsLike = feelsLikeF;
    let precip = precipInch;

    const mainTemp = document.getElementById('temp');

    function setTempMeasurementState() {
      measurementIsF = !measurementIsF;
    }

    const displayData = {
      showLocation: function() {
        document.getElementById('location').innerHTML = location;
      },
      showCondition: function() {
        let addCondition = document.createElement('div');
        addCondition.id = 'condition';
        let cloudCover = `${clouds}%`;
        let windIcon = `<i class='wi wi-wind wi-towards-${windDirection.toLowerCase()}'}></i>`;

        document
          .querySelector('.temp-container')
          .appendChild(
            addCondition
          ).innerHTML = `<div class='condition-wrapper'>
              <p id='condition-detail'>${condition}</p>
              <p>Cloud cover ${cloudCover}</p>
              <p>Humidity ${humidity} | Winds ${windDirection} ${windIcon} <span id="wind-speed">${windSpeed}</span></p>
              <p>Precip <span id="precip">${precip}</span> | Feels like <span id="feels-like">${feelsLike}</span></p>
              <p>UV index ${uv}</p>
            </div>
            <div class="location-input">
              <input type='text' id="update-input" placeholder="Enter location details" />
              <div class="input-btns">
                <button type='button' id="update">Update Location</button><button type='button' id='coords' title='Use previously saved coordinates'>GPS</button>
              </div>
            </div>
            `;

        document.getElementById('update').addEventListener('click', e => {
          e.preventDefault();
          const location = document.getElementById('update-input').value;
          if (location.length < 1) {
            alert('Please enter a valid city name or zipcode');
          } else {
            setLocation = location;
            let condition = document.getElementById('condition');
            condition.remove();
            getLocationWeather(setLocation);
          }
        });

        document.getElementById('coords').addEventListener('click', e => {
          e.preventDefault();
          if (coords.length < 1) {
            alert(
              'Location services are disable. Please enable to get accurate weather'
            );
          } else {
            let location = document.getElementById('update-input').value;
            location = coords;
            setLocation = location;
            let condition = document.getElementById('condition');
            condition.remove();
            getLocationWeather(setLocation);
          }
        });
      },
      showClouds: function() {
        let cloudIcon = 'wi wi-night-clear';
        let cloudIconElement = '';

        if (clouds >= 0 && clouds < 15) {
          if (hours >= 21 || hours < 6) {
            cloudIcon = 'wi wi-night-clear';
          } else {
            cloudIcon = 'wi wi-day-sunny';
          }
        } else if (clouds < 80 && clouds > 15) {
          if (hours >= 21 || hours < 6) {
            cloudIcon = 'wi wi-night-alt-cloudy';
          } else {
            cloudIcon = 'wi wi-day-cloudy';
          }
        } else {
          cloudIcon = 'wi wi-cloudy';
        }

        cloudIconElement = `<i class="${cloudIcon}"></i>`;

        document.getElementById('cloud-coverage').innerHTML = cloudIconElement;
      },
      showTemp: function() {
        mainTemp.innerHTML = tempF;
        displayData.toggleMeasurement();
      },
      toggleMeasurement: function() {
        mainTemp.addEventListener('click', function() {
          let feelsLike = document.getElementById('feels-like');
          let precip = document.getElementById('precip');
          let windSpeed = document.getElementById('wind-speed');
          setTempMeasurementState();
          if (!measurementIsF) {
            mainTemp.innerHTML = tempF;
            feelsLike.innerHTML = feelsLikeF;
            precip.innerHTML = precipInch;
            windSpeed.innerHTML = windSpeedMph;
          } else {
            mainTemp.innerHTML = tempC;
            feelsLike.innerHTML = feelsLikeC;
            precip.innerHTML = precipMM;
            windSpeed.innerHTML = windSpeedKph;
          }
        });
      },
      displayBackgroundVisual: function() {
        let pageBackground = document.getElementById('weather');
        let imageUrl = `('https://res.cloudinary.com/dkdgt4co6/image/upload/`;
        let setBackground = condition.toLowerCase();
        let imagePath = '';

        switch (setBackground.length > 0) {
          case ['sunny', 'sunshine', 'clear'].includes(setBackground):
            if (hours >= 21) {
              imagePath = 'v1489707725/Starry-Night-Sky_arnoyo.jpg';
            } else {
              imagePath =
                'c_crop,h_1080,q_94,x_0,y_0/v1489626233/dream_landscape-1920x1080_pq9zx0.jpg';
            }
            break;
          case ['cloudy', 'clouds', 'overcast', 'mostly cloudy'].includes(
            setBackground
          ):
            if (hours >= 21) {
              imagePath = 'v1490145601/211605391_782caa152f_o_psvlkd.jpg';
            } else {
              imagePath =
                'v1489628714/England-scenery-fields-tree-cloudy-sky_1920x1200_zjihba.jpg';
            }
            break;
          case ['partly cloudy', 'partly sunny'].includes(setBackground):
            if (hours >= 21) {
              imagePath = 'v1490145601/211605391_782caa152f_o_psvlkd.jpg';
            } else {
              imagePath = 'v1490019539/ahoSK4_nd4vsz.jpg';
            }
            break;
          case ['rain', 'showers', 'heavy rain'].includes(setBackground):
            imagePath =
              'v1489789747/-_Heavy_rain_Dullness_Bad_weather_Wallpaper_Background_Ultra_HD_4K_phialf.jpg';
            break;
          case ['light rain', 'rainy', 'some rain'].includes(setBackground):
            imagePath = 'v1568992217/rain_light_c4diox.jpg';
            break;
          case [
            'storms',
            'stormy',
            'thunderstorms',
            'thunder',
            'lightning',
          ].includes(setBackground):
            if (hours >= 21) {
              imagePath =
                'v1489707239/fantastic-lightning-wallpaper-1942-2092-hd-wallpapers_teflue.jpg';
            } else {
              imagePath =
                'v1490146875/39544132-free-thunderstorm-wallpapers_un1zrl.jpg';
            }
            break;
          case ['snow', 'snowy', 'snow storms', 'ice'].includes(setBackground):
            imagePath =
              'v1489707398/nature-seasons-winter-snow-wallpapers-1920x1200_tktbyd.jpg';
            break;
          case ['mist', 'fog', 'patchy fog'].includes(setBackground):
            imagePath = 'v1489839154/mist-wallpaper-9_vzq610.jpg';
            break;
          default:
            imagePath = 'v1489708424/gradient-wallpaper-5_ixevmf.png';
        }

        pageBackground.style.backgroundImage = `url${imageUrl}${imagePath}')`;
      },
      showGreeting: function() {
        let setGreeting = document.getElementById('greeting');
        let greeting = '';
        if (hours < 12) {
          greeting = 'Good morning!';
        } else if (hours >= 12 && hours < 17) {
          greeting = 'Good afternoon!';
        } else if (hours >= 17 && hours < 21) {
          greeting = 'Good evening!';
        } else {
          greeting = 'Good night!';
        }

        setGreeting.innerHTML = greeting;
      },
    };

    displayData.showGreeting();
    displayData.displayBackgroundVisual();
    displayData.showLocation();
    displayData.showTemp();
    displayData.showClouds();
    displayData.showCondition();
  }
});

function time() {
  let today = new Date();
  let hr = today.getHours();
  let min = today.getMinutes();
  let sec = today.getSeconds();
  let ampm = hr < 12 ? '<span>am</span>' : '<span>pm</span>';
  hr = hr === 0 ? 12 : hr;
  hr = hr > 12 ? hr - 12 : hr;

  min = checkTime(min);
  sec = checkTime(sec);

  document.getElementById('time').innerHTML =
    hr + ' : ' + min + ' : ' + sec + ' ' + ampm;

  function checkTime(t) {
    if (t < 10) {
      t = '0' + t;
    }
    return t;
  }

  setTimeout(function() {
    time();
  }, 500);
}
