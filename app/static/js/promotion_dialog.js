
class PromotionDialog {
  constructor (board, move_cfg, getImgSrc) {
    this.board = board;
    this.move_cfg = move_cfg;
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
        close: this.onDialogClose,
        closeOnEscape: false,
        dialogClass: 'noTitleStuff',
      })
      .dialog ('widget')
      .position ({
        of: $ (`#{board_id}`),
        my: 'middle middle',
        at: 'middle middle',
      });
    //the actual move is made after the piece to promote to
    //has been selected, in the onDialogClose event
  } // constructor
  onDialogClose () {
    this.move_cfg.promotion = promote_to;
    move = this.board.makeMove (this.game, this.move_cfg);
  }
}
export {PromotionDialog};
