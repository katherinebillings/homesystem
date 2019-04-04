//Alarm Clock for Alarm Page.


// variables
var alarm, time, currentHour, currentMin, m, h, snooze, snoozeActive = false,
    activeAlarm = false,
    //placeholder audio, will change to our buzzer sensor to set off the alarm.
    sound = new Audio("https://freesound.org/data/previews/316/316847_4939433-lq.mp3");

var repeat, rptState;

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
      sound.play();

        //snooze button
      snoozeBtn.className = "";
    } else if(rptState === "once" && repeat === currentTime.toDateString()) {
      console.log(repeat);
      sound.play();

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
      console.log(mCheck);
      if(hCheck < date.getHours()) {
        date.setDate(date.getDate() + 1);
      } else if(hCheck == date.getHours() && mCheck < date.getMinutes()) {
        date.setDate(date.getDate() + 1);
      }
      repeat = date.toDateString();
    }
    //alarm = hours.value + ":" + minutes.value + ":" + seconds.value + " " + timeOfDay.value;
    alarm = hours.value + ":" + minutes.value + " " + timeOfDay.value;
    this.textContent = "Clear Alarm";
    activeAlarm = true;
    snoozeActive = false;
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
      console.log(currentMin);
      
      snzM = parseInt(currentMin) - 60;
      snzH = parseInt(currentHour) + 1;
    } else {
      snzH = currentHour;
      //parseInt is a value used for the snooze button, without it snooze wont work as it's a function that parses a string and returns an integer.
      if (parseInt(currentMin) <= 4) {
        currentMin = (parseInt(currentMin) + 1).toString();
        snzM = "0" + currentMin;
      } else {
        snzM = (parseInt(currentMin) + 1).toString();
      }
    }
    var snzTD;
    if(parseInt(snzH) < 12) {
      snzTD = "AM";
    }else{
      snzTD = "PM";
    }
    sound.pause();
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

daily.onclick = function() {
  rptState = "daily";
};
weekday.onclick = function() {
  rptState = "weekday";
};
once.onclick = function() {
  rptState = "once";
};