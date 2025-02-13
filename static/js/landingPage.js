$(".js-chat-demo-form").on('submit', function(evt) {
  evt.preventDefault();
  var chatInput = $(evt.target).find('input');
  var chatDiv = $(".chat-div");
  var guestMessage = chatInput.val();

  $(".chat-text").append('<div class="clear chat"></div><div class="from-me chat"><p>' + guestMessage + '</p></div>');
  chatInput.val('');
  chatDiv.scrollTop(chatDiv[0].scrollHeight);

  $.get('/bot/public?message=' + guestMessage, function(botResponse) {
    $(".chat-text").append('<div class="clear chat"></div><div class="from-them chat"><p>' + botResponse + '</p></div>');
    chatDiv.scrollTop(chatDiv[0].scrollHeight);  
  });
});

$(".js-subscribe-form").on('submit', function(evt) {
  evt.preventDefault();
  var subscribeName =  $("#js-subscribe-box-name").val();
  var subscribeEmail =  $("#js-subscribe-box-email").val();
  $.post('/subscriber', {name: subscribeName, email: subscribeEmail});
  $("#js-subscribe-box-name").val('');
  $("#js-subscribe-box-email").val('');

  var subscribedDiv = $(".js-subscribed-msg");
  subscribedDiv.append('<h2 class="subscribed-msg">Thanks for signing up!</h2>');
});