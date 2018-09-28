let worldData = {};
let popValues = [];
let elecConsomPerCapitaValues = [];
let elecConsomTotalValues = [];
let urbanPercent = [];
let urbanTotal = [];
let elecAccessPercent = [];

let blueElec = 0x052dff;
let backgroundBlue = 0x150f2f;
let getXmaxCoord = () => {
  return (window.innerWidth / window.innerHeight) * 1.3 + 0.6;
};
let maxDataCoord = 7;
let setMaxDataCoord = () => {
  maxDataCoord = (window.innerWidth / window.innerHeight) *2.45 ;
}
setMaxDataCoord();
console.log(maxDataCoord)

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
let renderer = new THREE.WebGLRenderer({
  antialias: true
  // alpha: true
});
renderer.setClearColor(backgroundBlue, 1);
renderer.setPixelRatio(window.devicePixelRatio);

let frameCount = 0;

setup();

window.onresize = resize;

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  setMaxDataCoord();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

let mouseX = 0.5;
let mouseY = 0.5;
document.addEventListener("mousemove", onMouseMove);
function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  planeMat.uniforms.mouse.value = new THREE.Vector2(
    mouseX / window.innerWidth,
    mouseY / window.innerHeight
  );
}

// ----------------- OBJECTS' INIT USED IN THE SCENE ---------

/*Plane*/
// var planeGeo = new THREE.PlaneGeometry(window.innerWidth/120, window.innerHeight/120, 16);
var planeGeo = new THREE.PlaneGeometry(1, 1, 16);
// var planeMat = new THREE.MeshBasicMaterial({ map: dataTex, transparent: false });
let planeMat = new THREE.ShaderMaterial({
  uniforms: {
    u_time: { value: frameCount },
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    mouse: { value: new THREE.Vector2(0, 0) }
  },
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent
});
planeMat.transparent = true;
var plane = new THREE.Mesh(planeGeo, planeMat);
plane.position.z = 3;
// scene.add(plane);

/*--Electric Sphere--*/
var sphereGroup = new THREE.Object3D();
var sphereGeo = new THREE.SphereGeometry(1, 32, 64);
var sphereMat = new THREE.MeshPhongMaterial({
  color: blueElec
  // emissive: blueElec
});
var sphere = new THREE.Mesh(sphereGeo, sphereMat);
// sphere.position.x = 5;
sphereGroup.add(sphere);

/*transparent Sphere*/
var transpSphereGeo = new THREE.SphereGeometry(1.8, 32, 64);
var transpSphereMat = new THREE.MeshStandardMaterial({
  opacity: 0.25,
  color: 0xffffff,
  transparent: true
});
var transpSphere1 = new THREE.Mesh(transpSphereGeo, transpSphereMat);
transpSphere1.position.z = -0.045;
transpSphere1.scale.set(0.9, 1, 0.9);
sphereGroup.add(transpSphere1);

var transpSphere2 = new THREE.Mesh(transpSphereGeo, transpSphereMat);
transpSphere2.position.z = -0.05;
sphereGroup.add(transpSphere2);

/* pointLight for effect on sphere*/
let largePointLight = new THREE.PointLight(blueElec, mouseX, 100);
largePointLight.position.set(-1.6, 0, 1.6);
sphereGroup.add(largePointLight);
let smallPointLight = new THREE.PointLight(0xffffff, mouseX, 50);
smallPointLight.position.set(-1, 0, 1.2);
sphereGroup.add(smallPointLight);

// scene.scale.set(1.2, 1.2, 1.2);
scene.add(sphereGroup);

/* AMBIANT LIGHT */
var light = new THREE.AmbientLight( backgroundBlue, 1.5 ); // soft white light
scene.add( light );

/*--Lines--*/

// let elecLineMat = new THREE.LineMaterial( {
//   color: blueElec,
//   linewidth: 5, // in pixels
//   vertexColors: THREE.VertexColors,
//   //resolution:  // to be set by renderer, eventually
//   dashed: false
// } );

let linesGroupConsom = new THREE.Object3D();
let linesGroupPop = new THREE.Object3D();
let linesGroupAccess = new THREE.Object3D();

let elecConsomSize = 7;
let elecPopSize = 7;
let elecAccessSize = 7;

let createLinesGroup = (groupName, elecSize, elecLineColor,elecLinesQtty) => {
  this.elecLineMat = new THREE.LineBasicMaterial( {
    color: elecLineColor
  } );

  this.groupName = groupName;
  this.elecLinesQtty = elecLinesQtty;
  let curvePointsArray = [];
  
  for (i = 0; i < elecLinesQtty; i++) {
    let rotOff = elecLinesQtty*0.08;
    let rotX = ((Math.PI * 2) / (elecLinesQtty - 1)) * i + rotOff;
    let curvePoints = [];
    for (let x = 0.01; x <= elecSize; x += 0.01) {
      let y = 0;
      curvePoints.push(new THREE.Vector2(x, y));
    }
    curvePointsArray.push(curvePoints);
    let curve = new THREE.SplineCurve(curvePointsArray[i]);
    let points = curve.getPoints(window.innerWidth / 8);
    let elecLineGeo = new THREE.BufferGeometry().setFromPoints(points);

    // Create the final object to add to the scene
    let elecLineMesh = new THREE.Line(elecLineGeo, elecLineMat);
    elecLineMesh.computeLineDistances();
    
    elecLineMesh.rotation.set(rotX, -Math.PI, 0);
    elecLineMesh.geometry.dynamic = true;
    this.groupName.add(elecLineMesh);
  }
  this.groupName.position.set(0.4, 0, 0);
  sphereGroup.add(groupName);
}
createLinesGroup(linesGroupConsom, elecConsomSize, blueElec, 9);
createLinesGroup(linesGroupAccess, elecAccessSize, 0x3E97FE, 13);
createLinesGroup(linesGroupPop, elecPopSize, 0x2F2CA2, 20);

// -----------------------------------------

// ----------------- SETUP -----------------
function setup() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("background").appendChild(renderer.domElement);

  loadJsonData("./assets/data/World_EnergyConsum_Data.json"); // Loads the JSON > then TAKE A CALLBACK
}
// -----------------------------------------

// ------------- mount data -------------

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

function init(data) {
  mountData(data);
  animate(); // at the end of the mountData() function, call animate() for the first time
}

function mountData(data) {
  for (Indicator in data.France) {
    let dataSet = data.France[Indicator];

    for (i in dataSet) {
      // console.log(parseFloat(i)); // Gets the dates
      if (!dataSet[i] == "") {
        // console.log(parseFloat(dataSet[i])); // Gets the associated value
      } else {
        // console.log("N/C");
      }
    }
  }
  worldData = data;

  for (year = 1990; year <= 2014; year++) {
    // TODO: (maybe) regex for checking if isAYear (4digits) : ^\d{4}$

    //Parse the JSON to get values
    popValues[year - 1990] = parseFloat(worldData["Population total"][year]);
    elecConsomPerCapitaValues[year - 1990] = parseFloat(
      worldData["Electric power consumption (kWh per capita)"][year]
    );
    urbanPercent[year - 1990] = parseFloat(
      worldData["Urban population (% of total)"][year]
    );
    elecAccessPercent[year - 1990] = parseFloat(
      worldData["Access to electricity (% of population)"][year]
    );
    // Calculate new values based on parsed ones
    elecConsomTotalValues[year - 1990] =
      elecConsomPerCapitaValues[year - 1990] * popValues[year - 1990];
    urbanTotal[year - 1990] =
      (urbanPercent[year - 1990] * popValues[year - 1990]) / 100;

    // console.log(year + " : " + elecConsomPerCapitaValues[year-1990] +'\t'+ elecConsomTotalValues[year-1990] +'\t'+ urbanPercent[year-1990] +'\t'+ urbanTotal[year-1990] +'\t'+ elecAccessPercent[year-1990]);
  }
}
// -----------------------------------------

// ----------------- THE ANIMATION LOOP -----------------
function animate() {
  camera.position.z = mouseX/window.innerWidth*0.3+4.5; // TODO: ADD AN EFFECT WITH THIS using data instead of mouseX
  camera.rotation.x = (1-mouseY/window.innerHeight-0.5)*0.03;

  planeMat.uniforms.u_time.value = frameCount;
  planeMat.uniforms.mouse.value = new THREE.Vector2(
    mouseX / window.innerWidth,
    mouseY / window.innerHeight
  );

  // linesGroupAccess.children[0].material.color =[0.5,1,1];

  sphereGroup.position.x = getXmaxCoord();

  let minConsom = 2124.7705232232;
  let maxConsom = 3127.36125703004;
  let mappedConsom = mappedDataValue(elecConsomPerCapitaValues[displayedYear-1990], minConsom, maxConsom, 0.9, 4.85);
  let minPop = 5288103214;
  let maxPop = 7271322821;
  let mappedPop = mappedDataValue(popValues[displayedYear-1990], minPop, maxPop, 0.9, 4.85);
  let minAccess = 71.3905769734407;
  let maxAccess = 85.7179827560055;
  let mappedAccess = mappedDataValue(elecAccessPercent[displayedYear-1990], minAccess, maxAccess, 0.9, 4.85);
  if (displayedYear == 2014) console.log(mappedConsom,mappedPop,mappedAccess)
    
  // elecConsomSize = easeFloat(mouseX/window.innerWidth * 7, elecConsomSize, 0.039);
  elecConsomSize = easeFloat(mappedConsom, elecConsomSize, 0.039);
  elecPopSize = easeFloat(mappedPop, elecPopSize, 0.045);
  elecAccessSize = easeFloat(mappedAccess, elecAccessSize, 0.051);

  animateLines(linesGroupConsom, elecConsomSize);
  animateLines(linesGroupPop, elecPopSize);
  animateLines(linesGroupAccess, elecAccessSize);

  largePointLight.intensity = mappedDataValue(elecConsomPerCapitaValues[displayedYear-1990], minConsom, maxConsom, 0, 8) + 0.8;
  smallPointLight.intensity = mappedDataValue(elecConsomPerCapitaValues[displayedYear-1990], minConsom, maxConsom, 0, 8) + 0.8;


  if (frameCount % 50+Math.random()*20 < Math.random()*15) {
    largePointLight.intensity += 1;
    smallPointLight.intensity += 0.5;
  }

  frameCount++;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
// -----------------------------------------------------

let cubicPulse = ( c, w, x ) => {
{
    x = Math.abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}
}


let animateLines = (linesGroup, elecSize) => {
  for (let c = 0; c < linesGroup.children.length; c++) {
    for (
      let i = 1;
      i <
      linesGroup.children[c].geometry.attributes.position.array.length;
      i += 3
    ) {
      let x =
      linesGroup.children[c].geometry.attributes.position.array[i - 1];
      let y =
      linesGroup.children[c].geometry.attributes.position.array[i];
      let z =
      linesGroup.children[c].geometry.attributes.position.array[i + 1];
  
      y = Math.pow(x+0.3, -1);
      y += cubicPulse(1.1, 0.5, x )*0.3;
      y += 0.03;
      y +=
        Math.cos(frameCount * 0.5 * (i * 0.07)) *
        (Math.max(elecSize*0.6 - x, 0) * 0.02);
      y +=
        Math.sin(frameCount * 7 * (i * 0.07)) * (Math.max(elecSize*0.63 - x, 0) * 0.04);
        linesGroup.children[c].geometry.attributes.position.array[i] = y;
  
      x = elecSize*i*0.0015;
      x += Math.sin(frameCount * c) * 0.001;
      linesGroup.children[c].geometry.attributes.position.array[i-1] = x;
  
      z = 0;
      z += 0.05 + Math.random() * 0.005;
      z +=
        Math.cos(frameCount * 0.4 * (i * 0.05)) *
        (Math.max(elecSize*0.53 - x, 0) * 0.015);
      z +=
        Math.sin(frameCount * 0.3 * (i * 0.07)) *
        (Math.max(elecSize*0.55 - x, 0) * 0.01);
        linesGroup.children[c].geometry.attributes.position.array[
        i + 1
      ] = z;
  
      linesGroup.children[c].geometry.attributes.position.needsUpdate = true;
    }
  
  if (frameCount % 50+Math.random()*20 < Math.random()*30) {
    linesGroup.rotation.set(Math.random() * 0.01 + frameCount * 0.01, 0, 0);
  }else{
    linesGroup.rotation.set(frameCount * 0.005, 0, 0);
  }
  }
}

function easeFloat(target, interpolizedValue, easingStrength) {
  interpolizedValue += (target-interpolizedValue)*easingStrength;
  return interpolizedValue;
}

let mappedDataValue = (value, minValue, maxValue, minOutput, maxOutput) => {
  return minOutput + (value-minValue)/(maxValue-minValue) * maxOutput;
}

let displayedYear = 1990;
function updateDate(year) {
    document.getElementById('date').innerHTML = year;
    displayedYear = year;
    document.getElementById('kwh').innerHTML = Math.floor(elecConsomPerCapitaValues[displayedYear-1990]);
    document.getElementById('pop').innerHTML = popValues[displayedYear-1990];
    document.getElementById('access').innerHTML = Math.floor(elecAccessPercent[displayedYear-1990]);
    console.log(displayedYear)
}

