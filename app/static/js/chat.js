let add_chat = function (chat_json, css_class) {
  let render_chat = function (chat_json, css_class, $chat_list) {
    let text = chat_json.text;
    if (chat_json.from) {
      text = `[${chat_json.from}]: ` + text;
    }
    let tag;
    if (css_class !== undefined) {
      tag = `<li class="${css_class}">`;
    } else {
      tag = '<li>';
    }
    $chat_list.append (`${tag}${text}</li>`);
    // Scroll up
    $ ('li', $chat_list).last ()[0].scrollIntoView (false);
  };
  let $chat_list;
  if (current_room.startsWith ('game_')) {
    $chat_list = $ ('#game-chat-list');
    if (current_game.isPlayer (chat_json.to)) {
      // Only the relevant players should see a game chat
      render_chat (chat_json, css_class, $chat_list);
    }
  } else if (current_room === 'lobby') {
    $chat_list = $ ('#lobby-chat-list');
    render_chat (chat_json, css_class, $chat_list);
  }
};

// let send_chat = function(text) {
//     let target =
//     let chat_json = {
//         'from': current_user.username,
//         'text': text,
//         'to':
//     }
// }
