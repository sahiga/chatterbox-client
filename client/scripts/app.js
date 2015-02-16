var cleanData = function(unsafe) {
  unsafe = unsafe || 'NA';
  return he.encode(unsafe);
};

var displayMessages = function(response) {
  var messages = response.results;
  var $messageList = $('#message-list');

  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var username = cleanData(message.username);
    var text = cleanData(message.text);
    var messageDiv =
      '<div class="message"><span class="username">' +
        username + '</span>' + text +
      '</div>';
    $messageList.append(messageDiv);
  }
};

var getMessages = function() {
  $.get('https://api.parse.com/1/classes/chatterbox', displayMessages);
};

getMessages();
