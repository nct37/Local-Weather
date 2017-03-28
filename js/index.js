document.addEventListener("DOMContentLoaded", function(event) {
    //Date
    var today = new Date();
    var hours = today.getHours();
    var date = today.toLocaleDateString();

    window.navigator.geolocation.getCurrentPosition(getLocationWeather);

    function getLocationWeather(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        //Possible refactor to address browser geo location requirement of https:// connection. Codepen doesn't automatically load in https://---connect via a secondary, albeit a less accurate source if user doesn't actively view in https:// or if user denies location request.

        //var url = "https://api.apixu.com/v1/current.json?key=e265c4ee836f4d1ca6132647172001&q=" + lat + " " + lon;
        //function loadData(url, dataFunction) {}
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var response = JSON.parse(xhttp.responseText);

                (function removeLoader() { //Remove loader
                    document.getElementById("loader").style.display = "none";
                })();

                //Add date and time
                document.getElementById("date").innerHTML = date;

                time();

                getData(response);
            }
        };        
        xhttp.open("GET", /*url*/ "https://api.apixu.com/v1/current.json?key=e265c4ee836f4d1ca6132647172001&q=" + lat + " " + lon, true);
        xhttp.send();
    }

    function getData(data) {
        var location = data.location.name + ", \n" + data.location.region;
        var condition = data.current.condition.text;
        var tempF = Math.floor(data.current.temp_f) + "&deg;F";
        var tempC = Math.floor(data.current.temp_c) + "&deg;C";
        var humidity = data.current.humidity + "%";
        var windDirection = data.current.wind_dir;
        var clouds = data.current.cloud;
        var windSpeed = Math.floor(data.current.wind_mph) + "mph";
        var measurement = document.getElementById("temp");
        var newMeasurement = tempF;
        var toggle = document.getElementById("changeMeasurement");

        //Object to display data on the page
        var displayData = {
            showLocation: function() {
                document.getElementById("location").innerHTML = location;
            },
            showCondition: function() {
                var cloudCover = clouds + "%";
                var addCondition = document.createElement("div");
                addCondition.id = 'condition';
                var windIcon = "<i class='wi wi-wind wi-towards-" + windDirection.toLowerCase() + "'></i>";

                document.querySelector(".temp-container").appendChild(addCondition).innerHTML = "<span id='condition-detail'>" + condition + "</span>" + "<p>Cloud cover " + cloudCover + "</p>" + "<p>Humidity " + humidity + ". Winds " + "<em>" + windDirection + "</em>" + " " + windIcon + " " + windSpeed + ". " + "</p";
            },
            showClouds: function() {
                var cloudIcon;
                var cloudIconElement;

                if (clouds >= 0 && clouds < 15) {
                    cloudIcon = "'wi wi-day-sunny'";
                } else if (clouds < 80 && clouds > 15) {
                    cloudIcon = "'wi wi-day-cloudy'";
                } else {
                    cloudIcon = "'wi wi-cloudy'";
                }

                cloudIconElement = "<i class=" + cloudIcon + "></i>";


                document.getElementById("cloudCoverage").innerHTML = cloudIconElement;

            },
            showTemp: function() {

                measurement.innerHTML = tempF;
            },
            toggleMeasurement: function() {
                //Toggle Fahrenheit and Celsius
                toggle.innerHTML = "/ &deg;C";

                toggle.addEventListener("mousedown", function() {

                    if (newMeasurement == tempC) {
                        newMeasurement = tempF;
                        this.innerHTML = "/ &deg;C";
                    } else {
                        newMeasurement = tempC;
                        this.innerHTML = "/ &deg;F";
                    }

                    measurement.innerHTML = newMeasurement;
                });
            },
            displayBackgroundVisual: function() {
                //condition = "thunder"; //- test background
                var pageBackground = document.getElementById("weather");
                var imagePath = "";
                var imageUrl = "('https://res.cloudinary.com/dkdgt4co6/image/upload/";
                var setBackground = condition.toLowerCase();
                //Set background image based on conditions
                if (["sunny", "sunshine", "clear"].indexOf(setBackground) >= 0) {
                    if (hours >= 21) {
                        imagePath = "v1489707725/Starry-Night-Sky_arnoyo.jpg";
                    } else {
                        imagePath = "c_crop,h_1080,q_94,x_0,y_0/v1489626233/dream_landscape-1920x1080_pq9zx0.jpg";
                    }

                } else if (["cloudy", "clouds", "overcast", "mostly cloudy"].indexOf(setBackground) >= 0) {
                    if (hours >= 21) {
                        imagePath = "v1490145601/211605391_782caa152f_o_psvlkd.jpg";
                    } else {
                        imagePath = "v1489628714/England-scenery-fields-tree-cloudy-sky_1920x1200_zjihba.jpg";
                    }

                } else if (["partly cloudy", "partly sunny"].indexOf(setBackground) >= 0) {
                    if (hours >= 21) {
                        imagePath = "v1490145601/211605391_782caa152f_o_psvlkd.jpg";
                    } else {
                        imagePath = "v1490019539/ahoSK4_nd4vsz.jpg";
                    }

                } else if (["rain", "rainy", "showers", "light rain", "heavy rain"].indexOf(setBackground) >= 0) {
                    imagePath = "v1489789747/-_Heavy_rain_Dullness_Bad_weather_Wallpaper_Background_Ultra_HD_4K_phialf.jpg";

                } else if (["storms", "stormy", "thunderstorms", "thunder", "lightning"].indexOf(setBackground) >= 0) {
                    if (hours >= 21) {
                        imagePath = "v1489707239/fantastic-lightning-wallpaper-1942-2092-hd-wallpapers_teflue.jpg";
                    } else {
                        imagePath = "v1490146875/39544132-free-thunderstorm-wallpapers_un1zrl.jpg";
                    }

                } else if (["snow", "snowy", "snow storms", "ice"].indexOf(setBackground) >= 0) {
                    imagePath = "v1489707398/nature-seasons-winter-snow-wallpapers-1920x1200_tktbyd.jpg";
                } else if (["mist", "fog", "patchy fog"].indexOf(setBackground) >= 0) {
                    imagePath = "v1489839154/mist-wallpaper-9_vzq610.jpg";
                } else {
                    imagePath = "v1489708424/gradient-wallpaper-5_ixevmf.png";
                }

                pageBackground.style.backgroundImage = "url" + imageUrl + imagePath + "')";
            },
            showGreeting: function() {
                var greeting;

                if (hours < 12) {
                    greeting = "Good morning!";
                } else if (hours >= 12 && hours < 17) {
                    greeting = "Good afternoon!";
                } else if (hours >= 17 && hours < 21) {
                    greeting = "Good evening!";
                } else {
                    greeting = "Good night!";
                }

                var setGreeting = document.getElementById("greeting");
                setGreeting.innerHTML = greeting;
            }
        };

        displayData.showGreeting();
        displayData.displayBackgroundVisual();
        displayData.showLocation();
        displayData.showTemp();
        displayData.showClouds();
        displayData.showCondition();
        displayData.toggleMeasurement();
    }
});
//Time
var time = function() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    var ampm = (hr < 12) ? "<span>am</span>" : "<span>pm</span>";
    hr = (hr === 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;
    //Add a zero in front of numbers<10
    //hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("time").innerHTML = hr + " : " + min + " : " + sec + " " + ampm;
    setTimeout(function() {
        time();
    }, 500);
};

function checkTime(t) {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
}
