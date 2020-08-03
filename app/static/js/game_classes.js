class OnlineUser {
    constructor (id, name) {
        this.id = id;
        this.name = name;
}}
 

class OnlineGame {
    constructor (id, white, black) {
    this.id = id;
    this.white = white;
    this.black = black;
    }}

class Challenge {
    constructor (white, black, initial_fen, time_control, challenger) {
    this.white = white; //OnlineUser
    this.black = black; //OnlineUser
    this.initial_fen = initial_fen; // Compressed form, eg 'nqbbn'
    this.time_control = time_control; // '(B|F|S)<initial_s>+<delta_s>' eg 'F180+3'
    this. challenger = challenger; // username
    this.accepted = false ; // may be reset by target 
    this.game_id = null ;// int: This is populated in the response (if the challenge is accepted)
}}
