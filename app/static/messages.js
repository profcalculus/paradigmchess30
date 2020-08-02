
const username = $ ('#username').val ();
const room = $ ('#roomname').val ();

var socket; // socket will be connected on login

socket.on ('connect', function () {
    let msg_json = {'from':username,'to':'lobby', 'text':
    `${username} has connected.`, 'tag':false};
    socket.emit('chat', msg_json);
  }
);

socket.on ('chat', function (msg_json) {
    let text = msg_json.message;
    if (msg_json.tag) {
        text = `<${msg_json.from}>: `+ text;
      }
    // Try to find a chat panel on the current page
    // Lobby chat?
    if (current_room == 'lobby') {
    let panel = $('#lobby-chat-panel');
    if (panel !== undefined) {
        panel.add_line(text);
    }
   } else if (current_room.startsWith('game') {
        // In-game chat?
    let panel = $('#game-chat-panel');
    if (panel !== undefined && current_game.is_player(msg_json.to)) {
        panel.add_line(text);
    }
    }; 
    /// If neither panel is found, do not display message
    console.log(`No destination found for chat: ${msg_json}`)
});


// TBD: - here or chat.js???
function add_chat_line (text) {
  $ ('#chat-list').append (`<li>${text}</li>`);
}
// event handler when ENTER is pressed on the chat input field
chat_form.onsubmit = function () {
    socketio.emit ('chat', {
      'from': current_user.username, 'to': '', 'text': this.value});
    this.value = '';
  };
  
  // the server is sending a message to display in the chat window
  socketio.on ('message', function (message) {
    msg = document.createElement ('p');
    if (message.user) {
      // this is a message written by a user
      msg.innerHTML =
        '<span class="user">' +
        message.user +
        '</span>: ' +
        '<span class="message">' +
        message.message +
        '</span>';
    } else {
      // this is a control message that comes from the server itself
      msg.innerHTML =
        '<span class="control-message">' + message.message + '</span>';
    }
    chat_field.appendChild (msg);
    chat_field.scrollTop = chat.scrollHeight; // scroll to bottom
  });
  
  
  socketio.on ('move', function (game_json) {
    let target_demo = DEMO_MAPPINGS[game_json.game_id];
    if (target_demo) {
      target_demo.fen (game_json.fen);
    }
    if (current_game !== null) {
      current_game.fen (game_json.fen);
      if (current_game.game_over) {
        current_game.clock.stop();
      } else {
        current_game.clock.start (next_player);
      };
      if (pgn) {
        pgn.add_move (game_json.move);
        if (game_over) {
          pgn.add_move (game_json.result);
        }
    }
}
  