let videoIntro = document.getElementById('videointro');
let videoLoop = document.getElementById('videoloop');
let startButton = document.getElementById('startbutton');

videoIntro.addEventListener('ended', onIntroEnded ,false);
function onIntroEnded(e) {
    videoIntro.style.opacity = 0;
    videoLoop.play();
    startButton.style.opacity = 1; // animation (exemple : tweenmax)
}

startButton.addEventListener('click', onStartClick ,false);
function onStartClick(e) {
    TweenMax.to(startButton.parentNode, .7, {css:{opacity:0}});
    setTimeout(function() {
        startButton.parentNode.style.display = "none"}
        , 700);
    // startButton.parentNode.style.display = "none";
}

setInterval(function() {
    startButton.style.opacity
},1)



function hilightLine(lineGroup) {
    lineGroup.children[0].material.color =[0.9,0.95,1];
}
function endHilightLineConsom() {
    linesGroupConsom.children[0].material.color = [0.0196, 0.1765, 1]; // Back to 0x052dff
}
function endHilightLinePop() {
    linesGroupPop.children[0].material.color = [0.2422, 0.5898, 1]; // Back to 0x3E97FE
}
function endHilightLineAccess() {
    linesGroupAccess.children[0].material.color = [0.1836, 0.1719, 0.6328]; // Back to 0x2F2CA2
}