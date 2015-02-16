var displayMessages = function(response) {
  var messages = response.results;
  var $messageList = $('#message-list');

  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var messageDiv =
      '<div class="message"><span class="username">' +
        message.username + '</span>' + message.text +
      '</div>';
    $messageList.append(messageDiv);
  }
};

var getMessages = function() {
  $.get('https://api.parse.com/1/classes/chatterbox', displayMessages);
};

