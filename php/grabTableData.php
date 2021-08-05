<?php

$filestr="../data/page2data/tableData.txt";
 
$myfile = fopen($filestr, "r") or die("can't open ".$filestr);
while(!feof($myfile)) 
{
	$r[] = fgets($myfile);
}
fclose($myfile);

$text = "";

$r = array_filter($r, function($a) {return $a !== "\r\n";});

foreach($r as $n) 
{
    $text.=$n;
}

echo rtrim($text);

?>