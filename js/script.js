
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

  // ---------------- Utiliser un add class selected ou deselected ou autre
  // ---------------- pour animer les styles en CSS, plutot qu'en jQuery

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
