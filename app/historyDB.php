<?php
//get file

//history.php file
$array = array();
$connection = mysqli_connect('localhost', 'root', 'root', 'history');
$sql="SELECT * FROM temp ORDER BY temp_date DESC LIMIT 120";
$result = mysqli_query($connection, $sql);
$numrows = mysqli_num_rows($result);

if($numrows > 0) {
	while($row = mysqli_fetch_array($result)) {
		$json = array(
			'celsius' => $row['temp_celsius'],
			'fahrenheit' => $row['temp_fahrenheit'],
			'date' => $row['temp_date']
		);
		array_push($array,$json);
	}
	echo json_encode($array, true);
}else{
	print "error";
}



?>