var five = require('johnny-five');
var pixel = require("node-pixel");
var Readable = require("stream").Readable;  
var util = require("util");  
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
  var count = 0;
  var sensorValue = 0;
  var calibR0;
  var hueSlid = document.querySelector("#sliderHue");
  var hue = hueSlid.value;
  var satSlid = document.querySelector("#sliderSat");
  var sat = satSlid.value;
  var britSlid = document.querySelector("#sliderBrit");
  var brit = britSlid.value;
  var auto = document.querySelector("#autoSwitch .sliderSwitch");
  var autoBtn = document.querySelector("#autoSwitch .optionSlide");
  var party = document.querySelector("#partySwitch .sliderSwitch");
  var partyBtn = document.querySelector("#partySwitch .optionSlide");
  var partySwitch = "off";
  var fps = 40;

  function createRemap(inMin, inMax, outMin, outMax) { 
    return function remaper(x) { 
      return Math.round((x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin); 
    }; 
  }

  board.on("ready", function() {

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
      console.log("Strip ready, let's go");
      partyBtn.addEventListener("click", partySwitch, false);

      function partySwitch() {
        
        if(party.classList.contains("on")) {
          partySwitch = "on";
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
          if(partySwitch == "on") {
            strip.show();
          }
          }, 1000/fps);
        } else {
          partySwitch = "off";
          strip.clear();
          strip.off();
          autoBtn.addEventListener("click", lightSwitch, false);
      hueSlid.addEventListener("input", function() {
        hue = hueSlid.value;
        colorChange(hue, sat, brit);
      }, false);
      
      satSlid.addEventListener("input", function() {
        sat = satSlid.value;
        colorChange(hue, sat, brit);
      }, false);
    }

  }  
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
            //console.log(brit);
            if(partySwitch == "off") {
              if(auto.classList.contains("on")) {
              colorChange(hue, sat, brit);
            } else {
              brit = britSlid.value;
              colorChange(hue, sat, brit);
              britSlid.addEventListener("input", function() {
                brit = britSlid.value;
                colorChange(hue, sat, brit);

              }, false);
            }
            }
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
  
      lightSwitch();
    
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
     partySwitch();
  });

  });