//Alarm Clock for Alarm Page.


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
    var url ="settingsDB.php"; //this is the php file that will send the sensor data to the db    from the html/js file it’s feeding from.

    //html div name that is assigned the sensor data id from the js file.
    //var tempValue = document.querySelector("#tempValue");
        
    request.onreadystatechange = function(){
      if(request.readyState === 4 && request.status===200){

        returnData = JSON.parse(request.responseText);        
        runAlarm(returnData);

      }     

    }
    request.open("GET", url, true);
    request.send(null);
}

createRequest();

//function runAlarm(data) {

// variables
var alarm, time, currentHour, currentMin, m, h, snooze, snoozeActive = false,
    activeAlarm = false,
    //placeholder audio, will change to our buzzer sensor to set off the alarm.
    sound = new Audio("https://freesound.org/data/previews/316/316847_4939433-lq.mp3");

var repeat, rptState, repeatDays = [];

var weekdaysBox = document.querySelector("#weekdays");
var weekdays = document.querySelectorAll("#weekdays input");

  // loop the alarm.
  sound.loop = true;


  // define a function to display the current time
  function displayTime() {
    var currentTime = new Date();

  //state the current time by taking it from the local machine.

  h = currentTime.getHours();
  var timeDay;
  if(h < 12) {
    timeDay = "AM";
  }else{
    timeDay = "PM";
  }
  if(h === 0) {
    h = 12;
  } else if(h > 12) {
    h = h - 12;
  }
  m = currentTime.getMinutes();
  if(m <= 9) {
    m = "0" + m;
  }
  time = h+":"+m+" "+timeDay;
  clock.textContent = time;
  //give sound to alarm is time is equal to the alarm set.
  if(time === snooze) {
    sound.play();
  } else if(activeAlarm === true && time === alarm && snoozeActive === false) {
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

        //snooze button
      snoozeBtn.className = "";
    } else if(rptState === "once" && repeat === currentTime.toDateString()) {
      setInterval(function(){
        (function buzzPlay() {
          piezo.frequency(five.Piezo.Notes.d5, 1000);
          setTimeout(buzzStop, 1000);
        })();
      
        function buzzStop() {
          piezo.off();
        }
      },2000);

        //snooze button
      snoozeBtn.className = "";
    } else if(rptState === "weekday" && repeatDays.includes(currentTime.getDay())) {
      setInterval(function(){
        (function buzzPlay() {
          piezo.frequency(five.Piezo.Notes.d5, 1000);
          setTimeout(buzzStop, 1000);
        })();
      
        function buzzStop() {
          piezo.off();
        }
      },2000);
      //snooze button
      snoozeBtn.className = "";
    }
  }
  setTimeout(displayTime, 1000);
  }

  displayTime();



//set values for time.
function addValues(id) {
  var select = id;
  var min = 59;

  for (i = 0; i <= min; i++) {

    //values select for desired time/option.
    select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i < 10 ? "0" + i : i);
  }
}


//add hours for values of the clock.
function addHours(id) {
  var select = id;
  var hour = 12;

  for (i = 1; i <= hour; i++) {
    select.options[select.options.length] = new Option(i < 10 ? "0" + i : i, i);
  }
}

addValues(minutes);
//addValues(seconds);
addHours(hours);


//set and clear the alarm clock.
setTheAlarm.onclick = function() {
  // set the alarm
  if(activeAlarm === false || snoozeActive === true) {


    timeOfDay.disabled = true;

    hours.disabled = true;
    minutes.disabled = true;
    //seconds.disabled = true;
    if(rptState === "daily") {
      repeat = "";
    } else if(rptState === "once") {
      var mCheck;
      var hCheck;
      var date = new Date();
      if(timeOfDay.value == "PM" && hours.value != 12) {
        hCheck = parseInt(hours.value) + 12;
      } else if(hours.value == 12 && timeOfDay.value == "AM") {
        hCheck = 0;
      } else {
        hCheck = hours.value;
      }
      if(minutes.value.substring(0,1) === "0") {
        mCheck = minutes.value.substring(1);
      } else {
        mCheck = minutes.value;
      }
      if(hCheck < date.getHours()) {
        date.setDate(date.getDate() + 1);
      } else if(hCheck == date.getHours() && mCheck < date.getMinutes()) {
        date.setDate(date.getDate() + 1);
      }
      repeat = date.toDateString();
    } else {
      var mCheck;
      var hCheck;
      var date = new Date();

      for( var i = 0; i < weekdays.length; i++) {
        if(weekdays[i].checked) {
          repeatDays.push(i);
        }
      }
    }
    //alarm = hours.value + ":" + minutes.value + ":" + seconds.value + " " + timeOfDay.value;
    alarm = hours.value + ":" + minutes.value + " " + timeOfDay.value;
    this.textContent = "Clear Alarm";
    activeAlarm = true;
    snoozeActive = false;
    updateSettings();
    snooze = "";
  } else {
    // clear alarm clock.
    hours.disabled = false;
    minutes.disabled = false;
    //seconds.disabled = false;
    timeOfDay.disabled = false;

    sound.pause();
    this.textContent = "Set Alarm";

    //hidden snooze button
    snoozeBtn.className = "hidden";
    activeAlarm = false;
  }
};

// snoozeBtn for 5 minutes
snoozeBtn.onclick = function() {
  if (activeAlarm === true) {
    // grab the current hour and minute

    if(time.length === 8) {
      currentHour = time.slice(0, 2);
      currentMin = time.slice(3, 5);
    } else {
      currentHour = time.slice(0, 1);
      currentMin = time.slice(2,4);
    }
    var snzM, snzH;

    if (parseInt(currentMin) >= 55) {

      snzM = parseInt(currentMin) - 60;
      snzH = parseInt(currentHour) + 1;
    } else {
      snzH = currentHour;
      //parseInt is a value used for the snooze button, without it snooze wont work as it's a function that parses a string and returns an integer.
      if (parseInt(currentMin) <= 4) {
        currentMin = (parseInt(currentMin) + 5).toString();
        snzM = "0" + currentMin;
      } else {
        snzM = (parseInt(currentMin) + 5).toString();
      }
    }
    var snzTD;
    if(parseInt(snzH) < 12) {
      snzTD = "AM";
    }else{
      snzTD = "PM";
    }
    piezo.off();
    clearInterval();
    snooze = snzH+":"+snzM+" "+snzTD;
    // hidden snoozeBtn button
    //snoozeBtn.className = "hidden";

    // currentTime reset alarm
    //setTheAlarm.click();
    snoozeActive = true;
    activeAlarm = false;
  } else {
    snoozeActive = false;
    snooze = "";
  }



//hidden snoozeBtn button
snoozeBtn.className = "hidden";

};

var prevAlarm = daily;

daily.onclick = function() {
  rptState = "daily";
  daily.classList.add("active");
  prevAlarm.classList.remove("active");
  prevAlarm = daily;
  weekdaysBox.style.display = "none";
};
weekday.onclick = function() {
  rptState = "weekday";
  weekday.classList.add("active");
  prevAlarm.classList.remove("active");
  prevAlarm = weekday;
  weekdaysBox.style.display = "block";
};
once.onclick = function() {
  rptState = "once";
  once.classList.add("active");
  prevAlarm.classList.remove("active");
  prevAlarm = once;
  weekdaysBox.style.display = "none";
};

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
    var url ="settingsDBalarm.php"; //this is the php file that will send the sensor data to the db    from the html/js file it’s feeding from.
      var repeatSQL;
    if(rptState === "daily") {
      repeatSQL = "";
    } else if( rptState === "once") {
      repeatSQL = repeat;
    } else {
      repeatSQL = repeatDays[0];
      for( var x = 1; x < repeatDays.length; x++) {
        repeatSQL += ", " + repeatDays[x];
      }
    }
    var formdata = 
    "alarm=" + alarm +
    "&repeat=" + repeatSQL +
    "&repeatState=" + rptState;
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

}
