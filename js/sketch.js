
var logo = [];
var rdmLogo;
var lastRdmLogo = [];
var v;
var visible;
var lightOn;
var animate;
var y;
var vel;
var acc;
var t;

function preload() {
  for(var i = 0 ; i <= 4   ; i++) {
    logo[i] = loadImage("images/logos/logo" + nf(i) + ".png");
    console.log("loaded : logo" + nf(i) + ".png");
  }
}

function rollLogo() {
  rdmLogo = logo[floor(random(4.999))];

  for (i = 0 ; i <= 2 ; i++) {
    while (rdmLogo === lastRdmLogo[i]) {
      rdmLogo = logo[floor(random(4.999))];
    }
  }

 lastRdmLogo[0] = lastRdmLogo[1];
 lastRdmLogo[1] = lastRdmLogo[2];
 lastRdmLogo[2] = rdmLogo;

 //Penser à faire MIEUX un Array avec l'historique des Logo affichés
 //pour éviter d'avoir les même logos dans un intervalle de deux roll
}

function setup(){
  createCanvas(windowWidth, 500, WEBGL);

  y = 0;
  vel = 0;
  acc = 0.9;
  t = 0;
  v = 255;
  visible = -1; // -1 = non visible, 0 = visible
  animate = false;

  rollLogo();

}

function draw(){
  clear();
  //background(250);
  ambientMaterial(0);
  ambientLight(20);
  directionalLight(90, 100, 115, -0.8, 1, -0.1);
  directionalLight(115, 100, 90, 0.5, 0.5, -0.1);

  roll();

  //rotateX(frameCount *0.01);
  //rotateY(frameCount *0.02);
  //rotateZ(frameCount *0.015);
    displayBox();
}

function mousePressed() {
  animate = true;
  vel = -20;
  if (t<=60){
    t += 158;
  }else{
    t *=1.2;
  }

  rollLogo();

  rdm_X = round(random(-1.9,1.9));
  rdmX = rdm_X >= 0 ? rdm_X + 0.5 : rdm_X -0.5;
  rdmY = round(random(-2.4,2.4));
  rdmZ = round(random(-2.4,2.4));
}

function displayBox() {
  push();
  box(150);
  pop();

  push();
  translate(0, 0, 75);
  plane(150, 150);


  if (t <= 70) {
    visible = 1;
  }else{
    visible = -1;
  }


  translate(0, 0, visible)
  specularMaterial(250,0,0,200);
  texture(rdmLogo);
  ambientLight(255-(t*3.5));
  plane(150, 150);
  pop();
}

function roll() {
  if (animate == true){
    translate(0, y, 0);
    y += vel;
    vel += acc;
    //console.log(vel);
    if (y >= 1) {
      y = 0;
      vel = -vel*0.7 + 1.3;
    }
    if (abs(y) <= 2 && abs(vel) <= 3 && t <=3) {
      y = 0;
      vel = 0;
      //console.log(t);
      t=0;
      animate = false;
    }

    rotateX(Math.easeInCubic(t,0,6,160)*rdmX);
    rotateY(Math.easeInCubic(t,0,6,160)*rdmY);
    rotateZ(Math.easeInCubic(t,0,6,160)*rdmZ);


    if (t > 0){
      t--;
    }
  }
  //console.log(animate);
}

Math.easeInCubic = function (t, b, c, d) {
	t /= d;
	return c*t*t*t + b;
};
