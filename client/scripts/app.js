var app = {
  lastCreated: '2015-02-17T00:33:32.494Z',

  init: function() {
    var context = this;
    setInterval(function() {
      context.fetch();
    }, 5000);

    $('#send-message').click(this.send);
  },

  cleanData: function(unsafe) {
    unsafe = unsafe || 'NA';
    return he.encode(unsafe);
  },

  displayMessages: function(messages) {
    var $messageList = $('#chats');

    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      var username = this.cleanData(message.username);
      var text = this.cleanData(message.text);
      var messageDiv =
        '<div class="message"><span class="username">' +
          username + '</span>' + text + '</div>';
      $messageList.prepend(messageDiv);
    }
  },

  fetch: function() {
    var context = this;
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: 'order=-createdAt&where={"createdAt":{"$gte":"' + context.lastCreated + '"}}',
      success: function(response) {
        var messages = response.results;
        context.lastCreated = messages[0].createdAt; // get most up-to-date timestamp
        context.displayMessages(messages);
      },
      error: function() {
        console.log('chatterbox: Failed to get message');
      }
    });
  },

  send: function() {
    console.log("Sent!");
    var message = {
      username: $('#user').val(),
      text: $('#message').val(),
      roomname: $('#room').val()
    };

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function() {
        $('#status').text('Your message was successfully sent!')
                    .addClass('success');
      },
      error: function() {
        $('#status').text('Your message failed :(')
                    .addClass('failure');
      }
    });
  }
};

$(document).ready(function(){
  app.init();
});


