
class crudTableDataManager {
    
    constructor() {
        this.grabDataFromServer();
    }
    
    updateTableData(serverText) {
        
        var tableData = [];
        var rows = serverText.split("\n");
    
        for (let i = 0; i < rows.length; i++) {
            var items = rows[i].split("|");
            
            var tempDict = {};
            tempDict["name"] = items[0];
            tempDict["fieldA"] = items[1];
            tempDict["fieldB"] = items[2];
            tempDict["fieldC"] = items[3];
            tempDict["last updated"] = this.timeConverter(items[4]);
            
            tableData.push(tempDict);
            
        }
        
        this.tableData = tableData;
        
        tableViewer.refreshTableData();
        tableViewer.redrawTable();

    }
    
    
    grabDataFromServer() {
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
             	tableManager.updateTableData(this.responseText.trim());
        	}
        };
       	xmlhttp.open("GET", "../php/grabTableData.php", true);
        xmlhttp.send();
    }
    
    
    getTimestamp() {
        let now = new Date();
        return now;
    }
    
    findRow(name) {
        let row = this.tableData.filter(d => d.name === name);
        return row;
    }
    
    findRowIndex(name) {
        let rowIndex = this.tableData.findIndex(d => d.name == name);
        return rowIndex;
    }
    
    pickUnusedName(baseName) {
        var i = 1
        name = baseName+i
        while (this.tableData.filter(d => d.name == name).length > 0) {
            i=i+1;
            name = baseName+i
        }
        return name
    }
    
    
    requestServerAddData(name,fieldA,fieldB,fieldC) {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == "-1") {
                    alert("adding failed");
                }
                else {
                    var tempDict = {name: name, fieldA: fieldA, fieldB: fieldB, fieldC: fieldC, "last updated": tableManager.timeConverter(this.responseText.trim())};
                    tableManager.tableData.push(tempDict);
                    tableViewer.addRow(tempDict);

    
                }
        	}
        };
       	xmlhttp.open("GET", "../php/addData.php?name="+name+"&fieldA="+fieldA+"&fieldB="+fieldB+"&fieldC="+fieldC, true);
        xmlhttp.send();
    }
    
    requestServerRemoveData(name) {

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText.trim() == -1) {
                    alert("unfortunately, something went wrong in trying to remove that!")
                }
                else {
                    tableManager.grabDataFromServer();
                    tableViewer.refreshTableData();
                }
        	}
        };
       	xmlhttp.open("GET", "../php/removeData.php?name="+name, true);
        xmlhttp.send();
    }
    

    addNewRow() {
        // this is just silly stuff to prevent duplicate names while adding rows
        name = "name";
        if (this.tableData.filter(d => d.name == name).length > 0) {
            
            name = this.pickUnusedName("name");
           
        }
        this.requestServerAddData(name,"","","")
        

    }
    
    //tableData should really be private
    requestTableData() {
        return this.tableData
    }
    

    requestServerModifyElement(name,key,newValue) {
        if (newValue.includes("&") || newValue.includes("|")) {
            alert("Modification failed. Remember that names can not be duplicate, and the \"|\" and \"&\" characters are not allowed!")
            
            tableViewer.revertOrAssertCell("revert",name,key,-1);
        }
        else {
            
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //pieces is either name|key|value|time in event of success, or -1|name|key|value|time in event of failure. the >= is because sometimes the failure is caused by extra "|" characters
                    var pieces = this.responseText.split("|")
                    if (pieces.length >= 5) {
                        alert("Modification failed. Remember that names can not be duplicate, and the \"|\" and \"&\& characters are not allowed!")
                        tableViewer.revertOrAssertCell("revert",pieces[1],pieces[2],-1);
                    }
                    else {
                        //this makes the cell's .data match the .value, for future revert opportunities
			//in retrospect, it would probably have made more sense to use tableManager.tableData instead of each element's .data property, now we have to update both and mistakes could lead to weird mismatches
			var name = pieces[0].trim();
			var key = pieces[1].trim();
			var newValue = pieces[2].trim();
			var lastUpdated = pieces[3].trim();
                        tableViewer.revertOrAssertCell("assert",name,key,tableManager.timeConverter(lastUpdated));
			var row = tableManager.findRow(name)[0];
			row[key] = newValue;
                    }
            	}
            };
           	xmlhttp.open("GET", "../php/editData.php?name="+name+"&key="+key+"&value="+newValue, true);
            xmlhttp.send();
        }
        
    }
    
    deleteSelected() {
        var selectedNames = tableViewer.findSelectedNames();
        for (var name of selectedNames) {
            this.requestServerRemoveData(name);
        }
    }
    
    copySelected() {
        
        
        var selectedNames = tableViewer.findSelectedNames();
        for (var name of selectedNames) {
            let sourceRow = this.findRow(name);
            this.requestServerAddData(this.pickUnusedName(sourceRow[0]["name"]),sourceRow[0]["fieldA"],sourceRow[0]["fieldB"],sourceRow[0]["fieldC"])
        }
        
        
        
        //the old local version
        
        //var selectedNames = tableViewer.findSelectedNames();
        //for (var name of selectedNames) {
        //    let sourceRow = this.findRow(name);
        //    let rowIndex = this.findRowIndex(name);
            
        //    let destinationRow = {};
        //    destinationRow = Object.assign(destinationRow,sourceRow[0]);
        //    destinationRow.name = this.pickUnusedName(sourceRow[0]["name"]);
        //    destinationRow["last updated"] = this.getTimestamp();
        //    this.tableData.splice(rowIndex+1,0,destinationRow);
        //}
        
        //tableViewer.refreshTableData();

    }
    
    
    
    //from https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    }
}



 





