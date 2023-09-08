<?php
$socket = fsockopen("10.30.12.33", "23", $errno, $errstr); 

if($socket) 
{ 
    echo "Connected <br /><br />"; 
} 
else 
{ 
    echo "Connection failed!<br /><br />"; 
} 
fputs($socket, "root \r\n"); 

while(!feof($socket)) 
{ 
    $buffer .=fgets($socket, 4096); 
} 

print_r($buffer); 
echo "<br /><br /><br />"; 
var_dump($buffer); 

fclose($socket); 
?> 


