var getQuote = function() {
  // perform AJAX request to quotes api
  $.ajax({
    url: 'http://api.icndb.com/jokes/random',
    type: 'GET',
    success: function(response) {
      var quote = response.value.joke;
      var message = {
        username : "Chuck Norris",
        text: quote,//.split("").reverse().join(""),
        roomname: "Everywhere"
      };
      app.send(message);
    },
    error: function() {
      console.log('quote not retrieved');
    },
    dataType: "jsonp"
  });
};

setInterval(getQuote, 60000);






