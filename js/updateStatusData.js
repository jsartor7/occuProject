

function updateStatusDivElement(statusData)
{
    
    const statusArray = statusData.split("|");
    
    html = "<div class=\"column\"><table style=\"width:30%\">";
    for (var i = 0; i < statusArray.length; i++) {
        
        //start a new table (side by side) every 20 to make it fit on the page
        if (i>0 && i%20 == 0)
        {
            html += "</table></div>"
            html += "<div class=\"column\"><table style=\"width:30%\">"; 
        }
        
        status = statusArray[i];
        if (status.length>1)
        {
            html += "<tr><th>"
            html += i+1
            html += "</th><th>"
            html += statusArray[i];
            html += "</th></tr>"
        }
    }    
    html += "</table></div>"
    
    //find our element and drop the HTML in
    document.getElementById("statusDiv").innerHTML = html;
}


function getStatusData()
{              
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        	updateStatusDivElement(this.responseText);
           	}
        	};
       	xmlhttp.open("GET", "../php/grabStatusData.php", true);
        xmlhttp.send();
    
}



getStatusData()