//game design globals
var SCENE_LENGTH = 15000; //milliseconds
var GAME_LENGTH = 60000;

//coding globals
var MENU = 0;
var MENU_GESTURE = 1;
var MORNING = 2;
var MORNING_GESTURE = 3;
var MIDDAY = 4;
var MIDDAY_GESTURE = 5;
var STORM = 6;
var STORM_GESTURE = 7;
var SUNSET = 8;
var SUNSET_GESTURE = 9;
var NIGHT = 10;
var NIGHT_GESTURE = 11;
var GAMEOVER = 12;
var END_GAME = 13;
var curRPM = 0;


var STATES_NAMES = ['menu', 'menu_gesture (translation)', 'morning', 'morning gesture \n (demi tour)', 'midday', 'midday gesture \n (vrille)', 'storm', 'storm gesture (looping)', 'sunset', 'sunset gesture (huit)', 'night', 'night gesture (none)', 'game over'];

var SENTENCES = ["Je reve de voler dans les airs a nouveau", "Percer les nuages solitaires tout la-haut", "Flottant, aspirant l'infini bleu du ciel", "Tracant dans l'orage le dessein de mes ailes", "Poursuivre sans hate les rayons du soleil", "Les etoiles, la lune....", "...L'horizon du sommeil.", "Fin"];

var c_state = MENU;
var sentencenum = 0;

var switched = false;

var newsky = false;

var startedmusic = false;



function displayState(field){
  console.log("" + STATES_NAMES[c_state]);
  field.setAttribute('text','value', SENTENCES[sentencenum]);
  field.setAttribute('visible','true');
  sentencenum ++;
}


function incState(){
  switched = true;
  c_state++;
  console.log("switching from " + STATES_NAMES[c_state-1] +" to "+ STATES_NAMES[c_state]);
}

function endGame(){
    switched = true;
    c_state = END_GAME;
    setFMODMusic(7);
}


function beTransparent(element) {
    element.setAttribute('opacity', 0);
    element.setAttribute('visible', "false");
}


function beOpaque(element){
  element.setAttribute('opacity', 1);
}


function figureChecker(){
    //this.jalons = [false, false, false, false, false];
    this.gesture_succeeded = false;
    this.halfgesture_succeded = false;
    this.c_jalon = 0;
    this.oldZ = 0;
    this.oldX = 0;
    this.oldY = 0;
    this.pvalue = 0;
    this.turnleft = false;
    this.turnright = false;
    this.initOrientation = {"x":0, "y":0, "z": 0};
    this.factor = 0;
    this.checkpoint = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.visitedcheckpoint = ["none", "none", "none", "none", "none", "none", "none", "none", "none"];
    //console.log(this.initOrientation);

    this.getOrientation= function(){
      return this.initOrientation;
    }

    this.reset = function(){
      //this.jalons = [false, false, false, false, false];
      this.gesture_succeeded = false;
      this.c_jalon = 0;
      this.visitedcheckpoint = ["none", "none", "none", "none", "none", "none", "none", "none", "none"];
      this.initOrientation = {"x":0, "y":0, "z": 0};
    }

    this.translate = function(evt){
      if(!this.gesture_succeeded){
        incFMODRPM();
        var count = 0;
        var i = 0;
        var currentY = evt.detail.newData.y;
        if (evt.detail.name == 'rotation') {
          var diffY = currentY - this.oldY;
          console.log(currentY);
          console.log(this.oldY);
          console.log(diffY);
          var absY = (diffY < 0) ? (diffY * -1) : diffY;
          if( absY > 80){
              this.gesture_succeeded = true;
            }
        }
      }
    }

    this.turnaround = function(evt){
      if(!this.gesture_succeeded){
        var count = 0;
        var i = 0;
        var currentZ = evt.detail.newData.z;
        if (evt.detail.name == 'rotation') {
          var diffZ = currentZ - this.oldZ;
          console.log(currentZ);
          console.log(this.oldZ);
          console.log(diffZ);
          var absZ = (diffZ < 0) ? (diffZ * -1) : diffZ;
            if( absZ > 150){
                this.gesture_succeeded = true;
              }
        }
      }
    }

    this.eight = function(evt){
      if(!this.gesture_succeeded){
        var count = 0;
        var i = 0;
        var currentZ = evt.detail.newData.z;
        if(!this.halfgesture_succeeded){
          if (evt.detail.name == 'rotation') {
            var diffZ = currentZ - this.oldZ;
            console.log(currentZ);
            console.log(this.oldZ);
            console.log(diffZ);
            var absZ = (diffZ < 0) ? (diffZ * -1) : diffZ;
              if( absZ > 150){
                  this.halfgesture_succeeded = true;
                  this.oldZ = currentZ;
              }
          }
        }else{
          if (evt.detail.name == 'rotation') {
            var diffZ = currentZ - this.oldZ;
            console.log(currentZ);
            console.log(this.oldZ);
            console.log(diffZ);
            var absZ = (diffZ < 0) ? (diffZ * -1) : diffZ;
              if( absZ > 150){
                  this.gesture_succeeded = true;
              }
          }
        }
      }
    }

    this.looping = function(evt){
      if(! this.gesture_succeeded){
        //console.log(this.initOrientation);
        //var z = this.initOrientation.z;
        var count = 0;
        var i = 0;
        var currentZ = evt.detail.newData.z;
        if (evt.detail.name == 'rotation') {
          //console.log("received rotation event, newData :" + currentZ +"oldData : "+ this.oldZ );
          //TOO FAST
          if(currentZ - this.oldZ > 60 && !(currentZ <-100 && this.oldZ > 100)){
            console.log("too fast, aquisition might be wrong !!!!!!!!!!!!!");
          }
          for(i = 0; i < this.checkpoint.length; i++){
            if( (currentZ >= this.checkpoint[i] && this.oldZ <= this.checkpoint[i]) && !(this.oldZ <-100 && currentZ > 100) ){
              this.visitedcheckpoint[i] = "forward";
            }
            else if(currentZ <= this.checkpoint[i] && this.oldZ >= this.checkpoint[i] && !(currentZ <-100 && this.oldZ > 100) ){
              this.visitedcheckpoint[i] = "backward";
            }
          }
          for(i = 0; i < this.checkpoint.length - 1 ; i++){
            if(this.visitedcheckpoint[i] == this.visitedcheckpoint[i+1] && this.visitedcheckpoint[i] != "none"){
              count++;
            }
          }
          //console.log("number of checkpoint visited : " + count + "checkpoints " + this.visitedcheckpoint);
          if(count >= this.visitedcheckpoint.length - 4){
            this.gesture_succeeded = true;
          }
          this.oldZ = currentZ;
      }
    }

  }

  this.vrille = function(evt){
    //console.log(evt.detail.newData);
    if(! this.gesture_succeeded){
      var count = 0;
      var i = 0;
      var currentZ = evt.detail.newData.z;
      var currentX = evt.detail.newData.x;
        if (evt.detail.name == 'rotation') {
          //console.log("received rotation event, newData :" + currentX +"oldData : "+ this.oldX );
          //TOO FAST
          if(currentX - this.oldX > 90 || currentX - this.oldX < -90)
            console.log("too fast, acquisition might be wrong !!!!!!!!!!!!!");
          }


          for(i = 0; i < this.checkpoint.length; i++){

            if(currentZ < 0){
              if(this.oldX > this.checkpoint[i] && currentX < this.checkpoint[i]){
                this.visitedcheckpoint[i] = "forward";
              }
              else if( this.oldX < this.checkpoint[i] && currentX > this.checkpoint[i] ){
                this.visitedcheckpoint[i] = "backward";
              }
            }
            else if(currentZ > 0){
              if(this.oldX < this.checkpoint[i] && currentX > this.checkpoint[i]){
                this.visitedcheckpoint[i] = "forward";
              }
              else if(this.oldX > this.checkpoint[i] && currentX < this.checkpoint[i]){
                this.visitedcheckpoint[i]="backward";
              }
            }



          }



          for(i = 0; i < this.checkpoint.length - 1 ; i++){
            if(this.visitedcheckpoint[i] == this.visitedcheckpoint[i+1] && this.visitedcheckpoint[i] != "none"){
              count++;
            }
          }


          //console.log("number of checkpoint visited : " + count + "checkpoints " + this.visitedcheckpoint);
          if(count >= this.visitedcheckpoint.length - 2) this.gesture_succeeded = true;
          this.oldZ = currentZ;
      }
  }

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



AFRAME.registerComponent('main', {
  schema:{},

  multiple : false,

  init:function(){
    console.log("initialising scene");
    this.started = false;
    this.sceneEl = document.querySelector('a-scene');
    this.sceneEl.setAttribute('rain', {count:0});
    this.textfield = this.sceneEl.querySelector('#textfield');
    this.instruction = this.sceneEl.querySelector('#instruction');
    this.gestureChecker = new figureChecker();
    this.currentFigure;
    this.timer = null;
    this.plane = this.sceneEl.querySelector('[camera]').querySelector('#plane');
    console.log(this.sceneEl.querySelector('[camera]').querySelector('#plane'));
    console.log("scene initiated");
  },


  tick: function(){


    //console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);

    if(this.started){


      /*this.gestureChecker.initOrientation.x = document.querySelector('a-entity[camera]').getAttribute('rotation').x;
      this.gestureChecker.initOrientation.y = document.querySelector('a-entity[camera]').getAttribute('rotation').y;
      this.gestureChecker.initOrientation.z =  document.querySelector('a-entity[camera]').getAttribute('rotation').z;
      var newy = this.gestureChecker.initOrientation.y + 1;*/



      switch(c_state){


        case MENU:
          //not implemented in the proto thingy
          //La camera doit être fixe
          if(!startedmusic) {
            this.instruction.setAttribute('visible','false');
            displayState(this.textfield);
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            startedmusic = true;
          //TODO check translation gesture
            setTimeout(function(){
                startFMODMusic();
                setFMODMusic(0);},
                3000);
            setTimeout(incState, 6000);
          }
          break;

        case MENU_GESTURE:
          if(switched){
            //change musique
            this.instruction.setAttribute('visible','true');
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            switched = false;
            this.gestureChecker.oldY = document.querySelector('a-entity[camera]').getAttribute('rotation').y;
            this.currentFigure = this.gestureChecker.translate.bind(this.gestureChecker);
            document.querySelector('[camera]').addEventListener('componentchanged', this.currentFigure, false);
          }else{
            if(this.gestureChecker.gesture_succeeded){
                console.log("gesture succeeded");
                document.querySelector('[camera]').removeEventListener('componentchanged', this.currentFigure, false);
                this.gestureChecker.reset();
                setFMODMusic(1);
                setTimeout(incState(), 5000);
                this.plane.emit("active");
                this.sceneEl.querySelector('[camera]').querySelector('#groundp').emit("active");
                this.sceneEl.querySelector('[camera]').querySelector('#cloudsp').emit("active");
                this.sceneEl.querySelector('[camera]').querySelector('#skyp').emit("active");
                beTransparent(document.querySelector('#menusky'));
                beOpaque(document.querySelector('#morningsky'));
                newsky = true;
                startedmusic = false;
              }
          }
          break;




        case MORNING:
          if(switched){
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            switched = false;
            //affiche texte figure succès
            displayState(this.textfield);
            this.instruction.setAttribute('visible','false');
            this.instruction.setAttribute('material','color:white; side: front; shader:gif; src:url(assets/pictos/picto_turnaround.gif) ; transparent:true; opacity:1; alphaTest: 0.5;');
            //reset timer
            setTimeout(incState, SCENE_LENGTH);
            this.timer = setTimeout(endGame, GAME_LENGTH);
          }if(curRPM <= 4500){
            curRPM = curRPM + 30;
            setFMODRPM(curRPM);
            console.log("curRPM " + curRPM);
          }
          else if(!startedmusic){
            //if RPM is high enough, change the music
            setFMODMusic(1);
            console.log("setting music");
            startedmusic = true;
            if(newsky){
              newsky = false;
              setTimeout(function(){
			    console.log("switching sky");
                //document.querySelector('a-sky').setAttribute('src', '#morning');
                beTransparent(document.querySelector('#menusky'));
                beOpaque(document.querySelector('#morningsky'));
                /*beTransparent(document.querySelector('a-sky'));
                beOpaque(document.querySelector('a-sky'));*/

                ////CHANGING LIGHTS///////////////////////////////////////////////////
                document.querySelector('#mainDirLight').setAttribute('color', '#f3cec6');
                document.querySelector('#mainDirLight').setAttribute('intensity', '0.6');
                document.querySelector('#directionaltarget').setAttribute('position', '-1 0 0');
                document.querySelector('#mainAmbiantLight').setAttribute('light', 'type: ambient; color: #312980');
                ///////////////////////////////////////////////////
                }, 1000);
            }
          }

          break;

         case MORNING_GESTURE:
          if(switched){
            this.instruction.setAttribute('position','0 -0.3 -1');
            this.instruction.setAttribute('geometry', 'height', '0.75');
            this.instruction.setAttribute('geometry', 'width', '1.5');
            this.instruction.setAttribute('visible', 'true');
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            switched = false;
            this.textfield.setAttribute('visible','false');
            this.gestureChecker.oldZ = document.querySelector('a-entity[camera]').getAttribute('rotation').z;
            this.currentFigure = this.gestureChecker.turnaround.bind(this.gestureChecker);
            document.querySelector('[camera]').addEventListener('componentchanged', this.currentFigure, false);
          }else{
            if(this.gestureChecker.gesture_succeeded){
                clearTimeout(this.timer);
                console.log("gesture succeeded");
                document.querySelector('[camera]').removeEventListener('componentchanged', this.currentFigure, false);
                this.gestureChecker.reset();
                //Rotate the plane
                this.plane.emit('turnover', null, false);
                //this.plane.components.facecamera.setreverse();
               // this.plane.setAttribute('facecamera', { initrotation:'0 180 270' });
                console.log("rotating plane");
                incState();
                newsky = true;

              }
          }

          break;



        case MIDDAY:
          if(switched){
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            switched = false;
            displayState(this.textfield);
            this.textfield.setAttribute('rotation','0 0 90');
            this.textfield.setAttribute('text','anchor', 'right');
            this.textfield.setAttribute('text','align', 'left');
            this.textfield.setAttribute('position','-0.3 0.75 -1');
            this.instruction.setAttribute('visible','false');
            this.instruction.setAttribute('material','color:white; side: front; shader:gif; src:url(assets/pictos/picto_vrille.gif) ; transparent:true; opacity:1; alphaTest: 0.5;');
            this.instruction.setAttribute('rotation','0 0 90');
            this.timer = setTimeout(endGame, GAME_LENGTH);
            //this.instruction.setAttribute('material','color:white; side: front; shader:gif; src:url(assets/pictos/picto_vrille.gif) ; transparent:true; opacity:1; alphaTest: 0.5;');
            //change affichage
            //affiche texte figure succès
            //reset timer
            setTimeout(incState, SCENE_LENGTH);
            //this.StateManager.incState();
            /*var skybox = this.el.sceneEl.querySelector('a-sky');
            skybox.querySelector('a-animation').setAttribute('direction', 'reverse');*/
            //console.log("animation direction " + skybox.querySelector('a-animation').getAttribute('direction'));
          }

          if(newsky){
            //change musique
            setFMODMusic(2);
            newsky = false;
            setTimeout(function(){
			        console.log("switching sky");
              //document.querySelector('a-sky').setAttribute('src', '#midday');
                beTransparent(document.querySelector('#morningsky'));
                beOpaque(document.querySelector('#middaysky'));
              /*beTransparent(document.querySelector('a-sky'));
              beOpaque(document.querySelector('a-sky'));*/

              ////CHANGING LIGHTS///////////////////////////////////////////////////
              document.querySelector('#mainDirLight').setAttribute('color', '#e4f9ff');
              document.querySelector('#mainDirLight').setAttribute('intensity', '0.9');
              document.querySelector('#directionaltarget').setAttribute('position', '-1 0 1');
              document.querySelector('#mainAmbiantLight').setAttribute('light', 'type: ambient; color: #2d3339');
              ///////////////////////////////////////////////////
            }, 2000);
          }

          break;



        case MIDDAY_GESTURE:
          if(switched){
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            switched = false;
            this.instruction.setAttribute('position','0 -0.3 -1');
            this.instruction.setAttribute('geometry', 'height', '0.75');
            this.instruction.setAttribute('geometry', 'width', '1.5');
            this.instruction.setAttribute('visible', 'true');
            this.textfield.setAttribute('visible','false');
            this.gestureChecker.oldZ = this.gestureChecker.initOrientation.z;
            this.gestureChecker.oldX = this.gestureChecker.initOrientation.x;
            this.gestureChecker.checkpoint = [25, 70, 65, 35, -25, -65, -65, -25];
            this.gestureChecker.visitedcheckpoint = ["none", "none", "none", "none", "none", "none", "none", "none"];
            this.currentFigure = this.gestureChecker.vrille.bind(this.gestureChecker);
            //console.log(this.gestureChecker.initOrientation);
            document.querySelector('[camera]').addEventListener('componentchanged', this.currentFigure, false);
            //console.log("added gesture control");
          } else{
              if(this.gestureChecker.gesture_succeeded){
                //console.log("gesture succeeded");
               clearTimeout(this.timer); document.querySelector('[camera]').removeEventListener('componentchanged', this.currentFigure, false);
                this.gestureChecker.reset();
                incState();
                newsky = true;
              }
          }


          break;


        case STORM:
          if(switched){
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            switched = false;
            this.sceneEl.setAttribute('rain', {count: 1000});
            displayState(this.textfield);
            this.instruction.setAttribute('visible','false');
            this.instruction.setAttribute('material','color:white; side: front; shader:gif; src:url(assets/pictos/picto_looping.gif) ; transparent:true; opacity:1; alphaTest: 0.5;');
            //change affichage
            //affiche texte figure succès
            //reset timer
            setTimeout(incState, SCENE_LENGTH);
            this.timer = setTimeout(endGame, GAME_LENGTH);
            //this.StateManager.incState();
          }

          if(newsky){
            newsky = false;
            //change musique
            setFMODMusic(3);
            setTimeout(function(){
              //document.querySelector('a-sky').setAttribute('src', '#storm');
                beTransparent(document.querySelector('#middaysky'));
                beOpaque(document.querySelector('#stormsky'));
              /*beTransparent(document.querySelector('a-sky'));
              beOpaque(document.querySelector('a-sky'));*/

              ////CHANGING LIGHTS///////////////////////////////////////////////////
              document.querySelector('#mainDirLight').setAttribute('color', '#535353');
              document.querySelector('#mainDirLight').setAttribute('intensity', '0.2');
              document.querySelector('#directionaltarget').setAttribute('position', '0 0 1');
              document.querySelector('#mainAmbiantLight').setAttribute('light', 'type: ambient; color: #2c2c2c');
              ///////////////////////////////////////////////////
            }, 2000);
          }

          break;

          case STORM_GESTURE:
          if(switched){
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            this.instruction.setAttribute('position','0 -0.3 -1');
            this.instruction.setAttribute('geometry', 'height', '0.75');
            this.instruction.setAttribute('geometry', 'width', '1.5');
            this.instruction.setAttribute('visible', 'true');
            switched = false;
            this.textfield.setAttribute('visible','false');
            this.gestureChecker.checkpoint = [-170, -130, -85, -30, 0, 30, 85, 130, 170];
            this.gestureChecker.visitedcheckpoint = ["none", "none", "none", "none", "none", "none", "none", "none", "none"];
            this.gestureChecker.oldZ = this.gestureChecker.initOrientation.z;
            //console.log(this.gestureChecker.initOrientation);
            this.currentFigure = this.gestureChecker.looping.bind(this.gestureChecker);
            document.querySelector('[camera]').addEventListener('componentchanged', this.currentFigure, false);
            //console.log("added gesture control");
          } else{
              if(this.gestureChecker.gesture_succeeded){
                console.log("gesture succeeded");
                clearTimeout(this.timer);
                document.querySelector('[camera]').removeEventListener('componentchanged', this.currentFigure, false);
                this.gestureChecker.reset();
                incState();
                newsky = true;
              }
          }

          break;



        case SUNSET:
          if(switched){
            switched = false;
            this.sceneEl.setAttribute('rain', {count:0});
            this.instruction.setAttribute('visible','false');
            this.instruction.setAttribute('material','color:white; side: front; shader:gif; src:url(assets/pictos/picto_eight.gif) ; transparent:true; opacity:1; alphaTest: 0.5;');
            //change affichage
            displayState(this.textfield);
            //affiche texte figure succès
            // reset timer
            setTimeout(incState, SCENE_LENGTH);
            this.timer = setTimeout(endGame, GAME_LENGTH);

          }
          if(newsky){
            newsky = false;
            //change musique
            setFMODMusic(4);
            setTimeout(function(){
              //document.querySelector('a-sky').setAttribute('src', '#sunset');
                beTransparent(document.querySelector('#stormsky'));
                beOpaque(document.querySelector('#sunsetsky'));
              /*beTransparent(document.querySelector('a-sky'));
              beOpaque(document.querySelector('a-sky'));*/

              ////CHANGING LIGHTS///////////////////////////////////////////////////
              document.querySelector('#mainDirLight').setAttribute('color', '#fec168');
              document.querySelector('#mainDirLight').setAttribute('intensity', '0.6');
              document.querySelector('#directionaltarget').setAttribute('position', '1 0 0');
              document.querySelector('#mainAmbiantLight').setAttribute('light', 'type: ambient; color: #663380');
              ///////////////////////////////////////////////////
            }, 1600);
          }

          break;


        case SUNSET_GESTURE:
          if(switched){
            console.log("current state :" + STATES_NAMES[c_state] + " switched :"+ switched);
            switched = false;
            this.instruction.setAttribute('position','0 -0.3 -1');
            this.instruction.setAttribute('geometry', 'height', '0.75');
            this.instruction.setAttribute('geometry', 'width', '1.5');
            this.instruction.setAttribute('visible', 'true');
            this.textfield.setAttribute('visible','false');
            this.gestureChecker.oldZ = document.querySelector('a-entity[camera]').getAttribute('rotation').z;
            this.currentFigure = this.gestureChecker.eight.bind(this.gestureChecker);
            document.querySelector('[camera]').addEventListener('componentchanged', this.currentFigure, false);
          }else{
            if(this.gestureChecker.gesture_succeeded){
                console.log("gesture succeeded");
                clearTimeout(this.timer); document.querySelector('[camera]').removeEventListener('componentchanged', this.currentFigure, false);
                this.gestureChecker.reset();
                incState();
                newsky = true;
              }
          }


          break;


        case NIGHT:
          if(switched){
            switched = false;
            //change affichage
            displayState(this.textfield);
            this.instruction.setAttribute('visible','false');
            //affiche texte figure succès
            // reset timer
            setTimeout(incState, SCENE_LENGTH);
          }
          if(newsky){
            newsky = false;
            //change musique
            setFMODMusic(5);
            setTimeout(function(){
              //document.querySelector('a-sky').setAttribute('src','#night');
                beTransparent(document.querySelector('#sunsetsky'));
                beOpaque(document.querySelector('#nightsky'));
              /*beTransparent(document.querySelector('a-sky'));
              beOpaque(document.querySelector('a-sky'));*/

              ////CHANGING LIGHTS///////////////////////////////////////////////////
              document.querySelector('#mainDirLight').setAttribute('color', '#7ea09f');
              document.querySelector('#mainDirLight').setAttribute('intensity', '0.1');
              document.querySelector('#directionaltarget').setAttribute('position', '0 0 1');
              document.querySelector('#mainAmbiantLight').setAttribute('light', 'type: ambient; color: #100e1b');
              ///////////////////////////////////////////////////
            }, 1600);
          }

          break;


        case NIGHT_GESTURE:
          if(switched){
            switched = false;
            this.textfield.setAttribute('visible','false');
            //beTransparent(document.querySelector('a-sky'));
            incState();
          }

          break;


        case GAMEOVER:
          if(switched){
            //change musique
            setFMODMusic(6);
            switched = false;
            this.instruction.setAttribute('visible','false');
            //do something cause the game is over now
            // for proto purpose just display gameOver HUD ???
            displayState(this.textfield);
            var skybox = this.el.sceneEl.querySelector('a-sky');
            skybox.querySelector('a-animation').setAttribute('dur', 0);
            skybox.querySelector('a-animation').setAttribute('repeat', 0);
            this.plane.removeAttribute('facecamera');
            this.plane.emit('theend', null, false);
            this.sceneEl.querySelector('#finalscreen').emit('theend', null, false);
            this.sceneEl.querySelector('[camera]').removeAttribute('look-controls');
            this.textfield.emit('theend', null, false);
            this.plane.removeAttribute('facecamera');
            window.removeEventListener('touchend', gofullscreen);
          }

          break;

        case END_GAME:
          if(switched){
            //change musique
            setFMODMusic(6);
            switched = false;
            this.instruction.setAttribute('visible','false');
            //do something cause the game is over now
            // for proto purpose just display gameOver HUD ???
            displayState(this.textfield);
            var skybox = this.el.sceneEl.querySelector('a-sky');
            skybox.querySelector('a-animation').setAttribute('dur', 0);
            skybox.querySelector('a-animation').setAttribute('repeat', 0);
            this.plane.removeAttribute('facecamera');
            this.plane.emit('theend', null, false);
            this.sceneEl.querySelector('#finalscreen').emit('theend', null, false);
            this.sceneEl.querySelector('[camera]').removeAttribute('look-controls');
            this.textfield.emit('theend', null, false);
            this.plane.removeAttribute('facecamera');
          }

          break;
      }
    }


  },

  remove:function(){
      console.log("Error main has been removed");
  },
});
