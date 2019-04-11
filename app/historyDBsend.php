<?php
//get file

//history.php file 
$connection = mysqli_connect('localhost', 'root', 'root', 'history');
$tempC=mysqli_real_escape_string($connection, $_POST['tempC']);
$tempF=mysqli_real_escape_string($connection, $_POST['tempF']);
$sql="INSERT INTO temp(temp_id,temp_celsius,temp_fahrenheit,temp_date) VALUES(NULL, '".$tempC."', '".$tempF."',CURRENT_TIMESTAMP)";
$result = mysqli_query($connection, $sql);
print "successful";



?>