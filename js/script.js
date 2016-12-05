
$(document).ready(function() {

  // var categories = ['.illus', '.photo', '.design', '.code'];
  //
  // for (var i = 0 ; i < 4 ; i++) {
  //   $('.categories ' + categories[i]).click(function() {
  //   /*    $('.thumbnail').fadeTo('fast', 0.2);
  //       $('.works ' + categories[i]).fadeTo(0, 1);  */
  //       console.log('categories[i] est : ' + categories[i]);
  //   });
  // }

  // ------------ Utiliser un add class selected ou deselected ou autre
  // ------------ pour animer les styles en CSS, plutot qu'en jQuery

    $('.thumbnail').ready(function() {
        $('.thumbnail .mask').fadeTo('fast', 0);
    });

    $('.categories .illus').click(function() {
        $('.categories p').not(this).css('text-shadow','none');
        $('.categories p').not(this).css('color','#222');
        $(this).css('text-shadow','0px 0px 9px #000, 0px 2px 4px #000');
        $(this).css('color','#fff');
        $('.thumbnail .mask').not('.illus .mask').fadeTo('fast', 1);
        $('.works .illus .mask').fadeTo('fast', 0);
    });
    $('.categories .photo').click(function() {
        $('.categories p').not(this).css('text-shadow','none');
        $('.categories p').not(this).css('color','#222');
        $(this).css('text-shadow','0px 0px 9px #000, 0px 2px 4px #000');
        $(this).css('color','#fff');
        $('.thumbnail .mask').not('.photo .mask').fadeTo('fast', 1);
        $('.works .photo .mask').fadeTo('fast', 0);
    });
    $('.categories .design').click(function() {
        $('.categories p').not(this).css('text-shadow','none');
        $('.categories p').not(this).css('color','#222');
        $(this).css('text-shadow','0px 0px 9px #000, 0px 2px 4px #000');
        $(this).css('color','#fff');
        $('.thumbnail .mask').not('.design .mask').fadeTo('fast', 1);
        $('.works .design .mask').fadeTo('fast', 0);
    });
    $('.categories .code').click(function() {
        $('.categories p').not(this).css('text-shadow','none');
        $('.categories p').not(this).css('color','#222');
        $(this).css('text-shadow','0px 0px 9px #000, 0px 2px 4px #000');
        $(this).css('color','#fff');
        $('.thumbnail .mask').not('.code .mask').fadeTo('fast', 1);
        $('.works .code .mask').fadeTo('fast', 0);
    });

    // $('#rectListener').click(function() {
    //     // $('.thumbnail').fadeTo('fast', 1);
    //     $('.categories p').css('text-shadow','none');
    //     $('.categories p').css('color','#222');
    //     $('.mask').fadeTo('fast', 0);
    // });




    $('.thumbnail').not('.this').magnificPopup({
        type: 'ajax'
        // other options
    });

});








// Create cross browser requestAnimationFrame method:
window.requestAnimationFrame = window.requestAnimationFrame
 || window.mozRequestAnimationFrame
 || window.webkitRequestAnimationFrame
 || window.msRequestAnimationFrame
 || function(f){setTimeout(f, 1000/60)}

var scannerBg = document.getElementById('scanner')

var scrollheight = document.body.scrollHeight // height of entire document
var windowheight = window.innerHeight // height of browser window

function parallaxscanner(){
 var scrolltop = window.pageYOffset // get number of pixels document has scrolled vertically
 var scrollamount = (scrolltop / (scrollheight-windowheight)) * 100 // get amount scrolled (in %)
 scannerBg.style.backgroundPosition = '50% ' + Math.min(scrolltop*100/80, 100) + '%' // move bubble1 at 20% of scroll rate
 console.log(scrolltop);
}

window.addEventListener('scroll', function(){ // on page scroll
 requestAnimationFrame(parallaxscanner) // call parallaxscanner() on next available screen paint
}, false)

window.addEventListener('resize', function(){ // on window resize
 var scrolltop = window.pageYOffset // get number of pixels document has scrolled vertically
 var scrollamount = (scrolltop / (scrollheight-windowheight)) * 100 // get amount scrolled (in %)
}, false)
