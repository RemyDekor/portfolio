$(document).ready(function() {

    $('.categories .illus').click(function() {
        $(this).toggleClass('activ');
        $('.categories p').not(this).removeClass('activ');
        $('.thumbnail').not('.illus').addClass('hidden');
        $('.works .illus').removeClass('hidden');
    });
    $('.categories .photo').click(function() {
        $(this).toggleClass('activ');
        $('.categories p').not(this).removeClass('activ');
        $('.thumbnail').not('.photo').addClass('hidden');
        $('.works .photo').removeClass('hidden');
    });
    $('.categories .design').click(function() {
        $(this).toggleClass('activ');
        $('.categories p').not(this).removeClass('activ');
        $('.thumbnail').not('.design').addClass('hidden');
        $('.works .design').removeClass('hidden');
    });
    $('.categories .code').click(function() {
        $(this).toggleClass('activ');
        $('.categories p').not(this).removeClass('activ');
        $('.thumbnail').not('.code').addClass('hidden');
        $('.works .code').removeClass('hidden');
    });
    function resetThumbnailsDisplay() {
      $('.categories p').removeClass('activ');
      $('.thumbnail').removeClass('hidden');
      alert('this runs');
    }

    $('#rectListener').on('click', function() {
        resetThumbnailsDisplay();
    });
    $('.this').not('.nb').on('click', function() {
        resetThumbnailsDisplay();
    });
    $('.categories').on('click', '.activ', function() {
        resetThumbnailsDisplay();
    });


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
