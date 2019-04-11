<?php
//get file
$connection = mysqli_connect('localhost', 'root', 'root', 'history');
$sql="SELECT * FROM settings";
$result = mysqli_query($connection, $sql);
$row = mysqli_fetch_array($result);

$json = array(
	'hue' => $row['hue'],
	'sat' => $row['sat'],
	'brit' => $row['brit'],
	'auto' => $row['auto'],
	'scale' => $row['scale'],
	'area' => $row['area'],
	'city' => $row['city'],
	'country' => $row['country'],
	'origin' => $row['origin'],
	'dest' => $row['destination'],
	'depH' => $row['depHour'],
	'depM' => $row['depMin'],
	'phone' => $row['phone'],
	'alarm' => $row['alarm'],
	'repeat' => $row['repeatAlarm'],
	'repeatState' => $row['repeatState'],
);
echo json_encode($json, true);

?>