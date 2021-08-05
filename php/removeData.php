 <?php

// this function mostly taken from first answer at:
//https://stackoverflow.com/questions/3004041/how-to-replace-a-particular-line-in-a-text-file-using-php

// get all parameters from URL
// $name
parse_str($_SERVER['QUERY_STRING']);

$filename="../data/page2data/tableData.txt";
$tmpfilename="../data/page2data/tableData.tmp";
$lockFilename="../data/page2data/dataLock.txt";


$lockFile = fopen($lockFilename, 'r');
// acquire an exclusive lock
if (flock($lockFile, LOCK_EX)) {

    $reading = fopen($filename, 'r');
    $writing = fopen($tmpfilename, 'w');
    
    $lineFound = false;
    
    // go through and re-form the file, skipping the chosen line with the deleted name
    while (!feof($reading)) {
        $line = fgets($reading);
    	$parts = explode("|",$line);
    	if ($parts[0] == $name)
    	{
            $lineFound = true;
    	}
    	elseif ($line == "" || count($parts) < 2)
    	{
    	    //this is just for general cleanup of empty lines in the data file
    	    //definitely not the ideal way to solve it but it seems to work OK
    	    $donothing = "";
    	}
    	else 
    	{
    	    fputs($writing,$line);
    	}
    }
    fclose($reading); 
    fclose($writing);
    
    // might as well not overwrite the file if we didn't replace anything
    if ($lineFound) 
    {
      rename($tmpfilename, $filename);
    } 
    else 
    {
      unlink($tmpfilename);
    }
    
    fflush($lockFile);            // flush output before releasing the lock
    flock($lockFile, LOCK_UN);    // release the lock
}

//so that we can warn if it failed
if ($lineFound) {
    echo "1|".$name;
}
else {
    echo "-1";
}


?>
