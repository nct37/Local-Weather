document.addEventListener('DOMContentLoaded', function(event) {
  //Date
  let today = new Date();
  let hours = today.getHours();
  let date = today.toLocaleDateString();

  window.navigator.geolocation.getCurrentPosition(
    getLocationWeather,
    getLocationWeather
  );

  function getLocationWeather(position) {
    let setLocation = '';
    if (!position.coords) {
      setLocation = prompt('Please enter a zipcode');
    } else {
      setLocation = position.coords.latitude + ',' + position.coords.longitude;
    }

    loadDateandTime();

    return fetch(
      'http://api.weatherstack.com/current?access_key=ef6a33e6d6213a6b9322e8e3501396d2&query=' +
        setLocation
    )
      .then(data => data.json())
      .then(json => getData(json));
  }

  function loadDateandTime() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('date').innerHTML = date;
    time();
  }
  45242;

  function getData(data) {
    console.log(data.current);
    const location = `${data.location.name},
                      ${data.location.region}`;
    const condition = data.current.weather_descriptions[0];
    const tempC = `${Math.floor(data.current.temperature)}&deg;C`;
    const tempF = `${Math.floor(
      data.current.temperature * (9 / 5) + 32
    )}&deg;F`;
    const humidity = `${data.current.humidity}%`;
    const windDirection = data.current.wind_dir;
    const clouds = data.current.cloudcover;
    let windSpeed = `${data.current.wind_speed || 0} mph`;

    let measurement = document.getElementById('temp');
    let newMeasurement = tempF;

    const displayData = {
      showLocation: function() {
        document.getElementById('location').innerHTML = location;
      },
      showCondition: function() {
        let addCondition = document.createElement('div');
        addCondition.id = 'condition';
        let cloudCover = `${clouds}%`;
        let windIcon = `<i class='wi wi-wind wi-towards-${windDirection.toLowerCase()}'}></i>`;
        console.log(windIcon);

        document
          .querySelector('.temp-container')
          .appendChild(
            addCondition
          ).innerHTML = `<span id='condition-detail'>${condition}</span>
          <p>Cloud cover ${cloudCover}</p>
          <p>Humidity ${humidity} | Winds ${windDirection} ${windIcon} ${windSpeed}</p>`;
      },
      showClouds: function() {
        let cloudIcon = "'wi wi-night-clear'";
        let cloudIconElement = '';

        if (clouds >= 0 && clouds < 15) {
          if (hours >= 21 || hours < 6) {
            cloudIcon = "'wi wi-night-clear'";
          } else {
            cloudIcon = "'wi wi-day-sunny'";
          }
        } else if (clouds < 80 && clouds > 15) {
          if (hours >= 21 || hours < 6) {
            cloudIcon = "'wi wi-night-alt-cloudy'";
          } else {
            cloudIcon = "'wi wi-day-cloudy'";
          }
        } else {
          cloudIcon = "'wi wi-cloudy'";
        }

        cloudIconElement = '<i class=' + cloudIcon + '></i>';

        document.getElementById('cloudCoverage').innerHTML = cloudIconElement;
      },
      showTemp: function() {
        measurement.innerHTML = tempF;
        displayData.toggleMeasurement();
      },
      toggleMeasurement: function() {
        measurement.addEventListener('mousedown', function() {
          newMeasurement == tempC
            ? (newMeasurement = tempF)
            : (newMeasurement = tempC);
          this.innerHTML = newMeasurement;
        });
      },
      displayBackgroundVisual: function() {
        let pageBackground = document.getElementById('weather');
        let imageUrl = `('https://res.cloudinary.com/dkdgt4co6/image/upload/`;
        let setBackground = condition.toLowerCase();
        let imagePath = '';

        if (['sunny', 'sunshine', 'clear'].indexOf(setBackground) >= 0) {
          if (hours >= 21) {
            imagePath = 'v1489707725/Starry-Night-Sky_arnoyo.jpg';
          } else {
            imagePath =
              'c_crop,h_1080,q_94,x_0,y_0/v1489626233/dream_landscape-1920x1080_pq9zx0.jpg';
          }
        } else if (
          ['cloudy', 'clouds', 'overcast', 'mostly cloudy'].indexOf(
            setBackground
          ) >= 0
        ) {
          if (hours >= 21) {
            imagePath = 'v1490145601/211605391_782caa152f_o_psvlkd.jpg';
          } else {
            imagePath =
              'v1489628714/England-scenery-fields-tree-cloudy-sky_1920x1200_zjihba.jpg';
          }
        } else if (
          ['partly cloudy', 'partly sunny'].indexOf(setBackground) >= 0
        ) {
          if (hours >= 21) {
            imagePath = 'v1490145601/211605391_782caa152f_o_psvlkd.jpg';
          } else {
            imagePath = 'v1490019539/ahoSK4_nd4vsz.jpg';
          }
        } else if (
          ['rain', 'rainy', 'showers', 'light rain', 'heavy rain'].indexOf(
            setBackground
          ) >= 0
        ) {
          imagePath =
            'v1489789747/-_Heavy_rain_Dullness_Bad_weather_Wallpaper_Background_Ultra_HD_4K_phialf.jpg';
        } else if (
          ['storms', 'stormy', 'thunderstorms', 'thunder', 'lightning'].indexOf(
            setBackground
          ) >= 0
        ) {
          if (hours >= 21) {
            imagePath =
              'v1489707239/fantastic-lightning-wallpaper-1942-2092-hd-wallpapers_teflue.jpg';
          } else {
            imagePath =
              'v1490146875/39544132-free-thunderstorm-wallpapers_un1zrl.jpg';
          }
        } else if (
          ['snow', 'snowy', 'snow storms', 'ice'].indexOf(setBackground) >= 0
        ) {
          imagePath =
            'v1489707398/nature-seasons-winter-snow-wallpapers-1920x1200_tktbyd.jpg';
        } else if (['mist', 'fog', 'patchy fog'].indexOf(setBackground) >= 0) {
          imagePath = 'v1489839154/mist-wallpaper-9_vzq610.jpg';
        } else {
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
