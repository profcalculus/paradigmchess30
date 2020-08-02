import {P30toFEN} from 'utils';
class PGN {
  constructor (game_id, game_json) {
    this.game_id = game_id;
    let id = game_id.split ('_')[1];
    this.$PGN_list = $ (`#pgn_{id} ul`); //DOM element
    addPGNHeader (game_json);
  }

  appendLine (text, css_class) {
    if (css_class === undefined) {
      line = `<li>{text}</li>`;
    } else {
      line = `<li class="${css_class}">{text}</li>`;
    }
    this.$PGN_list.append (line);
    // Auto-scroll to last line
    $ ('li', this.$PGN_list).last ()[0].scrollIntoView (false);
  }

  addPGNHeader (game_json) {
    let makeTag = function (tagName, value) {
      return `[${tagName}] "${value}"`;
    };
    let makeDateStr = function () {
      let date = new Date ();
      let yyyy = date.getFullYear ();
      let mm = date.getMonth () + 1;
      let dd = date.getDate ();
      if (mm < 10) {
        mm = '0' + mm;
      }
      if (dd < 10) {
        dd = '0' + dd;
      }
      return `${yyyy}/${mm}/${dd}`;
    };
    // TODO: use the database version instead?!
    this.$PGN_list.empty ();
    this.appendLine (this.makeTag ('Site', 'ParadigmChess30'), 'tinygreen');
    this.appendLine (this.makeTag ('Date', this.makeDateStr ()), 'tinygreen');
    this.appendLine (this.makeTag ('SetUp', '1'), 'tinygreen');
    this.appendLine (
      this.makeTag ('StartPos', P30toFEN (game_json.fen)),
      'tinygreen'
    );
  }
}
