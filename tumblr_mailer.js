var fs=require("fs");
var ejs=require("ejs");
var tumblr=require("tumblr.js");
// create an array of object from for parsed csv file.
var tumblrClient = tumblr.createClient({
  consumer_key: 'KH6Xh8DFfTeC7ZTegNY99qw5VYI6Ok5znkvnbMglqZHIOI0K0Z',
  consumer_secret: '2PN60V1wEX687yECX3OQSzb9B4ZVr3JMl0zSoabZJBh9pqO09h',
  token: 'eLtmnptyfDJRbZpkIuHm2Khgpf84CQe39cPHxV4A6K0TliucG5',
  token_secret: 'Bze5Qjhbv0ajKaoVfN8J2gHa7ICzFrgx6FmVZVPz5eAPl116lq'
});

function getUtime(dateIn){
var utimeNow
if(dateIn === undefined){
utimeNow= new Date().getTime();
}else{
utimeNow= new Date(dateIn).getTime();
}
return Math.floor(utimeNow/1000);
}

// Make the request
tumblrClient.userInfo(function (err, data) {
    //console.log(data);
});


function csvToArrayOfObjects(csvFile){
	String.prototype.trim = function() {
  		return this.replace(/^\s+|\s+$/g, "");
	};
	var csvFileContents=fs.readFileSync(csvFile,'utf8');
	var csvFileContentsArray=csvFileContents.split("\n");
	var headers=csvFileContentsArray[0].split(',');
	this.data=[];
	for (var i =1; i < csvFileContentsArray.length;i++) {
	csvFileContentsArray[i].trim();
	var objectString='{';
		var fields = csvFileContentsArray[i].split(',');
		if(csvFileContentsArray[i].length === 0){continue};
		for(var x=0;x < fields.length;x++){
			objectString+='"'+headers[x].trim()+'":';
			objectString+='"'+fields[x].trim()+'"';
			if(x === fields.length-1){objectString+='}'};
			if(x !== fields.length-1){objectString+=','};
		}
		this.data.push(JSON.parse(objectString));
	}	
	return this.data;
}


var emailTemplate=fs.readFileSync('emailTemplate_1.html',"utf8");
function view(viewtemplate,valuesObject){
		for(currentvalue in valuesObject){
			viewtemplate=viewtemplate.replace('{{'+currentvalue+'}}' , valuesObject[currentvalue]);
		}
		return viewtemplate;
}
//var renderedEmail=view(emailTemplate,contactList[0]);
//console.log(renderedEmail);
//console.log(ejsrenderedEmail);

tumblrClient.posts('mydbol.tumblr.com',function (err, data) {
	console.log(data)
	var latestPosts=[];
	var utimeNow=getUtime();
	var numberOfDays=7;
	var daysToInclude=86400 * numberOfDays;
	var utimeOfPost='';
	var myEmailCompositionData={
		contactList:[],
		latestPosts:[]
	};
		for(i=0; i < data.posts.length;i++){
						utimeOfPost=getUtime(data.posts[i].date)
				// if date on post is not older then  86400 sec. * days then include the post 
				if((utimeNow - utimeOfPost) < daysToInclude){
					latestPosts.push(data.posts[i]);	
				}
		}
		
		if(latestPosts.length > 0){
			myEmailCompositionData.latestPosts=latestPosts;
			myEmailCompositionData.contactList=new csvToArrayOfObjects('friend_list.csv');
		//	console.log(myEmailCompositionData);
			var ejsTemplate=fs.readFileSync("emailTemplate_EJS.html","utf8");
		setTimeout(function(){
			var ejsrenderedEmail=ejs.render(ejsTemplate,myEmailCompositionData);
			console.log(ejsrenderedEmail);
		},4000);
		};
});


