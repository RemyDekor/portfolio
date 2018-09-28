var worldData = {};
let popValues = [];
let elecConsomPerCapitaValues = [];
let elecConsomTotalValues = [];
let urbanPercent = [];
let urbanTotal = [];
let elecAccessPercent = [];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

function loadJsonData(dataUrl) {
  var xmlhttp = new XMLHttpRequest();

  // callback
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var myArr = JSON.parse(this.responseText);
          init(myArr); // la fonction que je veux appeler
      }
  };
  xmlhttp.open("GET", dataUrl, true);
  xmlhttp.send();
}

loadJsonData("./assets/data/World_EnergyConsum_Data.json");

function init(data) {
  mountData(data);
	animate();// at the end of the mountData() function, call animate() for the first time
}

function mountData(data)  {
  for(Indicator in data.France) {
    let dataSet = data.France[Indicator];

    for(i in dataSet){
      // console.log(parseFloat(i)); // Gets the dates
      if (!dataSet[i] == "") {
        // console.log(parseFloat(dataSet[i])); // Gets the associated value
      }else{
        // console.log("N/C");
      }
    }
  }
  worldData = data;

  for(year=1960 ; year < 2018 ; year++) {
      // TODO: (maybe) regex for checking if isAYear (4digits) : ^\d{4}$

      //Parse the JSON to get values
      popValues[year-1960] = parseFloat(worldData["Population total"][year]);
	    elecConsomPerCapitaValues[year-1960] = parseFloat(worldData["Electric power consumption (kWh per capita)"][year]);
      urbanPercent[year-1960] = parseFloat(worldData["Urban population (% of total)"][year]);    
	    elecAccessPercent[year-1960] = parseFloat(worldData["Access to electricity (% of population)"][year]);
      // Calculate new values based on parsed ones
      elecConsomTotalValues[year-1960] = elecConsomPerCapitaValues[year-1960] * popValues[year-1960];
	    urbanTotal[year-1960] = urbanPercent[year-1960] * popValues[year-1960] / 100;
	
		// console.log(year + " : " + elecConsomPerCapitaValues[year-1960] +'\t'+ elecConsomTotalValues[year-1960] +'\t'+ urbanPercent[year-1960] +'\t'+ urbanTotal[year-1960] +'\t'+ elecAccessPercent[year-1960]);
  }
}

window.onresize = resize;

function resize() { 
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}


let frameCount = 0;
// ----------------- THE LOOP ----------------- 
function animate() {
	requestAnimationFrame( animate );
  renderer.render( scene, camera );
  frameCount++;
}
// -------------------------------------------- 



