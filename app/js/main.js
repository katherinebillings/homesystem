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

//toggle slider (iphone style)
//Variables
var sliderSwitch = document.querySelectorAll(".sliderSwitch");
var optionsBox = document.querySelectorAll(".options");
var options = document.querySelectorAll(".optionSlide");

//function
var toggleSlide = e => {
  for(var i = 0; i < options.length; i++) {
    if (e.currentTarget === options[i]) {
      sliderSwitch[i].classList.toggle("on");
      optionsBox[i].classList.toggle("on");
    }
  }
};
    //listener
    options.forEach(optionSlide => {
    optionSlide.addEventListener("click", toggleSlide);
});

function createRemap(inMin, inMax, outMin, outMax) {
  return function remaper(x) {
    return Math.round((x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
  };
}

var returnData;

function createRequest(){
  var request;

  //see if request has been made.
  
  if(window.XMLHttpRequest){
    request = new XMLHttpRequest();
    }else if(window.ActiveXObject) {
      request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if(request===null){
      alert("Your browser does not support Ajax");
    } 
    //create variables to send to php file. 
    var url ="http://localhost:8888/homesystem-katie/app/settingsDB.php"; //this is the php file that will send the sensor data to the db    from the html/js file it’s feeding from.

    //html div name that is assigned the sensor data id from the js file.
    //var tempValue = document.querySelector("#tempValue");
        
    request.onreadystatechange = function(){
      if(request.readyState === 4 && request.status===200){

        returnData = JSON.parse(request.responseText);        
        runBoard(returnData);

      }     

    }
    request.open("GET", url, true);
    request.send(null);
}

createRequest();



function runBoard(data) {
  var hue = data.hue;
  var sat = data.sat;
  var brit = data.brit;
  var autoCheck = data.Check;
  var scale = data.scale;
  var area = data.area;
  var city = data.city;
  var country = data.country;
  var origin = data.origin;
  var dest = data.dest;
  var depH = data.depH;
  var depM = data.depM;
  var phone = data.phone;
  var alarm = data.alarm;
  var repeat = data.repeat;
  var rptState = data.repeatState;
  var party;
  var first = true;
  var tempTxt;
  var tempR;
  var tempL;
  var tempLPr;
  var icon;
  var tempPast = [];
  var diff;
  var dur;
  var tempText = true;
  var gasText = true;
  var safe = true;
  var sensorValue = 0;
  var calibR0;
  var count = 0;
  
  board.on("ready", function() {

    var piezo = new five.Piezo(3);
  
    var photoresistor = new five.Sensor({
      pin: "A2",
      freq: 500
    });
  
    strip = new pixel.Strip({
      data: 6,
      length: 30,
      color_order: pixel.COLOR_ORDER.GRB,
      board: this,
      controller: "FIRMATA",
    });
    
    strip.on("ready", function() {
      console.log("strip's ready");
  
      var temperature = new five.Thermometer({
            controller: "LM35",
            pin: "A0",
            freq: 500
          });
  
      if(location.href.indexOf("temp") > -1) {
function createRequestTemp(){

              console.log("createRequest called");
              var requestT;

              //see if request has been made.
              
              if(window.XMLHttpRequest){
                requestT = new XMLHttpRequest();
                }else if(window.ActiveXObject) {
                  requestT = new ActiveXObject("Microsoft.XMLHTTP");
                }
                else if(request===null){
                  alert("Your browser does not support Ajax");
                } 
                


                //create variables to send to php file. 
                var url ="http://localhost:8888/homesystem-katie/app/historyDB.php"; //this is the php file that will send the sensor data to the db    from the html/js file it’s feeding from.

                //html div name that is assigned the sensor data id from the js file.
                //var tempValue = document.querySelector("#tempValue");
                    
                requestT.onreadystatechange = function(){
                  if(requestT.readyState === 4 && requestT.status===200){
                    var returnData = JSON.parse(requestT.responseText);//returnData is my data that i need to put into a chart.js. create the chart and the hook it up to returnData.
                    var temp = [];
                    var labels = []
                    var count = 0;
                    //figure out how to get charts to show up in this code.
                    //take the data that is inside of returnData, and format it as necessary to match the chart format
                    for(var i = 0; i < returnData.length; i++) {
                      temp[i] = returnData[i].celsius;
                        labels[i] = "";
                    }

                    var ctx = document.querySelector('#history').getContext("2d");

              
              //var returnData = new Chart(ctx, {
              var tempHistory = new Chart(ctx, {
                type: 'line',
                //data: {},
                data: {
                  //weekdays to match with the timestamps from the db for temperature.
                    labels: labels,
                    datasets: [{
                        label: "temperature",
                        borderColor: "#AFD367",
                        pointBorderColor: "#AFD367",
                        pointBorderWidth: 2,
                        fill: false,
                        borderWidth: 2,
                        // data: [returnData] 
                        data: temp

                        //data: variable that holds your data 
                        //this need to be a varibale that holds your Data
                        //timestamp from db here?
                    }]
                },
                options: {
                  title:{
                    display: true,
                    //text: 'Temperature History'
                  },
                    legend: {
                    position: "bottom"
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: "#2b2a2a",
                                fontStyle: "bold",
                                beginAtZero: true,
                                maxTicksLimit: 5,
                                padding: 20,
                                stepSize: 5
                            },
                            gridLines: {
                                drawTicks: false,
                                display: false
                            }

                        }],
                        xAxes: [{
                            gridLines: {
                                zeroLineColor: "transparent"
                            },
                            ticks: {
                                padding: 20,
                                fontColor: "#2b2a2a",//dark grey
                                fontStyle: "bold"
                            }
                        }]
                    },
                    tooltips: {
                      /*callbacks: {
                        label: function(tooltipItem, data) {
                          var count = data.datasets[tooltipItem.datasetIndex];
                          var label = data.datasets[tooltipItem.datasetIndex].label;
                            label += "test" + data.datasets[tooltipItem.datasetIndex].data[count];
                          return label;
                        }
                      }*/
                    }
                }
            });
                    






                  }     

                }
                requestT.open("GET", url, true);
                requestT.send(null); 



                //send data to php and wait for response to update status div.
                //document.querySelector("#tempValue").innerHTML = "Displaying History…";









                //html div name that is assigned the sensor data id from the js file.
                //var tempValue = document.querySelector("#tempValue");
                
                
                

                

                function saveTempData(){
                  console.log("function has been fired"); //check to see if function is working.

                  console.log(e.currentTarget.value); //will pull data where sensors is feeding back.

                  
              
                }





            }

            createRequestTemp();
      }


      temperature.on("change", function() {
        if(location.href.indexOf("temp") > -1) {
          tempTxt = document.querySelector(".tempH");
          var areaSwitch = document.querySelector("#tempBtn .sliderSwitch");
          var areaBtn = document.querySelector("#tempBtn .optionSlide");
          var scaleSwitch = document.querySelector("#scaleBtn .sliderSwitch");
          var scaleBtn = document.querySelector("#scaleBtn .optionSlide");
          function scaleChange() {
            if(scaleSwitch.classList.contains("on")) {
              scale = "imperial";
            } else {
              scale = "metric";
            }
            tempPast = [];
            lcdInput();
            updateSettings();
          }
  
          scaleChange();
          function tempSwitch() {
            if(areaSwitch.classList.contains("on")) {
              area = "local";
            } else {
              area = "room";
            }
            lcdInput();
            updateSettings();
          }
            tempSwitch();
  
          areaBtn.addEventListener("click", tempSwitch, false);
          scaleBtn.addEventListener("click", scaleChange, false);
  
  
          var cityBox = document.querySelector("#city");
          var countryBox = document.querySelector("#country");
          var submit = document.querySelector("#submit");
          function cityChange() {
            city = cityBox.value;
            country = countryBox.value;
            updateSettings();
          }
  
          submit.addEventListener("click", cityChange, false);

          
        }
  
        function temp() {
          axios.get('http://api.openweathermap.org/data/2.5/weather', {
                params: {
                  q: `${city},${country}`,
                  APPID: "62aade36c70bae588c2501d17cd9e8eb",
                  units: `${scale}`
                }
              })
              .then(function (response) {
                var data = response.data;
                var tempNum = Math.round(data.main.temp);
                var tempNum = tempNum.toString();
                if(tempNum.length === 2) {
                  tempNum = " " + tempNum;
                } else if(tempNum.length === 1) {
                  tempNum = "  " + tempNum;
                }
                if(scale === "metric") {
                  tempL = tempNum + "°C";
                  tempLPr = tempNum + ":box1:C";
                } else {
                  tempL = tempNum + "°F";
                  tempLPr = tempNum + ":box1:F";
                }
                icon = data.weather[0].icon;
                lcdTest();
              })
              .catch(function (error) {
                console.log(error);
              });
  
        }
              if(scale === "metric") {
                var value = this.celsius.toString();
                if(value.length === 2) {
                  value = " " + value;
                } else if(value.length === 1) {
                  value = "  " + value;
                } else {
                  value = "" + value;
                }
                tempR = parseInt(this.celsius);
                tempRPr = value + ":box1:C";
              }else{
                var value = Math.round(this.fahrenheit).toString();
                if(value.length === 2) {
                  value = " " + value;
                } else if(value.length === 1) {
                  value = "  " + value;
                } else {
                  value = " " + value;
                  value = value.slice(1);
                }
                tempR = parseInt(this.fahrenheit);
                tempRPr = value + ":box1:F";
              }
            tempPast.unshift(tempR);
            if(tempPast.length > 15) {
              tempPast.splice(15, 1);
            }
            var tempCalc = 0;
            for(var i = 0; i < tempPast.length; i++) {
              tempCalc += tempPast[i];
            }
            var tempAvg = tempCalc/tempPast.length;
            var tempCheck = Math.abs(tempAvg - tempPast[0]);
            if(tempCheck >= 25 && tempText) {
              var message = "Warning. There is a sudden change in the room temperature that you may wish to investigate.";
              var msg = "SUDDEN CHANGE IN TEMPERATURE";
              tempText = false;
              text(message, msg);
            }
  
  
  
            if(location.href.indexOf("index") > -1) {
          tempTxt = document.querySelector("#weather");
          if(icon) {
            tempTxt.innerHTML = `<h3 class="menuTitles">Weather ${tempL}</h3><img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather" id="wIcon"><h5 class="add">+ CHANGE CITY</h5>`;
          }
          }
          temp();
            setInterval(temp, 7200000);
  
        });
  
        setInterval(function(){ tempText = true; }, 7200000);
        
  
      if(location.href.indexOf("light") > -1) {
        var hueSlid = document.querySelector("#sliderHue");
        var satSlid = document.querySelector("#sliderSat");
        var britSlid = document.querySelector("#sliderBrit");
        hueSlid.value = `${hue}`;
        satSlid.value = `${sat}`;
        britSlid.value = `${brit}`;
        hue = hueSlid.value;
        sat = satSlid.value;
        brit = britSlid.value;
        var partySlid = document.querySelector("#partySwitch .sliderSwitch");
        var partyBtn = document.querySelector("#partySwitch .optionSlide");
        partyCheck = "off";
        var fps = 40;
        function partySwitch() {
          if(partySlid.classList.contains("on")) {
            partyCheck = "on";
            party = true;
            strip.clear();
            strip.off();
            var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
            var current_colors = [0,1,2,3,4];
            var current_pos = [0,1,2,3,4];
            var blinker = setInterval(function() {
            for (var i=0; i< current_pos.length; i++) {
                if (++current_pos[i] >= strip.length) {
                    current_pos[i] = 0;
                    if (++current_colors[i] >= colors.length) current_colors[i] = 0;
                }
                strip.pixel(current_pos[i]).color(colors[current_colors[i]]);
            }
            if(partyCheck == "on") {
              strip.show();
            }
            }, 1000/fps);
          } else {
            partyCheck = "off";
            party = false;
            strip.clear();
            strip.off();
            partyBtn.addEventListener("click", partySwitch, false);
            autoBtn.addEventListener("click", lightSwitch, false);
            hueSlid.addEventListener("input", function() {
              hue = hueSlid.value;
              colorChange(hue, sat, brit);
              updateSettings();
            }, false);
  
            satSlid.addEventListener("input", function() {
              sat = satSlid.value;
              colorChange(hue, sat, brit);
              updateSettings();
            }, false);
          }
        }
  
        var auto = document.querySelector("#autoSwitch .sliderSwitch");
        var autoBtn = document.querySelector("#autoSwitch .optionSlide");
        autoBtn.addEventListener("click", lightSwitch, false);
        function lightSwitch() {
          photoresistor.on("data", function() {
            var sensorInfo = this.value;
            if(sensorInfo < 100) {
              brit = 1;
            } else if(sensorInfo > 1005) {
              brit = 100;
            } else {
              var remap = createRemap(100, 1005, 1, 100);
              brit = remap(sensorInfo);
            }
            if(auto.classList.contains("on")) {
              autoCheck = true;
              colorChange(hue, sat, brit);
            } else {
              autoCheck = false;
              brit = britSlid.value;
              colorChange(hue, sat, brit);
              britSlid.addEventListener("input", function() {
                brit = britSlid.value;
                updateSettings();
                colorChange(hue, sat, brit);
              }, false);
            }
            updateSettings();
          });
        }
        lightSwitch();
        partySwitch();
      } else if(autoCheck) {
        photoresistor.on("data", function() {
          var sensorInfo = this.value;
          if(sensorInfo < 100) {
            brit = 1;
          } else if(sensorInfo > 1005) {
            brit = 100;
          } else {
            var remap = createRemap(100, 1005, 1, 100);
            brit = remap(sensorInfo);
          }
          colorChange(hue, sat, brit);
        });
      }
  
      function colorChange(hue, sat, brit) {
        var h = hue;
        var s = sat / 100;
        var v = brit / 100;
        var RGB = hsvToRgb(h, s, v);
        strip.color(`${RGB}`);
        strip.show();
      }
      if(location.href.indexOf("route") > -1) {
        var originBox = document.querySelector("#origin");
        var destBox = document.querySelector("#dest");
        var submit = document.querySelector("#submit");
        var hoursBox = document.querySelector("#hours");
        var minBox = document.querySelector("#minutes");
        var periodBox = document.querySelector("#timeOfDay");
        function routeChange() {
          origin = originBox.value;
          dest = destBox.value;
          if(periodBox.value == "PM") {
            depH = parseInt(hoursBox.value) + 12;
          } else {
            depH = parseInt(hoursBox.value);
          }
          depM = parseInt(minBox.value);
          updateSettings();
          traffic();
        }
        function addHours() {
          for (i = 1; i <= 12; i++) {
            hours.innerHTML += "<option value=\"" + i + "\">" + i + "</option>";
          }
        }
        addHours();
        function addMins() {
          for (i = 0; i <= 59; i++) {
            if( i < 10) {
              minutes.innerHTML += "<option value=\"" + i + "\">0" + i + "</option>";
            } else {
              minutes.innerHTML += "<option value=\"" + i + "\">" + i + "</option>";
            }
  
          }
        }
        addMins();
        submit.addEventListener("click", routeChange, false);
      }
      function traffic() {
        origin = origin.replace(/ /g, '+');
        dest = dest.replace(/ /g, '+');
        dateT = new Date();
        dateT.setHours(depH);
        dateT.setMinutes(depM);
        dSec = Math.round(dateT.getTime() / 1000);
        axios.get('https://maps.googleapis.com/maps/api/directions/json', {
          params: {
            origin: `${origin}`,
            destination: `${dest}`,
            key: "AIzaSyDfnZ4R9PBnpMehTrz1cNOspZe0wHJFlEw",
            departure_time: `${dSec}`
          }
        })
        .then(function (response) {
          var data = response.data.routes[0];
          dur = data.legs[0].duration_in_traffic.text.slice(0, -3).replace(/ /g, '');
          diff = Math.round(data.legs[0].duration_in_traffic.value / 60) - Math.round(data.legs[0].duration.value / 60);
          if(diff > 0) {
            diff = "+" + diff + "m";
          } else if(diff === 0) {
            diff = " " + diff + "m";
          } else {
            diff = diff + "m";
          }
          if(diff.length === 3) {
            diff = " " + diff;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
  
      if(location.href.indexOf("settings") > -1) {
        var phoneBox = document.querySelector("#phone");
        var submit = document.querySelector("#submit");
  
        function phoneChange() {
          phone = phoneBox.value;
          phone = phone.replace(/\s/g, '');
          phone = phone.replace(/-/g, '');
          phone = "+1" + phone;
          updateSettings();
          console.log(phone);
        }
        submit.addEventListener("click", phoneChange, false);

        //variables
        var buttonL = document.querySelector(".btnLanguages");
        var dropdown = document.querySelector(".dropdown");
        var list = dropdown.querySelectorAll("li a");


        //functions
        function toggle() {
          if (dropdown.style.display !== "block") {
            dropdown.style.display = "block";
          } else {
            dropdown.style.display = 'none';
          }
        };

        function closeAll(e) {
          var check;
          for(var i = 0; i < list.length; i++) {
            if(e.target === list[i]) {
              check = e.target;
            }
          }
          if(e.target.id !== "dropBtn" && check == undefined) {
            dropdown.style.display = 'none';
          }
        }

          //listeners
          buttonL.addEventListener("click",toggle,false);
          window.addEventListener("click", closeAll, false);
      }
  
      //Time
      var h;
      var m;
      var d;
      var period;
      var tempPr;
      function time() {
        var date = new Date();
        h = date.getHours();
        m = date.getMinutes();
        d = date.toDateString();
        if(h >= 12) {
          period = "PM";
        } else {
          period = "AM";
        }
        h = h % 12;
        h = h ? h : 12; // the hour '0' should be '12'
        if(m < 10) {
          m = "0" + m;
        }
        var currentTime = `${h}:${m} ${period}`;

  
        if(location.href.indexOf("index") > -1) {
          var dateBox = document.querySelector("#date");
          dateBox.innerHTML = d;
          var timeBox = document.querySelector("#time");
          timeBox.innerHTML = `${h}:${m}${period}`;
        }
        if(currentTime === alarm) {
          if(rptState === "daily") {
            setInterval(function(){
              (function buzzPlay() {
                piezo.frequency(five.Piezo.Notes.d5, 1000);
                setTimeout(buzzStop, 1000);
              })();
            
              function buzzStop() {
                piezo.off();
              }
            },2000);
          } else if(rptState === "once" && repeat === date.toDateString()) {
            setInterval(function(){
              (function buzzPlay() {
                piezo.frequency(five.Piezo.Notes.d5, 1000);
                setTimeout(buzzStop, 1000);
              })();
            
              function buzzStop() {
                piezo.off();
              }
            },2000);
          } else if(rptState === "weekday" && repeat.includes(date.getDay().toString())) {
            setInterval(function(){
              (function buzzPlay() {
                piezo.frequency(five.Piezo.Notes.d5, 1000);
                setTimeout(buzzStop, 1000);
              })();
            
              function buzzStop() {
                piezo.off();
              }
            },2000);
          }
        }
          

          console.log(alarm);
      }
  
  
      var lcdCheck = false;
      function lcdTest() {
        lcdCheck = true;
      }
      var prevPrint = null;
      var prevPrint2 = null;
      var prevDur = null;
      var lcd = new five.LCD({
              pins: [7, 8, 9, 10, 11, 12],
              rows: 2,
              cols: 16
            });
  
      traffic();
      var prevTempF = "";
  
      var gas = new five.Sensor("A4");
      var first = true;
  
      var gas = new five.Sensor("A4");
      var first = true;

    gas.on("data", function() {
      var sensor_volt;
      var RS;
      var R0;

      if(count < 100) {
        sensorValue += this.value;
        count++;
      } else if(count === 100) {
        sensorValue = sensorValue/100.0;
        sensor_volt = sensorValue/(1024*5.0);
        RS = (5.0-sensor_volt)/sensor_volt;
        R0 = RS/9.8;
        count++;
        calibR0 = R0;
      } else if(count > 100) {
        var value = this.value;
        var volt = value/(1024*5.0);
        var currentRS = (5.0-volt)/volt;
        var ratio = currentRS/calibR0;
        var ppm;
        //smoke
        if(ratio < 3.5 && ratio > 2 && gasText) {
          ppm = (1600-(400 * ratio));
          //console.log("first " + ppm);
          var message = "ALERT: Trace levels of smoke have been detected.";
          var msg = "  ALERT: SMOKE      Low Level    ";
          gasText = false;
          text(message, msg);
        } else if(ratio <= 2 && ratio > 1.5 && gasText) {
          ppm = (5600-(2400 * ratio));
          //console.log("second " + ppm);
          var message = "ALERT: A dangerous amount of smoke has been detected.";
          var msg = "  ALERT: SMOKE    Medium Level  ";
          gasText = false;
          text(message, msg);
        } else if(ratio <= 1.5 && gasText) {
          ppm = 2000-((80000 * ratio)/69);
          //console.log("third " + ppm);
          var message = "ALERT: FIRE! CALL 911 IMMEDIATELY!";
          var msg = "  ALERT: SMOKE      CALL 911    ";
          gasText = false;
          text(message, msg);
        }
      }
    });

    setInterval(function(){ gasText = true; }, 300000);
      //setInterval(traffic, 90000);
      function lcdInput() {
        if(lcdCheck && safe) {
          time();
          if(area === "room") {
            tempPr = tempRPr;
          } else {
            tempPr = tempLPr;
          }
          lcd.useChar("box1");
          if(tempPr.trim().length < 10) {
            var string = `${h}:${m}${period}${tempPr}`;
            var string2 = `${d.slice(0, -5)}  ${diff}`;
            if(prevPrint !== string || prevPrint2 !== string2 || prevDur !== dur) {
              lcd.clear();
              lcd.cursor(0, 0).print(string);
              var position = 16 - dur.length;
              lcd.cursor(0,position).print(`${dur}`)
              lcd.cursor(1, 0).print(string2);
            }
            if(string !== null && string.length > 0) {
              prevPrint = string;
            }
            if(string2 !== null && string2.length > 0) {
              prevPrint2 = string2;
            }
            if(dur !== null && dur.length > 0) {
              prevDur = dur;
            }
          } else {
            var string = `${h}:${m}${period}`;
            var string2 = `${d.slice(0, -5)}  ${diff}`;
            if(prevPrint !== string || prevPrint2 !== string2 || prevDur !== dur || prevTempF !== tempPr) {
              lcd.clear();
              lcd.cursor(0, 0).print(string);
              lcd.cursor(0,string.length).print(tempPr);
              var position = 16 - dur.length;
              lcd.cursor(0,position).print(dur);
              lcd.cursor(1, 0).print(string2);
            }
            if(string !== null && string.length > 0) {
              prevPrint = string;
            }
            if(string2 !== null && string2.length > 0) {
              prevPrint2 = string2;
            }
            if(dur !== null && dur.length > 0) {
              prevDur = dur;
            }
            if(tempPr !== null && tempPr.length > 0) {
              prevTempF = tempPr;
            }
          }
  
  
        }
      }
  
      function text(notify, msg) {
        const accountSid = 'ACb3e5f973bb17db467c10c71fc2f692de';
        const authToken = 'c91a889a00a504b6357eba4a1e735a3f';
        const client = require('twilio')(accountSid, authToken);
        var number = phone;
        console.log("triggered");
        var count = 0;
        lcd.clear();
        var mid = msg.length / 2;
        lcd.cursor(0,0).print(msg.slice(0, 16));
        lcd.cursor(1,0).print(msg.slice(16));
        safe = false;
        setInterval(function() {
  
  
          if(count < 15) {
            strip.color(`red`);
            strip.show();
            piezo.frequency(five.Piezo.Notes.d5, 1000);
          }
          setTimeout(function() {
            strip.color(`black`);
            strip.show();
            piezo.off();
          }, 500);
          if(count >= 15) {
            strip.off();
            piezo.off();
          }
          count++;
        }, 1000);
        setTimeout(function() {
          safe=true;
        }, 15000);
  
        client.messages
              .create({
                body: notify,
                 from: '+16475595111',
                 to: number
               })
              .then(message => console.log(message.sid))
              .done();
  
      }
  
  
        setInterval(lcdInput, 1000);

        function updateSettings() {
    var request;

  //see if request has been made.
  
    if(window.XMLHttpRequest){
      request = new XMLHttpRequest();
      }else if(window.ActiveXObject) {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      }
      else if(request===null){
        alert("Your browser does not support Ajax");
      } 
    


    //create variables to send to php file. 
    var url ="http://localhost:8888/homesystem-katie/app/settingsDBupdate.php"; //this is the php file that will send the sensor data to the db    from the html/js file it’s feeding from.
      var autoSQL;
    if(autoCheck = false) {
      autoSQL = 0;
    } else {
      autoSQL = 1;
    }
    var formdata = 
    "hue=" + hue + 
    "&sat=" + sat + 
    "&brit=" + brit + 
    "&auto=" + autoSQL + 
    "&scale=" + scale + 
    "&area=" + area + 
    "&city=" + city + 
    "&country=" + country + 
    "&origin=" + origin + 
    "&dest=" + dest + 
    "&depH=" + depH +
    "&depM=" + depM +
    "&phone=" + phone
    //html div name that is assigned the sensor data id from the js file.
    //var tempValue = document.querySelector("#tempValue");
        
    request.onreadystatechange = function(){
      if(request.readyState === 4 && request.status===200){
      }     

    }
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(formdata); 
}



function hsvToRgb(h, s, v) {

  var c = v * s;
  var H = h / 60;

  var x = c * (1 - Math.abs(H % 2 - 1));
  var r, g, b;

  if(h === undefined) {
    r = g = b = 0;
  } else if(H >= 0 && H <= 1) {
    r = c; g = x; b = 0;
  } else if(H > 1 && H <= 2) {
    r = x; g = c; b = 0;
  } else if(2 < H && H <= 3) {
    r = 0; g = c; b = x;
  } else if(H > 3 && H <= 4) {
    r = 0; g = x; b = c;
  } else if (4 < H && H <= 5) {
    r = x; g = 0; b = c;
  } else if (5 < H && H <= 6) {
    r = c; g = 0; b = x;
  }

  var m = v - c;
  var Red = Math.round((r + m) * 255);
  var Green = Math.round((g + m) * 255);
  var Blue = Math.round((b + m) * 255);
  return `rgb(${Red}, ${Green}, ${Blue})`;
}
  
    });
});

}

  
