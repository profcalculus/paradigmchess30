from flask_socketio import emit, send, join_room, leave_room
from app import socketio, logger
from app.models import Game
import json

# Message types: 
# "game" (incoming) - moves, game results, clock setup
#        (outgoing) - moves, game results, clock setup
# "challenge" (incoming) - challenges, acceptance/rejection
# "info" (outgoing)  - join/leave, broadcasts
# "chat" (incoming/outgoing)
# game {
    # game_id: 'game11'
    # message_type: 'move'
    # {
    # move:'Ne4'
    # player:'w'
    # time:23.04
    # }
    # OR
    # message_type: 'clock'
    # {mode: 'Bronstein'
    # base_time: '900'
    # delta: '15'}
    # OR
    # message_type: 'result'
    # {
    #     result: '1-0 (time)'
    # }
# }
# "challenge"
# {
# player1:player_id_1
# player2:player_id_2
# white: id or None 
# clock:{
# mode:'S|B|F'}
# main_time:int
# delta:in
# accepted: true of false or None 
# }}
#
#"info"{
# message}

#"chat" {
# message (to be routed appropriately)
# }
#

def challenge(target_id, clock, white=None):
    socketio.emit('challenge',{
        player1:current_user.id,
        player2:target_id,
        clock: json.dumps(clock),
        white: white,}
    ) 


def challenge_response(target_id):
    socketio.emit('challenge_response',{
        player1:target_id,
        player2:current_user.id,}
    ) 


@socketio.on('move')
def on_move(data):
    # room = data['room']
    logger.debug('move:' + data)
    # for room_ in [room, 'lobby']:
    #     emit('chess', data, room=room_) # Inform the opponent and spectators
    # # TODO: persist move-by-move?
    # username = data['username']
    # movenumber = data['movenumber']
    # move = data['move']
    # clock = data['clock']

@socketio.on('game_over')
def on_game_over(data):
    logger.debug('game_over:' + data)
    white = data['white_id']
    black = data['black_id']
    game = Game.query().filter(white_id=white_id, black_id=black_id).order_by(timestamp).last()
    game.pgn = data['pgn']
    game.result = data['result']
    current_app.session.commit()
    # Update demo boards & ....
    socketio.emit('game_over', data)
    