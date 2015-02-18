var app = {
  lastCreated: '2015-02-17T00:50:32.494Z',
  currentRoom: undefined,
  server: 'https://api.parse.com/1/classes/chatterbox',
  rooms: {},
  friends: {},

  init: function() {
    var context = this;
    setInterval(function() {
      context.fetch();
    }, 2000);

    var filterRoom = function() {
      var $element = $(this);
      var name =  $element.val() || $element.text();

      if (name === 'Global') {
        name = undefined;
      }

      context.filterRoom(name);
    };

    // add interactivity
    $('#send-message').click(function(e) {
      e.preventDefault();
      context.send();
    });
    // Add click handler to room name in each message
    $(document).on('click', '.roomname', filterRoom);
    $(document).on('change', '#roomSelect', filterRoom);
    $(document).on('click', '.username', function() {
      var friend = $(this).text();
      if (!(friend in context.friends)) {
        context.friends[friend] = true;
        $('#friends').append('<li class="friends-list-item">' + friend + '</li>');
        $(this).removeClass('enemy').addClass('friend');
      }
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
      var friendClass = 'enemy';
      var message = messages[i];
      var username = this.cleanData(message.username);
      var text = this.cleanData(message.text);
      var roomname = this.cleanData(message.roomname);

      if (username in this.friends) {
        friendClass = 'friend';
      }

      var messageDiv =
        '<div class="message">' +
          '<div class="row">' +
            '<div class="col6">' +
              '<a class="username ' + friendClass + '">' + username + '</a>' +
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

  addNewRooms: function(messages) {
    var $options = $('#roomSelect');
    for (var i = 0; i < messages.length; i++) {
      var room = this.cleanData(messages[i].roomname);

      if (!(room in this.rooms)) {
        var option = '<option>' + room + '</option>';
        $options.append(option);
        this.rooms[room] = true;
      }
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
      url: context.server,
      type: 'GET',
      data: data,
      success: function(response) {
        var messages = response.results;

        if (messages[0] !== undefined) {
          context.lastCreated = messages[0].createdAt; // get most up-to-date timestamp
        }
        context.addNewRooms(messages);
        context.displayMessages(messages);
      },
      error: function() {
        console.log('chatterbox: Failed to get message');
      }
    });
  },

  send: function(message) {
    var context = this;
    console.log("Sent!");

    var defaults = {
      username : $('#user').val(),
      text: $('#message').val(),
      roomname: $('#room').val()
    };

    console.log(typeof message);
    var message = message || defaults;

    $.ajax({
      url: context.server,
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




