<?  
	$ch = curl_init(); 	
	curl_setopt($ch, CURLOPT_URL, 'http://2.radicalvid.appspot.com/services/get/' . $_GET[ "index" ] );
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	$data = curl_exec($ch); 
	curl_close($ch); 

	echo $data;
?>