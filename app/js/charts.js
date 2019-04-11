//Ajax call to PHP and get data to return in charts.js format. 

console.log("charts.js called")

var five = require('johnny-five');
var pixel = require("node-pixel");
var Readable = require("stream").Readable;  
var util = require("util");
var axios = require('axios');
util.inherits(MyStream, Readable);  
function MyStream(opt) {  
  Readable.call(this, opt);
}
MyStream.prototype._read = function() {};  
// hook in our stream
process.__defineGetter__("stdin", function() {  
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});


var opts = {};
opts.port = process.argv[2] || "";

  var board = new five.Board({
  repl: false // does not work with browser console
});

//global vars
var scaleSwitch = document.querySelector("#scaleBtn .sliderSwitch");
var scaleBtn = document.querySelector("#scaleBtn .optionSlide");
var scale = "celsius";
var areaSwitch = document.querySelector("#tempBtn .sliderSwitch");
var areaBtn = document.querySelector("#tempBtn .optionSlide");
var area = "room";
var tempTxt = document.querySelector(".tempH");
var scaleCheck = false;
var temp = "metric";

board.on("ready", function() {
  var temperature = new five.Thermometer({
        controller: "LM35",
        pin: "A0",
        freq: 500
      });

  function tempSwitch() {
    temperature.on("change", function() {
      if(scaleSwitch.classList.contains("on")) {
        scale = "imperial";
        scaleCheck = true;
      } else {
        scale = "metric";
        scaleCheck = true;
      }
      if(scaleCheck) {
        if(areaSwitch.classList.contains("on")) {
          var city = "London";
          var country = "ca";
          axios.get('http://api.openweathermap.org/data/2.5/weather', {
            params: {
              q: `${city},${country}`,
              APPID: "62aade36c70bae588c2501d17cd9e8eb",
              units: `${scale}`
            }
          })
          .then(function (response) {
            var data = response.data;
            console.log(data.weather[0].icon);
            var tempNum = Math.round(data.main.temp);
            var tempNum = tempNum.toString();
            if(tempNum.length === 2) {
              tempNum = " " + tempNum;
            } else if(tempNum.length === 1) {
              tempNum = "  " + tempNum;
            }
            if(scale === "metric") {
              temp = tempNum + "°C";
            } else {
              temp = tempNum + "°F";
            }
            //lcdTest();
            return temp;
          })
          .catch(function (error) {
            console.log(error);
          });   
        } else {
          if(scale === "metric") {
            temp = this.celsius + "°C";
          }else{
            temp = this.fahrenheit + "°F";
          }
        }
      }
      
      tempTxt.innerHTML = "Temperature " + temp;
    });
  }

  tempSwitch();

  areaBtn.addEventListener("click", tempSwitch, false);
  scaleBtn.addEventListener("click", tempSwitch, false);
});





//create XHMLHttpRequest object


