(function() {
  var buttonId = '';
  
  $('#deleteButton').on('click', function(e) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", '/buttons/' + buttonId, true);
    xhr.onload = function () {
      window.location.reload();
    }
    xhr.send(null);
  });
  $('#deleteButtonConfirmationModal').on('show.bs.modal', function (e) {
    buttonId = $(e.relatedTarget).data('button-id');
  });
})();