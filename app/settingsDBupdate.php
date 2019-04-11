<?php
//get file

//history.php file 
$connection = mysqli_connect('localhost', 'root', 'root', 'history');
$hue = mysqli_real_escape_string($connection, $_POST['hue']);
$sat=mysqli_real_escape_string($connection, $_POST['sat']);
$brit=mysqli_real_escape_string($connection, $_POST['brit']);
$auto=mysqli_real_escape_string($connection, $_POST['auto']);
$scale=mysqli_real_escape_string($connection, $_POST['scale']);
$area=mysqli_real_escape_string($connection, $_POST['area']);
$city=mysqli_real_escape_string($connection, $_POST['city']);
$country=mysqli_real_escape_string($connection, $_POST['country']);
$origin=mysqli_real_escape_string($connection, $_POST['origin']);
$dest=mysqli_real_escape_string($connection, $_POST['dest']);
$depH=mysqli_real_escape_string($connection, $_POST['depH']);
$depM=mysqli_real_escape_string($connection, $_POST['depM']);
$phone=mysqli_real_escape_string($connection, $_POST['phone']);
$alarm=mysqli_real_escape_string($connection, $_POST['alarm']);
$repeat=mysqli_real_escape_string($connection, $_POST['repeat']);
$sql="UPDATE settings SET hue = '".$hue."', sat = '".$sat."', brit = '".$brit."', auto = ".$auto.", scale = '".$scale."', area = '".$area."', city = '".$city."', country = '".$country."', origin = '".$origin."', destination = '".$dest."', depHour = '".$depH."', depMin = '".$depM."', phone = '".$phone."' WHERE id = 1";
$result = mysqli_query($connection, $sql);
?>