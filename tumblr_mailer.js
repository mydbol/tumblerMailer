var fs=require("fs");

// create an array of object from for parsed csv file.
var csvToArrayOfObjects=function(csvFile){
	var csvFileContents=fs.readFileSync(csvFile,'utf8');
	console.log(csvFileContents)
	var csvFileContentsArray=csvFileContents.split("\n");
	var headers=csvFileContentsArray[0].split(',');
	this.data=[];
	for (var i =1; i < csvFileContentsArray.length;i++) {
	var objectString='{';
		var fields = csvFileContentsArray[i].split(',');
		if(csvFileContentsArray[i].length === 0){continue};
		for(var x=0;x < fields.length;x++){
			objectString+='"'+headers[x]+'":';
			objectString+='"'+fields[x]+'"';
			if(x === fields.length-1){objectString+='}'};
			if(x !== fields.length-1){objectString+=','};
		}
		this.data.push(JSON.parse(objectString));
	}	
}
var contactList=new csvToArrayOfObjects('friend_list.csv');
console.log(contactList.data);