var momentum = async function () {
  const GRETINGS = [
    "Good Morning, ",
    "Good Afternoon, ",
    "Good Evening, ",
    "Good Night, ",
  ];
  let currentImage = 0;
  let currentState = "";
  let shuffledImages = [];
  let isChange = true;

  let time = document.querySelector(".time");
  let date = document.querySelector(".date");
  let greetingField = document.querySelector(".greeting");

  function updateTime() {
    var dateTime = new Date();

    var hour = dateTime.getHours();
    hour = formatIndication(hour);

    var minutes = dateTime.getMinutes();
    minutes = formatIndication(minutes);

    var seconds = dateTime.getSeconds();
    seconds = formatIndication(seconds);

    var month = dateTime.toLocaleString("en", { month: "long" });
    var weekDay = dateTime.toLocaleString("en", { weekday: "long" });
    var day = dateTime.getDate();

    time.innerHTML =
      "<span>" +
      hour +
      "</span>" +
      ":" +
      "<span>" +
      minutes +
      "</span>" +
      ":" +
      "<span>" +
      seconds +
      "</span>";
    date.textContent = weekDay + ", " + month + " " + day;
  }

  function formatIndication(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  }

  function timeStart() {
    setInterval(updateTime, 1000);
    updateTime();
  }

  async function shuffleImages() {
    var url = "assets/images/images.json";
    let imagesJson = [];
    var res = await fetch(url);
    if (res.ok) {
      imagesJson = await res.json();
      for (var i = 0; i < imagesJson.length; i++) {
        imagesJson[i].images = imagesJson[i].images.sort(
          () => 0.5 - Math.random()
        );
      }
      return imagesJson;
    }
  }

  function updateBackgroundImage() {
    if (isChange) {
      isChange = false;
      var images = shuffledImages.find((s) => s.state === currentState);
      const body = document.querySelector("body");
      const src = images.images[currentImage];
      const img = document.createElement("img");
      currentImage += 1;
      if (currentImage >= images.images.length) {
        currentImage = 0;
      }
      img.src = src;
      img.onload = () => {
        body.style.backgroundImage = `url(${src})`;
      };
    }
  }

  function greetingsTimerStart() {
    setInterval(greetingsUpdate, 1000 * 60);
    greetingsUpdate();
  }

  function greetingsTimer() {
    var nextDate = new Date();
    if (nextDate.getMinutes() === 0) {
      greetingsTimerStart();
    } else {
      nextDate.setHours(nextDate.getHours() + 1);
      nextDate.setMinutes(0);
      nextDate.setSeconds(0);

      var difference = nextDate - new Date();
      setTimeout(greetingsTimerStart, difference);
    }
  }

  function greetingsUpdate() {
    var dateTime = new Date();
    var hour = dateTime.getHours();
    if (hour >= 6 && hour < 12) {
      greetingField.textContent = GRETINGS[0];
      currentState = "morning";
    }
    if (hour >= 12 && hour < 18) {
      greetingField.textContent = GRETINGS[1];
      currentState = "day";
    }
    if (hour >= 18 && hour < 24) {
      greetingField.textContent = GRETINGS[2];
      currentState = "evening";
    }
    if (hour >= 0 && hour < 6) {
      greetingField.textContent = GRETINGS[3];
      currentState = "night";
    }
    updateBackgroundImage();
  }

  function updateName() {
    var nameField = document.querySelector(".name");
    var name = localStorage.getItem("name");
    if (isEmpty(nameField.textContent)) {
      if (name) {
        nameField.textContent = name;
      } else {
        nameField.textContent = "[Enter Name]";
      }
    } else {
      localStorage.setItem("name", nameField.textContent);
    }
  }

  function updateFocus() {
    var focusField = document.querySelector(".focus");
    var focus = localStorage.getItem("focus");
    if (isEmpty(focusField.textContent)) {
      if (focus) {
        focusField.textContent = focus;
      } else {
        focusField.textContent = "[Enter Focus]";
      }
    } else {
      localStorage.setItem("focus", focusField.textContent);
    }
  }

  function updateCity() {
    var cityField = document.querySelector(".city");
    var city = localStorage.getItem("city");
    if (isEmpty(cityField.textContent)) {
      if (city) {
        cityField.textContent = city;
      } else {
        cityField.textContent = "[Enter City]";
      }
    } else {
      localStorage.setItem("city", cityField.textContent);
    }
  }

  async function updateWeatherForecast() {
    var city = localStorage.getItem("city");
    var weather = document.querySelector(".weather");
    var errorText = weather.querySelector(".error-message");
    var buttonRefresh = weather.querySelector(".refresh-button");
    if (city) {
      errorText.classList.add("hide");
      var temp = weather.querySelector(".temp");
      var humidity = weather.querySelector(".humidity");
      var wind = weather.querySelector(".wind");
      var img = weather.querySelector(".weather-icon");
      buttonRefresh.classList.add("rotate");
      var url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&appid=2d4bcdd60c83c3961111adcec977e4ec";
      let weatherJson;
      var res = await fetch(url);
      if (res.ok) {
        weatherJson = await res.json();
        var icon = weatherJson.weather[0].icon;
        img.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" + icon + "@2x.png"
        );
        img.classList.remove("hide");
        temp.textContent = Math.round(weatherJson.main.temp - 273.15) + "°C";
        humidity.innerHTML =
          "<span>Humidity: </span><span>" +
          weatherJson.main.humidity +
          "%" +
          "</span>";
        wind.innerHTML =
          "<span>Wind speed: </span><span>" +
          weatherJson.wind.speed +
          "m/s" +
          "</span>";
        buttonRefresh.classList.remove("rotate");
      } else {
        errorText.classList.remove("hide");
        errorText.textContent = "No сity for weather forecast";
        img.classList.add("hide");
        temp.textContent = "";
        humidity.textContent = "";
        wind.textContent = "";
        buttonRefresh.classList.remove("rotate");
      }
    } else {
      errorText.classList.remove("hide");
      errorText.textContent = "No сity for weather forecast";
    }
  }

  function updateWeatherForecastStart() {
    var timer = 1000 * 60 * 30;
    setInterval(updateWeatherForecast, timer);
    updateWeatherForecast();
  }

  async function updateQoute() {
    var quoteField = document.querySelector(".quote-of-day");
    var quoteAuthorField = document.querySelector(".quote-author");
    var quoteRefresh = document.querySelector(".quote-refresh");
    quoteRefresh.classList.add("rotate");
    quoteRefresh.disabled = true;
    var url = "https://type.fit/api/quotes";
    let quotes;
    var res = await fetch(url);
    if (res.ok) {
      quotes = await res.json();
      var quote = quotes[Math.floor(Math.random() * quotes.length)];
      quoteField.textContent = quote.text;
      if (quote.author) {
        quoteAuthorField.textContent = "- " + quote.author;
      }
      quoteRefresh.classList.remove("rotate");
      quoteRefresh.disabled = false;
    } else {
      quoteField.textContent = "Cake is a lie";
      quoteRefresh.classList.remove("rotate");
      quoteRefresh.disabled = false;
    }
  }

  function setUpListeners() {
    var nameField = document.querySelector(".name");
    var nameBuffer = "";
    nameField.addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.blur();
      }
      if (event.keyCode === 27) {
        event.preventDefault();
        this.textContent = "";
        this.blur();
      }
    });
    nameField.addEventListener("click", function () {
      nameBuffer = nameField.textContent;
      this.textContent = "";
    });
    nameField.addEventListener("blur", function () {
      updateName();
    });

    var focusField = document.querySelector(".focus");
    var focusBuffer = "";
    focusField.addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.blur();
      }
      if (event.keyCode === 27) {
        event.preventDefault();
        this.textContent = "";
        this.blur();
      }
    });
    focusField.addEventListener("click", function () {
      focusBuffer = focusField.textContent;
      this.textContent = "";
    });
    focusField.addEventListener("blur", function () {
      updateFocus();
    });

    var cityField = document.querySelector(".city");
    var cityBuffer = "";
    cityField.addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.blur();
      }
      if (event.keyCode === 27) {
        event.preventDefault();
        this.textContent = "";
        this.blur();
      }
    });
    cityField.addEventListener("click", function () {
      cityBuffer = cityField.textContent;
      this.textContent = "";
    });
    cityField.addEventListener("blur", function () {
      updateCity();
      updateWeatherForecast();
    });

    var buttonRefresh = document.querySelector(".refresh-button");
    buttonRefresh.addEventListener("click", updateWeatherForecast);

    var quoteRefresh = document.querySelector(".quote-refresh");
    quoteRefresh.addEventListener("click", updateQoute);

    var refreshImage = document.querySelector(".refresh-background");
    refreshImage.addEventListener("click", updateBackgroundImage);

    let backColor = document.querySelector("body");
    backColor.addEventListener("transitionend", () => {
      isChange = true;
    });
  }

  function isEmpty(str) {
    return str.length === 0 || !str.trim();
  }

  timeStart();
  shuffledImages = await shuffleImages();
  greetingsUpdate();
  greetingsTimer();
  updateName();
  updateFocus();
  updateCity();
  updateQoute();
  updateWeatherForecastStart();
  setUpListeners();
};

momentum();
