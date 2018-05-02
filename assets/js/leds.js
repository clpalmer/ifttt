(function() {
  var ledId = '';
  
  $('#deleteLED').on('click', function(e) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", '/leds/' + ledId, true);
    xhr.onload = function () {
      window.location.reload();
    }
    xhr.send(null);
  });
  $('#deleteLEDConfirmationModal').on('show.bs.modal', function (e) {
    ledId = $(e.relatedTarget).data('led-id');
  });
})();