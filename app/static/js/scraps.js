  // Miscellaneous js code to be junked later
  
  
  // updateStatus (move) {
    // let status = '';
    // if (move && move.san) {
    //   // Put suitable "dragon-bishop" symbol here
    //   move.san = move.san.replace ('B', 'D');
    //   if (move.color === 'w') {
    //     current_san = current_san + moveNumber + '. ' + move.san;
    //     $pgn.append ('<li>' + current_san + '</li>');
    //   } else {
    //     current_san = current_san + '\t\t\t' + move.san;
    //     $ ('li', $pgn).last ().remove (); // Remove partial moves
    //     $pgn.append ('<li>' + current_san + '</li>'); // Replace with full moves
    //     current_san = '';
    //     moveNumber += 1;
    //   }
    //   // Auto-scroll
    //   $ ('li', $pgn).last ()[0].scrollIntoView (false);
    //   let player = game.turn () === 'w' ? 'White' : 'Black';

    //   // checkmate?
    //   if (game.in_checkmate ()) {
    //     status = 'Game over, ' + player + ' is checkmated!';
    //   } else if (game.in_draw ()) {
    //     // draw?
    //     status = 'Game over, draw!';
    //   } else {
    //     // game still on
    //     status = player + ' to move';

    //     // check?
    //     if (game.in_check ()) {
    //       status += ' - ' + 'check!';
    //     }
    //   }
    //   $status.html (status);
    //   fen = game.fen;
  // }
