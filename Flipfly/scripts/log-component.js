AFRAME.registerComponent('main', {
  schema=:{},

  multiple : false,


  init:{

    //game design globals
    this.scene_length = 15000;

    //coding globals
    this.states= {
      MENU:'menu',
      MORNING:'morning',
      MORNING_GESTURE:'morning gesture',
      MIDDAY: 'midday',
      MIDDAY_GESTURE: 'midday gesture',
      SUNSET: 'sunset',
      SUNSET_GESTURE: 'sunset gesture',
      NIGHT: 'night',
      NIGHT_GESTURE: 'night gesture',
      GAMEOVER: 'game over'
    };

    this.c_state = states.MORNING;
    this.p_state = states.MENU;
    this.timer = 0;
  },

  tick: function(){

  }
});




function incState(){
  c_state ++;
}

function displayState(){
  console.log("" + c_state);
}

//fonction affichage de texte (paramètres : texte, position, temps d'affichage (optionnel si non donné temps d'affichage infini))
//fonction change musique
//fonction change affichage
//fonction cache texte
//fonction gesture_state (prend en paramètre +1 ou -1, le nombre d'état, retourne true quand l'état final est atteint, false sinon)


while(c_state != states.GAMEOVER){
  switch(c_state){
    case states.MENU:
      //not implemented in the proto thingy
      break;
    case states.MORNING:
      if(p_state == states.MENU){
        displayState();
        //change affichage
        //change musique
        //affiche texte figure succès
        //reset timer
        timeoutID = setTimeout(incState(), scene_length);
      }
      break;
    case states.MORNING_GESTURE:
      displayState();
      incState();
      break;
    case states.MIDDAY:
      if(p_state == states.MORNING_GESTURE){
        displayState();
        //change affichage
        //change musique
        //affiche texte figure succès
        //reset timer
        timeoutID = setTimeout(incState(), scene_length);
      }
      break;
    case states.MIDDAY_GESTURE:
      displayState();
      incState();
      break;
    case states.SUNSET:
      if(p_state == states.MIDDAY_GESTURE){
        displayState();
        //change affichage
        //change musique
        //affiche texte figure succès
        // reset timer
        timeoutID = setTimeout(incState(), scene_length);

      }
      break;
    case states.SUNSET_GESTURE:
      displayState();
      incState();
      break;
    case states.NIGHT:
      if(p_state == states.SUNSET_GESTURE){
        displayState();
        //change affichage
        //change musique
        //affiche texte figure succès
        // reset timer
        timeoutID = setTimeout(incState(), scene_length);
      }
      break;
    case states.NIGHT_GESTURE:
      displayState();
      incState();
      break;
    default:
      displayState();
      break;
  }
  p_state = c_state;
}

if(c_state == GAMEOVER && p_state == states.NIGHT_GESTURE){
  //do something cause the game is over now
  // for proto purpose just display gameOver HUD ???
  displayState();
}

