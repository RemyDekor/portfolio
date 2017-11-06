var MINRPM = 3000;
var MAXRPM = 10000;

var lastTimestamp;
var speedX = 0;
var speedY = 0;
var speedZ = 0;

var curRPM = 4000;

var firstUpdated = false;

var dirforward = false;



var active = false;
// Registering component in foo-component.js
AFRAME.registerComponent('facecamera', {
  schema: {
    type:'vec3'
    //initrotation:{type:'vec3', default: { x: 0, y: 0, z: 270 } }
  },
  init: function () {
    //this.init_rotation = {x: this.el.getAttribute('rotation').x, y: this.el.getAttribute('rotation').y, z: this.el.getAttribute('rotation').z};
    this.has_started = false;
    this.delta = {x:0, y:0, z:0};
    this.updatetick = true;
    this.updateRPM = false;
    this.prevX = 0;
    this.el.addEventListener('active', function () {
        active = true;
    });
    console.log("face camera has been initiated with : ");
    console.log(this.data);
  },

  update:function(oldData){
    if(oldData != this.data){
      if(!firstUpdated){
        setTimeout(function(){ curRPM = 4500; }, 1000);
        firstUpdated = true;
        dirforward = true;
      }
    }
    console.log("value updated !");
    if(curRPM < 10000) curRPM = curRPM + 100;
  },

  tick: function () {
      if(active){
            var newX = document.querySelector('a-entity[camera]').getAttribute('rotation').x;
            var diffX = this.prevX - newX;
            var absX = (diffX < 0) ? (diffX * -1) : diffX;
            if(absX > 1 ){
              if(dirforward){
                this.el.setAttribute('rotation', {x: this.data.x,
                                                  y: this.data.y - newX, //- this.delta.x,
                                                  z: this.data.z});
              }
              else{
              this.el.setAttribute('rotation', {x: this.data.x,
                                                  y: this.data.y - newX, //- this.delta.x,
                                                  z: this.data.z});
              }
            }
            if(this.updateRPM){
              setFMODRPM(curRPM);
            }
            //console.log(this.data);
            this.prevX = document.querySelector('a-entity[camera]').getAttribute('rotation').x;
      }
  },





});
