<?php

$filestr="data/page1data/statuses.txt";
 
$myfile = fopen($filestr, "r") or die("can't open ".$filestr);
while(!feof($myfile)) 
{
	$r[] = fgets($myfile);
}
fclose($myfile);

$text = "";

foreach($r as $n) {
	$text.=$n;
	$text.="|";
}

echo $text;

?>