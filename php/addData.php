 <?php

// get all parameters from URL
// $name, $fieldA, $fieldB, $fieldC
parse_str($_SERVER['QUERY_STRING'], $query);
$name = $query['name']; 
$fieldA = $query['fieldA'];
$fieldB = $query['fieldB'];
$fieldC = $query['fieldC'];


$filename="../data/page2data/tableData.txt";

$rejected = 0;

$myfile = fopen($filename, "r") or die("can't open ".$filename);
while(!feof($myfile)) 
{
	$r = fgets($myfile);
	$parts = explode("|",$r);
	if ($parts[0] == $name)
	{
	    $rejected = 1;
	}
}

$skipNewLine = false;
if ($r == "" || $r == "\n") {
    $skipNewLine = true;
}
	
fclose($myfile);

if (strpos($name, '|') !== false) { 
    $rejected=1;
}
if (strpos($fieldA, '|') !== false) { 
    $rejected=1;
}
if (strpos($fieldB, '|') !== false) { 
    $rejected=1;
}
if (strpos($fieldC, '|') !== false) { 
    $rejected=1;
}

if ($rejected == 0) {
        
    //here we make the entry that we'll be storing
    $entry = "";
    if (!$skipNewLine) {
        $entry="\n";
    }
    $entry.=$name;
    $entry.="|";
    $entry.=$fieldA;
    $entry.="|";
    $entry.=$fieldB;
    $entry.="|";
    $entry.=$fieldC;
    $entry.="|";
    $now = new DateTime('now', new DateTimeZone('Pacific/Honolulu'));
    $entry.=$now->format('U');
    
    file_put_contents($filename, $entry, FILE_APPEND | LOCK_EX);
    
}

if ($rejected == 0) {
    echo $now->format('U');
}
else {
    echo -1;
}


?>
