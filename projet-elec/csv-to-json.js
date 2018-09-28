const fs = require('fs');
const filePath = 'assets/data/World_EnergyConsum_Data'
const csvFilepath = filePath + '.csv'
const jsonFilepath = filePath + '.json'
//fr.readFile() is asynchronous
const csvdata = fs.readFileSync(csvFilepath, 'utf8');


// var csv is the CSV file with headers
function csvJSON(csv){
  csv = csv.replace(/\r/g,'');
  var lines=csv.split("\n");
  var result = [];
  var headers=lines[0].split(",");

  for(let i=1 ; i<lines.length ; i++){
	  var obj = {};
	  var currentline=lines[i].split(",");

	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }
	  result.push(obj);
  }

  //return result; //JavaScript object
  return JSON.stringify(result); //JSON
}

console.log('Thi should be JSON:\n\n', csvJSON(csvdata) );

setTimeout(function() {
    fs.writeFileSync(jsonFilepath, csvJSON(csvdata), 'utf8')
  }
, 500)
