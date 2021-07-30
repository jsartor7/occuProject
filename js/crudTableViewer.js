
class crudTableViewer{
    constructor(tableData) {
        this.table = document.querySelector("table");
        this.headers = 
        this.tableData = tableData;
        this.headers = Object.keys(tableData[0]);
        
        this.generateTableHead();
        this.generateTable();
    }


    refreshTableData() {
        this.tableData = tableManager.requestTableData();
        this.clearTable();
        this.generateTableHead();
        this.generateTable();
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
  
  
        //make the "select" header row
        let th = document.createElement("th");
        let text = document.createTextNode("select");
        th.appendChild(text);
        row.appendChild(th);
  
        //and the "compare" header row
        let compth = document.createElement("th");
        let compText = document.createTextNode("compare");
        compth.appendChild(compText);
        row.appendChild(compth);
  
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
    
}



