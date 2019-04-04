//Ajax call to PHP and get data to return in charts.js format. 



//global vars

var dataRequest;
var time = 1000*60*60*6;
var time2 = 1000 * 60;

setInterval(test, time);
setInterval(createRequest, time);


function test() {
  console.log("test");
}



//create XHMLHttpRequest object

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
    var tempC = 15;
    var tempF = 55;

    var formdata = "tempC="+tempC+"&tempF="+tempF;

    //create variables to send to php file. 
    var url ="historyDBsend.php"; //this is the php file that will send the sensor data to the db    from the html/js file it’s feeding from.
    console.log(formdata);
    //html div name that is assigned the sensor data id from the js file.
    //var tempValue = document.querySelector("#tempValue");
        
    request.onreadystatechange = function(){
      if(request.readyState === 4 && request.status===200){

        var returnData = request.responseText;
        console.log(returnData);

      }     

    }
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(formdata); 



    //send data to php and wait for response to update status div.
    //document.querySelector("#tempValue").innerHTML = "Displaying History…";









    //html div name that is assigned the sensor data id from the js file.
    //var tempValue = document.querySelector("#tempValue");
    
    
    

    

    function saveTempData(){
      console.log("function has been fired"); //check to see if function is working.

      console.log(e.currentTarget.value); //will pull data where sensors is feeding back.

      
  
    }










}

createRequest();











  //temperature charts.js

  /*var ctx = document.querySelector("#tempChart");
  var tempChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
    labels: [],
    datasets: [
    {
      label: 'Temperature',
      data: [5,2],
      backgroundColor: [
        '#37DFF2',
        '#ccc'
        
      ],
      borderWidth: 0
    }]
    },
    options: {
    cutoutPercentage: 89,//thickness of the circle.
    responsive: false,
    onClick: function($event, arr) {
      console.log($event, arr);
      arr[0]._model.borderWidth = 4;
      arr[0]._view.borderWidth = 4;
      console.log($event, arr);
      tempChart.update();
      tempChart.draw();

    }
  }
});
*/





/*
//chart
var ctx = document.querySelector("#chart");
var data = {
  datasets:[{
    data: [<?php echo $temps ?>],
    background: 'transparent',
    borderColor: "#333",
    borderWidth: 5,
    label: 'Temperature'
  },{
    data: [<?php echo $months; ?>],
    background: 'transparent',
    borderColor: '#1470A8',
    borderWidth: 5,
    label: 'Months'
  }],
  labels: [
    <?php echo $dates ?>
  ]
};

var temperatureHistory = new chart(ctx, {
  //type of chart
  type: 'line',
  //data
  data: data,
  //config options
  options:{
    legend: {},
    tooltips: {

    },
    scales: {

    }
  }
});

*/







//line chart to display sensor data to be sent to db with ajax call.


