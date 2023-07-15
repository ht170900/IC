<?php
// Get the URL parameter from the AJAX request

$url = $_POST['url'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;


// https://chat.openai.com/share/d9f3e0a8-0c7a-4828-80d1-85295deb9d18
//https://chat.forefront.ai/share/7rgwjdzbl8vhepas
?>

