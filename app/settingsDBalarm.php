<?php
//get file

//history.php file 
$connection = mysqli_connect('localhost', 'root', 'root', 'history');
$alarm=mysqli_real_escape_string($connection, $_POST['alarm']);
$repeat=mysqli_real_escape_string($connection, $_POST['repeat']);
$repeatState=mysqli_real_escape_string($connection, $_POST['repeatState']);
$sql="UPDATE settings SET alarm = '".$alarm."', repeatAlarm = '".$repeat."', repeatState = '".$repeatState."'  WHERE id = 1";
$result = mysqli_query($connection, $sql);



?>