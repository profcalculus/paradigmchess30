import {PromotionDialog} from './promotion_dialog';
import {PGN} from './pgn';

const username = $ ('#username').val ();

class Chessboard_P30 {
  // Class for the board (this.board) and the game logic (this.game)
  // Also creates this.pgn if this is not a demo board
  constructor (game_json) {
    this.id = `${game_json.id}`;
    this.board_id = `board${this.id}`;
    let promoting = false;
    this.game = new Chess (game_json.fen);
    switch(username) {
      case game_json.white: this.player_colour = 'white'; break;
      case game_json.black: this.player_colour = 'black'; break;
      default: this.player_colour = null;
    }
    if (this.player_colour !== null) {
      this.pgn = new PGN ('pgn', game_json.id);
    }
    this.moveNumber = 1;
    this.config = {
      position: game_json.fen,
      pieceTheme: '/static/img/chesspieces/paradigm30/{piece}.png',
    };
    if (player_colour !== null) {
      // 
      let extra_config = {
        draggable: true,
        onDragStart: this.onDragStart,
        onDrop: this.onDrop,
        onSnapEnd: this.onSnapEnd,
        orientation: this.player_colour,
      };
      this.config = {
        ...this.config,
        ...extra_config,
      };
    }
    this.board = new Chessboard (this.id, this.config);
  } // constructor

  onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (this.game.game_over ()) return false;

    // only pick up pieces for the side to move
    if (
      (this.game.turn () === 'w' && piece.search (/^b/) !== -1) ||
      (this.game.turn () === 'b' && piece.search (/^w/) !== -1)
    ) {
      return false;
    }
  }

  onSnapEnd () {
    //if promoting we need to select the piece first
    if (promoting) return;
    this.board.position (this.game.fen ());
  }

  onDrop (source, target) {
    move_cfg = {
      from: source,
      to: target,
      promotion: 'q',
    };

    // check we are not trying to make an illegal pawn move to the 8th or 1st rank,
    // so the promotion dialog doesn't pop up unnecessarily
    // e.g. (p)d7-f8
    let move = this.game.move (move_cfg);
    // illegal move
    if (move === null) {
      return 'snapback';
    } else {
      this.game.undo (); //move is ok, now we can go ahead and check for promotion
    }

    // is it a promotion?
    let source_rank = source.substring (2, 1);
    let target_rank = target.substring (2, 1);
    let piece = game.get (source).type;

    if (
      piece === 'p' &&
      ((source_rank === '7' && target_rank === '8') ||
        (source_rank === '2' && target_rank === '1'))
    ) {
      promoting = true;
      let promo = new PromotionDialog (this.board, mpve_cfg, this.getImgSrc);
    } else {
      // no promotion, go ahead and move
      makeMove (move_cfg);
    }
  } // onDrop

  makeMove (cfg) {
    // see if the move is legal
    let move = this.game.move (cfg);
    // illegal move
    if (move === null) return 'snapback';
    this.board.position (this.game.fen (), false);
    promoting = false;
    //  Now tell the world
    socket.emit (
      'move',
      json.dumps ({
        id: this.id,
        white: this.game.white,
        black: this.game.black,
        player: this.game.turn (), // TBD
        move_number: this.moveNumber,
        san: move.san,
        fen: this.game.fen,
      })
    );
    return move;
  } // makeMove

  getImgSrc (piece) {
    return this.config.pieceTheme.replace (
      '{piece}',
      game.turn () + piece.toLocaleUpperCase ()
    );
  }

  isPlayer(name) {
    return new Set([this.game.white, this.game.black]).has(name);
  }
} // class Chessboard_P30;

/* export ChessboardP30 object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chessboard_P30 = Chessboard_P30;
/* export ChessboardP30 object for any RequireJS compatible environment */
if (typeof define !== 'undefined')
  define (function () {
    return Chessboard_P30;
  });
