$(document).ready(function() {

      $('#rectListener').on('click', function() {
          resetThumbnailsDisplay();
      });
      $('.this').not('.nb').on('click', function() {
          resetThumbnailsDisplay();
      });

    $('.categories .illus').on('click', function() {
      if ($(this).hasClass('activ')) {
        $('.thumbnail').not('.illus').toggleClass('hidden');
        $('.works .illus').removeClass('hidden');
      }else{
        $('.thumbnail .illus').not('.nb').removeClass('hidden');
        $('.thumbnail').not('.illus').addClass('hidden');
      }
      $(this).toggleClass('activ');
      $('.categories p').not(this).removeClass('activ');
      $('.works .illus').removeClass('hidden');
    });

    $('.categories .photo').on('click', function() {
      if ($(this).hasClass('activ')) {
        $('.thumbnail').not('.photo').toggleClass('hidden');
        $('.works .photo').removeClass('hidden');
      }else{
        $('.thumbnail .photo').not('.nb').removeClass('hidden');
        $('.thumbnail').not('.photo').addClass('hidden');
      }
      $(this).toggleClass('activ');
      $('.categories p').not(this).removeClass('activ');
      $('.works .photo').removeClass('hidden');
    });

    $('.categories .design').on('click', function() {
      if ($(this).hasClass('activ')) {
        $('.thumbnail').not('.design').toggleClass('hidden');
        $('.works .design').removeClass('hidden');
      }else{
        $('.thumbnail .design').not('.nb').removeClass('hidden');
        $('.thumbnail').not('.design').addClass('hidden');
      }
      $(this).toggleClass('activ');
      $('.categories p').not(this).removeClass('activ');
      $('.works .design').removeClass('hidden');
    });

    $('.categories .code').on('click', function() {
      if ($(this).hasClass('activ')) {
        $('.thumbnail').not('.code').toggleClass('hidden');
        $('.works .code').removeClass('hidden');
      }else{
        $('.thumbnail .code').not('.nb').removeClass('hidden');
        $('.thumbnail').not('.code').addClass('hidden');
      }
      $(this).toggleClass('activ');
      $('.categories p').not(this).removeClass('activ');
      $('.works .code').removeClass('hidden');
    });
    
    function resetThumbnailsDisplay() {
      $('.thumbnail').removeClass('hidden');
      $('.categories p').removeClass('activ');
    }


    /*GOLD COLOR
    rgb(198,150,20)
    rgb(235,209,90)
    rgb(255,255,255)
    */

    $('.thumbnail').not('.this').magnificPopup({
        type: 'ajax',
        // Delay in milliseconds before popup is removed
        removalDelay: 500,
        // Class that is added to popup wrapper and background
        // make it unique to apply your CSS animations just to this exact popup
        mainClass: 'mfp-fade',
        // other options
        fixedContentPos: true
    });

});
