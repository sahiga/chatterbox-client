var app = {
  lastCreated: '2015-02-17T00:50:32.494Z',
  currentRoom: undefined,

  init: function() {
    var context = this;
    setInterval(function() {
      context.fetch();
    }, 2000);

    // add interactivity
    $('#send-message').click(this.send);
    // Add click handler to room name in each message
    $(document).on('click', '.roomname', function() {
      var name = $(this).text();
      console.log(name);
      context.filterRoom(name);
    });
  },

  cleanData: function(unsafe) {
    unsafe = unsafe || 'NA';
    return he.encode(unsafe);
  },

  displayMessages: function(messages) {
    var context = this;
    var $messageList = $('#chats');

    // iterate through message array (containing message objects)
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      var username = this.cleanData(message.username);
      var text = this.cleanData(message.text);
      var roomname = this.cleanData(message.roomname);
      var messageDiv =
        '<div class="message">' +
          '<div class="row">' +
            '<div class="col6">' +
              '<a class="username">' + username + '</a>' +
            '</div>' +
            '<div class="col6 text-right">' +
              '<a class="roomname">' + roomname + '</a>' +
            '</div>' +
          '</div>' +
          '<p class="text">' + text + '</p>' +
        '</div>';
      $messageList.prepend(messageDiv);
    }


  },

  fetch: function() {
    var context = this;

    var where = {
      createdAt: {
        '$gt': context.lastCreated
      }
    };
    // extend where defaults
    if (context.currentRoom !== undefined) {
      _.extend(where, {roomname: context.currentRoom});
    }

    var data = {
      order: '-createdAt',
      where: where
    };

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: data,
      success: function(response) {
        var messages = response.results;

        if (messages[0] !== undefined) {
          context.lastCreated = messages[0].createdAt; // get most up-to-date timestamp
        }

        context.displayMessages(messages);
      },
      error: function() {
        console.log('chatterbox: Failed to get message');
      }
    });
  },

  send: function(message) {
    console.log("Sent!");

    var defaults = {
      username : $('#user').val(),
      text: $('#message').val(),
      roomname: $('#room').val()
    };

    var message = message || defaults;

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
  },

  clearMessages: function() {
    var $chats = $('#chats');
    $chats.children().remove();
  },

  addRoom: function(roomName) {
    var $roomSelect = $('#roomSelect');
    $roomSelect.append('<option>' + roomName + '</option>');
  },

  filterRoom: function(roomName) {
    this.clearMessages();
    this.currentRoom = roomName;
    this.fetch();
  }
};

$(document).ready(function(){
  app.init();
});




