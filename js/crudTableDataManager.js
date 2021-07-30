
class crudTableDataManager {
    
    constructor() {
        //this.tableData = grabDataFromServer();
        this.tableData = [
            { name: "Monte", fieldA: 1658, fieldB: "Parco Foreste Casentinesi", fieldC: "10", "last updated": "10"   },
            { name: "Falterona", fieldA: 1654, fieldB: "Parco Foreste Casentinesi", fieldC: "10", "last updated": "10"  },
            { name: "Poggio", fieldA: 1520, fieldB: "Parco Foreste Casentinesi",   fieldC: "10", "last updated": "10"  },
            { name: "Pratomagno", fieldA: 1592, fieldB: "Parco Foreste Casentinesi", fieldC: "10", "last updated": "10"  },
            { name: "Amiata", fieldA: 1738, fieldB: "Siena", fieldC: "10", "last updated": "10" }
        ];
    }
    
    grabDataFromServer() {
        
        //php
        
    }
    
    updateServer() {
        
        //php
        
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
    
    addNewRow() {
        // this is just silly stuff to prevent duplicate names while adding rows
        name = "";
        if (this.tableData.filter(d => d.name == name).length > 0) {
            
            name = this.pickUnusedName("name");
           
        }
        
        
        this.tableData.push({name: name, fieldA: "", fieldB: "", fieldC: "", "last updated": this.getTimestamp()})
        tableViewer.refreshTableData();
        this.updateServer();

    }
    
    //tableData should really be private
    requestTableData() {
        return this.tableData
    }
    
    requestModifyElement(name,key,newValue) {
        let success = true
        if (key == "name") {
            if (this.tableData.filter(d => d.name === newValue).length > 0) {
                success = false
                
            }
        }
        
        //this is admittedly a little bit lazy - i'm disallowing these characters so that i can use them as delimiters on the server without having to worry about escaping them
        if ( newValue.includes("|") || newValue.includes("_") ) {
            success = false
        }
        
        if (success) {
            //apply the now allowed change
            let row = this.findRow(name);
            row[0][key] = newValue;
            row[0]["last updated"] = this.getTimestamp();
            
            //update server!
            this.updateServer();
        }
        return success
    }
    
    deleteSelected() {
        var selectedNames = tableViewer.findSelectedNames();
        for (var name of selectedNames) {
            let rowIndex = this.findRowIndex(name);
            this.tableData.splice(rowIndex,1);
        }
        
        tableViewer.refreshTableData();
    
        //update server!
        this.updateServer();
    }
    
    copySelected() {
        var selectedNames = tableViewer.findSelectedNames();
        for (var name of selectedNames) {
            let sourceRow = this.findRow(name);
            let rowIndex = this.findRowIndex(name);
            let destinationRow = {};
            destinationRow = Object.assign(destinationRow,sourceRow[0]);
            destinationRow.name = this.pickUnusedName(sourceRow[0]["name"]);
            destinationRow["last updated"] = this.getTimestamp();
            this.tableData.splice(rowIndex+1,0,destinationRow);
        }
        
        tableViewer.refreshTableData();
    
        //update server!
        this.updateServer();
    }
    
}



//var tableData = grabDataFromServer();

 





