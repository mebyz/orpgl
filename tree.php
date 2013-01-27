<?php 
if (isset($_GET["leaves"])) {
	if ($_GET["leaves"]==1) {
		echo file_get_contents("http://localhost:8081?leaves=1");
	}
	else
		echo file_get_contents("http://localhost:8081?leaves=0");

}
else
		echo file_get_contents("http://localhost:8081?leaves=0");
