// var messageCount = 0;
var lastCreated = '2015-02-17T00:33:32.494Z';

var cleanData = function(unsafe) {
  unsafe = unsafe || 'NA';
  return he.encode(unsafe);
};

var displayMessages = function(messages) {
  var $messageList = $('#message-list');

  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var username = cleanData(message.username);
    var text = cleanData(message.text);
    var messageDiv =
      '<div class="message"><span class="username">' +
        username + '</span>' + text + '</div>';
    $messageList.prepend(messageDiv);
  }
};

var getNewMessages = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: 'order=-createdAt&where={"createdAt":{"$gte":"' + lastCreated + '"}}',
    success: function(response) {
      var messages = response.results;
      lastCreated = messages[0].createdAt;
      displayMessages(messages);
    },
    error: function() {
      console.log('chatterbox: Failed to get message');
    }
  });
};

setInterval(getNewMessages, 5000);

