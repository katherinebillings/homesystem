var Readable = require('stream').Readable;
var util = require('util');
var five = require("johnny-five");
var pixel = require("node-pixel");

var opts = {};
opts.port = process.argv[2] || "";

  var board = new five.Board(opts);
  var count = 0;
  var sensorValue = 0;
  var calibR0;
  var hue = 180;
  var sat = 100;
  var brit = 1;

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

    board.repl.inject({
      pot: photoresistor
    });
    
    

    strip = new pixel.Strip({
      data: 6,
      length: 30,
      color_order: pixel.COLOR_ORDER.GRB,
      board: this,
      controller: "FIRMATA",
    });

    strip.on("ready", function() {
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
        console.log(sensorInfo + " " + brit);
        colorChange(hue, sat, brit);
      });

      console.log("Strip ready, let's go");

      function colorChange(hue, sat, brit) {
    
        var h = hue;
        var s = sat / 100;
        var v = brit / 100;
        var RGB = hsvToRgb(h, s, v);
        /*strip.pixel(24).color(`${RGB}`);
        strip.pixel(25).color(`${RGB}`);
        strip.pixel(26).color(`${RGB}`);
        strip.pixel(27).color(`${RGB}`);
        strip.pixel(28).color(`${RGB}`);
        strip.pixel(29).color(`${RGB}`);*/
        strip.color(`${RGB}`);
        strip.show();
      }
  
      colorChange(hue, sat, brit);
    
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

    

    var piezo = new five.Piezo(3);

    // Injects the piezo into the repl
    board.repl.inject({
      piezo: piezo
    });

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
        //console.log("ratio = " + ratio);
        var ppm;
        //C0
        if(ratio < 5.2 && ratio > 3.5) {
          ppm = (34600-(6000 * ratio))/17;
          console.log("first " + ppm);
        } else if(ratio <= 3.5 && ratio > 2.6) {
          ppm = (16400-(4000 * ratio))/3;
          console.log("second " + ppm);
        } else if(ratio <= 2.6 ) {
          ppm = (230000-(80000 * ratio))/11;
          console.log("third " + ppm);
        }
      }
    });
  
    piezo.off();
  });

  /*var hue = document.querySelector("#hue");
  var sat = document.querySelector("#saturation");
  var brit = document.querySelector("#brightness");
  var hueNum = document.querySelector("#hueLab");
  var satNum = document.querySelector("#satLab");
  var britNum = document.querySelector("#britLab");
  var box = document.querySelector("#rgbBox");
  var strip = document.querySelectorAll(".stripBox");
  var party = false;

  function colorChange() {
    
    hueNum.innerHTML = hue.value + "°";
    satNum.innerHTML = sat.value;
    britNum.innerHTML = brit.value;
    var h = hue.value;
    var s = sat.value / 100;
    var v = brit.value / 100;
    var RGB = hsvToRgb(h, s, v);
    box.style.backgroundColor = RGB;
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
  

  var slider = document.querySelector(".slider");

var options = document.querySelectorAll(".option");
var optionBox = document.querySelector(".options");
var pos;

function clickHandler(e) {
  if (pos === "right") {
    slider.style.left = 0;
    options[1].style.color = "#626567";
    options[0].style.color = "#fff";
    pos = "left";
    clearInterval();
    for (var i=0; i< strip.length; i++) {
      strip[i].style.backgroundColor = "white";
    }
    hue.addEventListener("input", colorChange, false);
    sat.addEventListener("input", colorChange, false);
    brit.addEventListener("input", colorChange, false);
  }else{
    slider.style.left = 'calc(100% - 45px)';
    
    options[0].style.color = "#626567";
    options[1].style.color = "#fff";
    pos = "right";
    rgbBox.style.backgroundColor = "white";
    console.log("test");
    var fps = 10; // how many frames per second do you want to try?
    var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
    var current_colors = [0,1,2,3,4];
    var current_pos = [0,1,2,3,4];
    var blinker = setInterval(function() {
    

        for (var i=0; i< current_pos.length; i++) {
            if (++current_pos[i] >= strip.length) {
                current_pos[i] = 0;
                if (++current_colors[i] >= colors.length) current_colors[i] = 0;
            }
            strip[current_pos[i]].style.backgroundColor = colors[current_colors[i]];
        }
        strip.show();
    }, 1000/fps);
  }

  console.log(party);
};


  optionBox.addEventListener("click", clickHandler, false);*/

  
