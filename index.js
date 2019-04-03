var Readable = require('stream').Readable;
var util = require('util');
var five = require("johnny-five");
var pixel = require("node-pixel");
var songs = require('j5-songs');
var axios = require('axios');

util.inherits(MyStream, Readable);
  
function MyStream(opt) {  
  Readable.call(this, opt);
}
  
MyStream.prototype._read = function() {};  
  
// hook in our stream
process.__defineGetter__('stdin', function() {  
  if (process.__stdin) return process.__stdin
    process.__stdin = new MyStream();
    return process.__stdin;
})

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;
var hue = document.querySelector("#hue");
var sat = document.querySelector("#saturation");
var brit = document.querySelector("#brightness");

var fps = 40; // how many frames per second do you want to try?

board.on("ready", function() {

  strip = new pixel.Strip({
      data: 6,
      length: 30,
      color_order: pixel.COLOR_ORDER.GRB,
      board: this,
      controller: "FIRMATA",
  });

  strip.on("ready", function() {

    var party = false;
    

      console.log("Strip ready, let's go");

      function colorChange() {
    
        hueNum.innerHTML = hue.value + "°";
        satNum.innerHTML = sat.value;
        britNum.innerHTML = brit.value;
        var h = hue.value;
        var s = sat.value / 100;
        var v = brit.value / 100;
        var RGB = hsvToRgb(h, s, v);
        box.style.backgroundColor = RGB;
        strip.color(RGB);
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

      //party mode
      if(party) {
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
            strip.show();
        }, 1000/fps);
      } else {
        hue.addEventListener("input", colorChange, false);
        sat.addEventListener("input", colorChange, false);
        brit.addEventListener("input", colorChange, false);
      }
      
  });

    function createRemap(inMin, inMax, outMin, outMax) { 
      return function remaper(x) { 
        return Math.round((x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin); 
      }; 
    }
    

  //temperature

  var temperature = new five.Thermometer({
      controller: "LM35",
      pin: "A0",
      freq: 500
    });
    
  //TEMP CONDITIONALS FOR LABELS
  temperature.on("change", function() {
    var value = this.celsius;
    //console.log(`temp ${value}`);
  });

  // light sensor
  var photoresistor = new five.Sensor({
      pin: "A2",
      freq: 500
    });

  board.repl.inject({
    pot: photoresistor
  });
  
  photoresistor.on("change", function() {
    var sensorInfo = this.value;
    //console.log(`light ${sensorInfo}`);
  });

  //gas sensor
  var gas = new five.Sensor("A4");

  var piezo = new five.Piezo(3);

  // Injects the piezo into the repl
  board.repl.inject({
    piezo: piezo
  });

  var song = songs.load('tetris-theme');
  var first = true;
  
  var check;
  gas.on("change", function() {
    //var remap = createRemap(200, 1023, 100, 0);
    if (this.value > 60) {
      if(check) {
        buzzerOn();
        check = false;
      }
    } else {
      piezo.off();
      check = true;
    }
    //console.log(`gas ${this.value}`);
  });

  function buzzerOn() {
    setInterval(function(){
      (function buzzPlay() {
        piezo.frequency(five.Piezo.Notes.d5, 1000);
        console.log("on");
        setTimeout(buzzStop, 1000);
      })();
    
      function buzzStop() {
        piezo.off();
        console.log("off");
      }
    },2000);
  }

  function text( {
    const accountSid = 'ACb3e5f973bb17db467c10c71fc2f692de'; 
    const authToken = 'c91a889a00a504b6357eba4a1e735a3f'; 
    const client = require('twilio')(accountSid, authToken); 
    var number = "+14169970061";
    
   
  client.messages 
        .create({  
          body: 'it works :D',
           from: '+16475595111',       
           to: number 
         }) 
        .then(message => console.log(message.sid)) 
        .done();
  })
  

  

  //Time
  var date = new Date();
  var h = date.getHours();
  var m = date.getMinutes();
  var d = date.toDateString();
  var period;

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

  //Weather
  var temp;
  var city = "London";
  var country = "ca";
  var unit = "metric";
  axios.get('http://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: `${city},${country}`,
      APPID: "62aade36c70bae588c2501d17cd9e8eb",
      units: `${unit}`
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
    if(unit === "metric") {
      console.log(tempNum + ":box1:C");
      temp = tempNum + ":box1:C";
    } else {
      console.log(tempNum + ":box1:F");
      temp = tempNum + ":box1:F";
    }
    lcdTest();
    return temp;
    
  })
  .catch(function (error) {
    console.log(error);
  });   

  // Traffic
  var origin = "1001 Fanshawe College Blvd, London, ON";
  origin = origin.replace(/ /g, '+');
  var dest = "137 Dundas Street, London, ON";
  dest = dest.replace(/ /g, '+');
  var dateT = new Date();
  dateT.setHours(14);
  dSec = Math.round(dateT.getTime() / 1000);
  var diff;
  var dur;
  axios.get('https://maps.googleapis.com/maps/api/directions/json', {
    params: {
      origin: `${origin}`,
      destination: `${dest}`,
      key: "AIzaSyDEufF8ASBS_py6huyiEaxFKBetxih2iNI",
      departure_time: `${dSec}`
    }
  })
  .then(function (response) {
    var data = response.data.routes[0];
    dur = data.legs[0].duration_in_traffic.text.slice(0, -3).replace(/ /g, '');
    console.log(dur);
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
    lcdInput();
    
  })
  .catch(function (error) {
    console.log(error);
  });

  console.log(temp);
  var lcdCheck = false;
  function lcdTest() {
    lcdCheck = true;
  }

  function lcdInput() {
    if(lcdCheck) {
      var lcd = new five.LCD({
        pins: [7, 8, 9, 10, 11, 12],
        rows: 2,
        cols: 16
      });
      lcd.useChar("box1");
  
      lcd.clear();
      console.log(`${h}:${m}${period}${temp} ${dur}`)
      console.log(`${d.slice(0, -5)}  ${diff}`);
      position = 16 - dur.length;
      lcd.cursor(0, 0).print(`${h}:${m}${period}${temp}`);
      lcd.cursor(0,position).print(`${dur}`)
      lcd.cursor(1, 0).print(`${d.slice(0, -5)}  ${diff}`);
      
      this.repl.inject({
        lcd: lcd
      });
    }
  }
    

  
  
});