<?  
	$ch = curl_init(); 	
	curl_setopt($ch, CURLOPT_URL, 'http://2.radicalvid.appspot.com/services/add');
	curl_setopt($ch, CURLOPT_POSTFIELDS, "object=" . $_POST[ "object" ] . "&type=" . $_POST[ "type" ] . "&title=" . $_POST[ "title" ] . "&email=" . $_POST[ "email" ] . "&image=" . $_POST[ "image" ] );
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	$data = curl_exec($ch); 
	curl_close($ch); 

	echo $data;
?>