
class crudTableViewer{
    constructor(tableData) {
        this.table = document.getElementById("crudTable");
        this.headers = 
        this.headers = ["select", "compare", "name", "fieldA", "fieldB", "fieldC", "last updated"];//Object.keys(tableData[0]);
        
    }
    


    redrawTable() {
        this.clearTable();
        this.generateTableHead();
        this.generateTable();
    }
    
    refreshTableData() {
        this.tableData = tableManager.requestTableData();
    }
    
    clearTable() {
        var rowCount = this.table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            //i am sure there is probably a nicer way of doing this
            this.table.deleteRow(0);
        }
    }
    
    //adapted from https://www.valentinog.com/blog/html-table/
    generateTableHead() {
        let thead = this.table.createTHead();
        let row = thead.insertRow();
  
        //make a header row for each key
        for (let key of this.headers) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }

    

    generateTable() {
        var rowNum = 0

        //first we make the search row
        let row = this.table.insertRow();
        //starts hidden unless you click search button
        row.hidden = true;
        let cell = row.insertCell();
        cell.colSpan=2;
        let text = document.createElement('strong');
        text.innerHTML = "SEARCH:"
        //todo: actually center
        cell.align="center"
        cell.appendChild(text);
        
        //name search
        var keys = ["name","fieldA","fieldB","fieldC"];
        
        for (let i=0;i<keys.length;i++) {
        
            let key = keys[i];
            let cell = row.insertCell();
            let input = document.createElement("input");
            input.setAttribute("id", i+"|search");
            input.setAttribute("type", "text");
            function clickHandler() { tableViewer.search(input.value,key); }
            input.addEventListener ("keyup", clickHandler ,false);	
		    cell.appendChild(input);
        }
        
        
        for (let element of this.tableData) {
            this.addRow(element)
    

    
        } 
    }
    
    addRow(tableDataRow) {
        var rowNum = this.table.rows.length+1;
        let row = this.table.insertRow();
    
        //make a checkbox
        let cell = row.insertCell();
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "select"+"|"+rowNum);
        cell.appendChild(checkbox);

        //make a checkbox
        let compCell = row.insertCell();
        let compCheckbox = document.createElement("input");
        compCheckbox.setAttribute("type", "checkbox");
        compCheckbox.setAttribute("id", "compare"+"|"+rowNum);
        function onClick() { tableViewer.compare(); }
        compCheckbox.addEventListener('change', onClick, false);
        compCell.appendChild(compCheckbox);
        
        //add in all the data
        for (let key in tableDataRow) {
            let cell = row.insertCell();
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.value = tableDataRow[key];
            //we'll use this to see what it was before a change
            input.data = tableDataRow[key];
            input.setAttribute("id", key+"|"+rowNum);
            if (key == "last updated") {
                input.disabled = true;
            }
            cell.appendChild(input);
            input.onchange = function() { 
                if (this.data != this.value) {
                    var rowName = this.parentNode.parentNode.childNodes[2].childNodes[0].data;
                    tableManager.requestServerModifyElement(rowName,key,input.value)
                }
            }

        }
    }
    
    removeRow(name) {
    
        var tableElem = document.getElementById("crudTable");
        var tableRows = tableElem.children[0].childNodes;
        //start at 1 to not search the header row
        
        var removeNameList = [];
        
        for (let i = 2; i < rows.length; i++) {
            var myRow = rows[i];
            var myName = myRow.childNodes[2].childNodes[0].value
            if (name == myName) {
                myRow.remove();
                
            }
        }


        //hide rows not fitting the search
        this.hideList(tableRows,hideNameList);
        
    }
    
    findSelectedNames() {
        var nameList = [];
        var selectionList = document.querySelectorAll('[id^="select"]');
        for (let i = 0; i < selectionList.length; i++) {
            if (selectionList[i].checked) {
                nameList.push(document.querySelectorAll('[id^="name"]')[i].value);
            }
        }
        return nameList;
        
    }

    
    subStrSearch(text,searchText) {
        //returns position of substr, or -1 if not present
        var pos = String(text).search(searchText);
        if (pos > -1) {
            return true
        }
        else {
            return false
        }
    }
    
    showSearch() {
        var tableElem = document.getElementById("crudTable");
        var tableRows = tableElem.children[0].childNodes;
        tableRows[1].hidden = !tableRows[1].hidden;

    }
    
    revertOrAssertCell(operation,name,key,lastUpdated) {
    
        var tableElem = document.getElementById("crudTable");
        var tableRows = tableElem.children[0].childNodes;
        //start at 1 to not search the header row
        for (let i = 2; i < tableRows.length; i++) {
            var myRow = tableRows[i];
            name = name.trim()
            var myName = myRow.childNodes[2].childNodes[0].data.trim();
            
            if (myName == name) {
                if (key == "name") {
                    var myCell = myRow.childNodes[2].childNodes[0];
                }
                else if (key == "fieldA") {
                    var myCell = myRow.childNodes[3].childNodes[0];
                }
                else if (key == "fieldB") {
                    var myCell = myRow.childNodes[4].childNodes[0];
                }
                else if (key == "fieldC") {
                    var myCell = myRow.childNodes[5].childNodes[0];
                }
                
                //either we're changing back to our old value
                if (operation == "revert") {
                    myCell.value = myCell.data;
                }
                else if (operation == "assert") {
                    //or we are changing data to match the new value
                    myCell.data = myCell.value;
                    myRow.childNodes[6].childNodes[0].value = lastUpdated;
                }
                
                //update the time!
                    
            }
        }
        
    }
    search(searchText,key) {
    
        var tableElem = document.getElementById("crudTable");
        var tableRows = tableElem.children[0].childNodes;
        //start at 1 to not search the header row
        
        var hideNameList = [];
        
        for (let i = 0; i < this.tableData.length; i++) {
            var myEntry = this.tableData[i];
            if (this.subStrSearch(myEntry[key],searchText) === false) {
                hideNameList.push(myEntry.name);
            }
        }

        //hide rows not fitting the search
        this.hideList(tableRows,hideNameList);
        
    }
    
    hideList(rows,hideNameList) {
        //i=2 --> skip the header and search rows
        for (let i = 2; i < rows.length; i++) {
            var myRow = rows[i];
            var myName = myRow.childNodes[2].childNodes[0].value
            if (hideNameList.includes(myName)) {
                myRow.hidden = true;
            }
            else {
                myRow.hidden = false;
            }
        }
    }
    
    compare() {
        var tableElem = document.getElementById("crudTable");
        var tableRows = tableElem.children[0].childNodes;
        //start at 1 to not search the header row
        
        var hideNameList = [];
        var compareList = [];
        
        var numComparing = 0;
        
        //here we count the number of checkboxes compared, but also keep track of who we are going to hide/compare if it is the right number
        for (let i = 2; i < tableRows.length; i++) {
            
            var myRow = tableRows[i];
            var isChecked = myRow.childNodes[1].childNodes[0].checked
            if (isChecked) {
                numComparing +=1;
                compareList.push(myRow)
            }
            else {
                hideNameList.push(myRow.childNodes[2].childNodes[0].value);
            }
        }

        //only compare sets of size 2
        if (numComparing == 2){
            
            //hide the non-comparing guys
            this.hideList(tableRows,hideNameList);
            
            //now we do the actual comparison
            //i starts at 2 to skip header and search row
            for (let i = 0; i < 2; i++) {
                //j= 3-5 --> fieldA, fieldB, fieldC
                for (let j = 3; j<6; j++) {
                    if (compareList[i].childNodes[j].childNodes[0].value == compareList[(i+1)%2].childNodes[j].childNodes[0].value) {
                    }
                    else {
                        //mark the non-matches in red
                        compareList[i].childNodes[j].bgColor ="red";
                    }
                }
            }
            
            //but we also are going to manually hide the search row
            //since searching and comparing simultanously is nonsense
            
            //this might not be the desired result, i could also imagine that maybe the user wants to still see search results after de-comparing... but i figure this is OK for now.
            for (let i = 2; i < 5; i++) {
                tableRows[1].childNodes[i].childNodes[0].value="";
            }
            tableRows[1].hidden = true;

        }
        else {
            //redraw table if the search bar is hidden.
            //this is a little counter-intuitive, but if the search bar was hidden then either:
            //1: you weren't searching in the first place, or
            //2: the search bar was hidden from comparing.
            //OTOH, if the search bar *wasn't* hidden, you shouldn't unhide anything because it wasn't hidden on account of "comparing"
            if (tableRows[1].hidden) {
                //you could obviously just unhide the rows, but then you'd have to unhighlight the red cells, which is mildly annoying because the bg colors alternate
                for (let i = 2; i < tableRows.length; i++) {
                    //only redraw if someone was hidden
                    if (tableRows[i].hidden) {
                        this.refreshTableData();
                        this.redrawTable();
                        break;
                    }
                }
            }
        }
        
    }
    
}



