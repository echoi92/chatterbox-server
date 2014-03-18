// YOUR CODE HERE:
$(document).ready(function(){

  // we create the message to send
  var serverUrl = 'http://127.0.0.1:3000/messages';
  var aMessage = {
    roomname: '4chan',
    text: '',
    username: 'SuperAwesome'
  };

  /////////////////////////////////////
  // Set Url Server Test
  ///////////////////////////////////////
  $('.btn').on('click', function(e){
    e.preventDefault();
    serverUrl = $(this).data('server-url');
  });

  /////////////////////////////////////
  // post a messages on click
  ///////////////////////////////////////
  $('.postMessage').on('click', function(e){
    e.preventDefault();
    aMessage.text = $('.inputmessage').val();
    $('.inputmessage').val('');
    postMessage(serverUrl, aMessage);
  });

  /////////////////////////////////////
  // change Username
  ///////////////////////////////////////
  $('.changeUsername').on('click', function(e){
    e.preventDefault();
    aMessage.username = $('.inputusername').val();
    $('.inputusername').val('');
  });

  /////////////////////////////////////
  // chat room Switch
  // /////////////////////////////////////
  $('.chatRooms').on('click', '.roomname', function(e){
    e.preventDefault();
    $('.roomName').html($(this).text());
    aMessage.roomname = $(this).text();
  });

  /////////////////////////////////////
  // Create Chatroom
  // /////////////////////////////////////
  $('.createChatroom').on('click', function(e){
    e.preventDefault();
    aMessage.roomname = $('.inputchatroom').val();
    $('.inputmessage').val('');
  });

  setInterval(function(){
    getAllMessages(serverUrl, aMessage.roomname);
  },1000);

});

  /////////////////////////////////////
  // Display Chat rooms List
  // /////////////////////////////////////
  // var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
  // _.pluck(stooges, 'name');
  // => ["moe", "larry", "curly"]
var listChatRooms = function(allMessages){
  var allChatrooms = _.uniq(_.pluck(allMessages, 'roomname'));
  var $chatrooms = $('.chatRooms');
  var $html;

  _.each(allChatrooms, function (chatroom){
    $html += '<li><a href="#" class="roomname">' + chatroom + '</a></li>';
  });
  $chatrooms.html($html);
};

var filterMessages = function (allMessages, roomname){
  return _.filter(allMessages, function(message){
    return message.roomname === roomname;
  });
};

// All Functions
var displayMessages = function(filteredMessages, limit){
  // data is an object that contains an arrray of results
  var html ='';

    for(var i = 0; i < limit; i++){
      if(filteredMessages[i] !== undefined){
        html +=  '<div>'+ '<span><strong>' + filteredMessages[i]['username'] + '</strong></span> <span>' + filteredMessages[i]['text'] + '</span> <span>' + filteredMessages[i]['createdAt'] +'</span></div>';
      }
    }
  $('.innerChat').html(html);
};

var getAllMessages = function(url, filter){
  $.ajax({
    url: url,
    type: 'GET',
    // data: {
    //   order:'-createdAt'
    // },
    success: function (data){
      console.log('Data retrieved');
      // console.log(data);
       data = JSON.parse(data);
       var allMessages = data.results;
       console.log(allMessages);
       listChatRooms(allMessages);
       if(filter){
         var filteredMessages = filterMessages(allMessages, filter);
         displayMessages(filteredMessages, 15);
       }else{
         displayMessages(allMessages, 15);
       }
    },
    error: function (data) {
      console.log(data);
      console.error('Failed to retrieve Message');
    }
  });
};

var postMessage = function(url, message){
  $.ajax({
    // always use this url
    url: url,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};