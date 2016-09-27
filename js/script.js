

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
    $('.categories .illus').click(function() {
        $('.thumbnail').fadeTo('fast', 0.2);
        $('.works .illus').fadeTo(0, 1);
    });
    $('.categories .photo').click(function() {
        $('.thumbnail').fadeTo('fast', 0.2);
        $('.works .photo').fadeTo(0, 1);
    });
    $('.categories .design').click(function() {
        $('.thumbnail').fadeTo('fast', 0.2);
        $('.works .design').fadeTo(0, 1);
    });
    $('.categories .code').click(function() {
        $('.thumbnail').fadeTo('fast', 0.2);
        $('.works .code').fadeTo(0, 1);
    });
    $('#logo').click(function() {
        $('.thumbnail').fadeTo('fast', 1);
    });




    $('.test').magnificPopup({
  type: 'ajax'
  // other options
});
});
