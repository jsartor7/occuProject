
class crudTableViewer{
    constructor(tableData) {
        this.table = document.getElementById("crudTable");
        this.headers = 
        this.tableData = tableData;
        this.headers = ["select", "compare", "name", "fieldA", "fieldB", "fieldC", "last updated"];//Object.keys(tableData[0]);
        
        this.generateTableHead();
        this.generateTable();
    }


    redrawTable() {
        this.clearTable();
        this.generateTableHead();
        this.generateTable();
    }
    
    refreshTableData() {
        this.tableData = tableManager.requestTableData();
        this.redrawTable();
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
            input.setAttribute("id", key+"=search");
            input.setAttribute("type", "text");
            function clickHandler() { tableViewer.search(input.value,key); }
            input.addEventListener ("keyup", clickHandler ,false);	
		    cell.appendChild(input);
        }
        
        
        for (let element of this.tableData) {
            rowNum += 1;
            let row = this.table.insertRow();
    
            //make a checkbox
            let cell = row.insertCell();
            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("id", "select"+"="+rowNum);
            cell.appendChild(checkbox);
    
            //make a checkbox
            let compCell = row.insertCell();
            let compCheckbox = document.createElement("input");
            compCheckbox.setAttribute("type", "checkbox");
            compCheckbox.setAttribute("id", "compare"+"="+rowNum);
            function onClick() { tableViewer.compare(); }
            compCheckbox.addEventListener('change', onClick, false);
            compCell.appendChild(compCheckbox);
            
            //add in all the data
            for (let key in element) {
                let cell = row.insertCell();
                let input = document.createElement("input");
                input.setAttribute("type", "text");
                input.value = element[key];
                input.setAttribute("id", key+"="+rowNum);
                if (key == "last updated") {
                    input.disabled = true;
                }
                cell.appendChild(input);
                input.onchange = function() { 
                    let success = tableManager.requestModifyElement(element["name"],key,input.value)
                    if (success == false) {
                        alert("you may not make data with duplicate names or disallowed characters (| and _) !")
                    }
                    tableViewer.refreshTableData()

                }

            }
    

    
        } 
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
    
    findCompareNames() {
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
            
            //the following code searches ALL keys
            //var found = Object.values(myEntry).find(element => this.subStrSearch(element,searchText));
            //if (found === undefined) {
            //    hideNameList.push(myEntry.name);
            //}
        }

        
        //i=2 --> skip the header and search rows
        for (let i = 2; i < tableRows.length; i++) {
            var myRow = tableRows[i];
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
            
            
            
            
            //i=2 --> skip the header and search rows
            for (let i = 2; i < tableRows.length; i++) {
                var myRow = tableRows[i];
                var myName = myRow.childNodes[2].childNodes[0].value
                if (hideNameList.includes(myName)) {
                    myRow.hidden = true;
                }
                else {
                    myRow.hidden = false;
                }
            }
            
            for (let i = 0; i < 2; i++) {
                for (let j = 3; j<6; j++) {
                    if (compareList[i].childNodes[j].childNodes[0].value == compareList[(i+1)%2].childNodes[j].childNodes[0].value) {
                    }
                    else {
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
                this.redrawTable()
            }
        }
        
    }
    
}



