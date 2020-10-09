$ (function () {
  console.log ('chess_p30_site: document ready');
  var board = null;
  var promoting = false;
  var game = new Chess ();
  var $status = $ ('#status');
  // var $fen = $ ('#fen');
  let pgn = [];
  var $pgn = $ ('#pgn-list');
  var promotion_dialog = $ ('#promotion-dialog');

  function takeBack () {
    const move = game.undo_move ();
    updateBoard (board);
  }
  function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over ()) return false;

    // only pick up pieces for the side to move
    if (
      (game.turn () === 'w' && piece.search (/^b/) !== -1) ||
      (game.turn () === 'b' && piece.search (/^w/) !== -1)
    ) {
      return false;
    }
  }

  // var testFEN = '8/3P3P/8/1k6/8/6K1/1p1p4/8 w - - 0 1';

  // function testPosition() {
  //     game = new Chess(testFEN);
  //     board.position(testFEN);
  // }

  function getImgSrc (piece) {
    return config.pieceTheme.replace (
      '{piece}',
      game.turn () + piece.toLocaleUpperCase ()
    );
  }
  var promotion_piece = 'Q';

  function choose_promotion (color) {
    $ ('#promotion-popup').dialog ({
      modal: true,
    });
    return $ ("input[name='promo']:checked").val ();
  }

  var onDrop = function (source, target) {
    move_cfg = {
      from: source,
      to: target,
      promotion: 'q',
    };

    // check we are not trying to make an illegal pawn move to the 8th or 1st rank,
    // so the promotion dialog doesn't pop up unnecessarily
    // e.g. (p)d7-f8
    var move = game.move (move_cfg);
    // illegal move
    if (move === null) {
      return 'snapback';
    } else {
      game.undo (); //move is ok, now we can go ahead and check for promotion
    }

    // is it a promotion?
    var source_rank = source.substring (2, 1);
    var target_rank = target.substring (2, 1);
    var piece = game.get (source).type;

    if (
      piece === 'p' &&
      ((source_rank === '7' && target_rank === '8') ||
        (source_rank === '2' && target_rank === '1'))
    ) {
      promoting = true;

      // get piece images
      $ ('.promotion-piece-q').attr ('src', getImgSrc ('q'));
      $ ('.promotion-piece-r').attr ('src', getImgSrc ('r'));
      $ ('.promotion-piece-n').attr ('src', getImgSrc ('n'));
      $ ('.promotion-piece-b').attr ('src', getImgSrc ('b'));

      //show the select piece to promote to dialog
      promotion_dialog
        .dialog ({
          modal: true,
          height: 46,
          width: 184,
          resizable: true,
          draggable: false,
          close: onDialogClose,
          closeOnEscape: false,
          dialogClass: 'noTitleStuff',
        })
        .dialog ('widget')
        .position ({
          of: $ ('#board'),
          my: 'middle middle',
          at: 'middle middle',
        });
      //the actual move is made after the piece to promote to
      //has been selected, in the stop event of the promotion piece selectable
      return;
    }
    // no promotion, go ahead and move
    move = makeMove (game, move_cfg);
    updateStatus (move);
  };

  function makeMove (game, cfg) {
    // see if the move is legal
    var move = game.move (cfg);
    // illegal move
    if (move === null) return 'snapback';
    return move;
  }

  function updateBoard (board, move) {
    board.position (game.fen (), false);
    updateStatus (move);
    promoting = false;
  }

  var onDialogClose = function () {
    // console.log(promote_to);
    move_cfg.promotion = promote_to;
    move = makeMove (game, move_cfg);
    updateBoard (board, move);
  };

  function onSnapEnd () {
    //if promoting we need to select the piece first
    if (promoting) return;
    board.position (game.fen ());
  }

  function update_PGN () {
    game.white (clock.player_white);
    game.black (clock.player_black);
    updateStatus ();
  }

  function updateStatus (move) {
    var status = '';
    if (move) {
      clock.start (move.color === 'w' ? 'black' : 'white');
    }
    let pgn = game.pgn ();
    let index = pgn.search (/]\s*1./); // End of PGN headers
    let movepairs;
    if (index >= 0) {
      let moves_str = pgn.substring (index + 1);
      moves_str = moves_str.replace ('B', 'D'); // P30: DragonBishop symbol
      movepairs = moves_str.split (/\d\./).slice (1);
    }
    $pgn.empty ();
    const header = game.header ();
    for (const tag in header) {
      if (tag === 'FEN') continue; // We already have the 'StartPosition' tag
      $pgn.append (`<li class="pgntag">[${tag} "${header[tag]}"]</li>`);
    }
    if (movepairs)
      for (let i = 1; i <= movepairs.length; i++) {
        $pgn.append (`<li class = "pgnmove">${i}. ${movepairs[i - 1]}</li>`);
      }
    $ ('li', $pgn).last ()[0].scrollIntoView (false);

    let turn = game.turn () == 'w' ? 'White' : 'Black';

    // checkmate?
    if (game.in_checkmate ()) {
      status = 'Game over, ' + turn + ' is checkmated!';
    } else if (game.in_draw ()) {
      // draw?
      status = 'Game over, draw!';
    } else {
      // game still on
      status = turn + ' to move';

      // check?
      if (game.in_check ()) {
        status += ' - ' + 'check!';
      }
    }
    $status.html (status);
    // TBD: just return status string
  }

  function set_header () {
    function dateStr () {
      var date = new Date ();
      var yyyy = date.getFullYear ();
      var mm = date.getMonth () + 1;
      var dd = date.getDate ();
      if (mm < 10) {
        mm = '0' + mm;
      }
      if (dd < 10) {
        dd = '0' + dd;
      }
      return yyyy + '/' + mm + '/' + dd;
    }
    game.header (
      'Site',
      'ParadigmChess30',
      'Date',
      dateStr (),
      'White',
      game.white (),
      'Black',
      game.black (),
      'SetUp',
      '1',
      'StartPos',
      game.fen_p30 ()
    );
  }

  var config = {
    pieceTheme: 'img/chesspieces/paradigm30/{piece}.png',
    draggable: true,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    moveSpeed: 1,
    snapBackSpeed: 1,
    snapSpeed: 1,
    trashSpeed: 1,
  };

  function newGame (fen) {
    console.log ('newGame() called');
    game = new Chess (fen);
    moveNumber = 1;
    board.position (game.fen (), false); // No animation
    set_header ();
    updateStatus ();
    return game;
  }

  console.log ('Start chessboard init');

  board = Chessboard ('myBoard', config);
  game = newGame ();
  // Since we're all loaded, reveal the html
  $ ('body').css ('display', 'initial');
  console.log ('End chessboard init');

  // init promotion piece dialog
  $ ('#promote-to').selectable ({
    stop: function () {
      $ ('.ui-selected', this).each (function () {
        var selectable = $ ('#promote-to li');
        var index = selectable.index (this);
        if (index > -1) {
          var promote_to_html = selectable[index].innerHTML;
          var span = $ ('<div>' + promote_to_html + '</div>').find ('span');
          promote_to = span[0].innerHTML;
        }
        promotion_dialog.dialog ('close');
        $ ('.ui-selectee').removeClass ('ui-selected');
        // updateBoard(board);
      });
    },
  });
  console.log ('End of document ready function');
  // Crude export mechanism - TBD!
  window.newGame = newGame;
  window.takeBack = takeBack;
  window.update_PGN = update_PGN;
});
