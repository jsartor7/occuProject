 <?php

// this function mostly taken from first answer at:
//https://stackoverflow.com/questions/3004041/how-to-replace-a-particular-line-in-a-text-file-using-php

// get all parameters from URL
// $name $key $value
parse_str($_SERVER['QUERY_STRING']);

$filename="../data/page2data/tableData.txt";
$tmpfilename="../data/page2data/tableData.tmp";
$lockFilename="../data/page2data/dataLock.txt";

$now = new DateTime('now', new DateTimeZone('Pacific/Honolulu'));



$success = true;
if (strpos($value,"|")>-1) {
    $success = false;
}

$lockFile = fopen($lockFilename, 'r');
// acquire an exclusive lock
if (flock($lockFile, LOCK_EX)) {

    $reading = fopen($filename, 'r');
    $writing = fopen($tmpfilename, 'w');
    
    $replaced = false;
    $nameAlreadyTaken = true;
    // go through and re-form the file, skipping the chosen line with the deleted name
    while (!feof($reading) && $success) {
        $line = fgets($reading);
    	$parts = explode("|",$line);
    	if (count($parts)>2)
    	{
    	    //putting the new value in the right field
            if ($key=="name") {
                //if ANY name is the same as the new value, we have a problem
                if ($value == $parts[0]) {
                    $success = false;
                }
                elseif ($parts[0] == $name) {
                    //the logic here is definitely confusing, but basically we only change the name if they were the same, but now they're not
                    $parts[0] = $value;
                    $replaced = true;
                }
                
            }
            elseif ($parts[0] == $name) {
                    
                if ($key == "fieldA") {
                    $parts[1] = $value;
                    $replaced = true;
                }
                elseif ($key == "fieldB") {
                    $parts[2] = $value;
                    $replaced = true;
                }
                elseif ($key == "fieldC") {
                    $parts[3] = $value;
                    $replaced = true;
                }
            }
            
            //only if this is our changing one
            if ($parts[0] == $name || ($key == "name" && $parts[0] == $value)) {
                //update the updated time
                $now = new DateTime('now', new DateTimeZone('Pacific/Honolulu'));
                if (count($parts == 5)) {
                    $parts[4] = $now->format('U');
                }
                else {
                    array_push($parts,$now->format('U'));
                }
            
            
                $line = implode("|",$parts) . "\n";
    	        fputs($writing,$line);
                
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
    }
    fclose($reading); 
    fclose($writing);
    
    
    // might as well not overwrite the file if we didn't replace anything
    if ($replaced && $success) 
    {
      rename($tmpfilename, $filename);
    } 
    else 
    {
      unlink($tmpfilename);
      $success = false;
    }
    
    fflush($lockFile);            // flush output before releasing the lock
    flock($lockFile, LOCK_UN);    // release the lock
}


$returnTxt = "";
if (!$success) {
    $returnTxt .= "-1|";
}

$returnTxt .= rtrim($name) . "|" . $key . "|" . $now->format('U');
echo $returnTxt;
?>
