from flask_socketio import emit, send, join_room, leave_room
from app import socketio
from app.models import Game

# Message types: 
# "game" (incoming) - moves, game results, clock setup
#        (outgoing) - moves, game results, clock setup
# "pairing" (incoming) - challenges, acceptance/rejection
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
    # {style: 'Bronstein'
    # base_time: '900'
    # delta: '15'}
    # OR
    # message_type: 'result'
    # {
    #     result: '1-0 (time)'
    # }
# }
# "pairing"
# {challenge:
# {target:'jack'
# clock_setup or None
# player or None}}
#
#"info"{
# message}

#"chat" {
# message (to be routed appropriately)
# }
#
    

@socketio.on('move', namespace='/chess')
def on_move(data):
    room = data['room']
    for room_ in [room, 'lobby']:
        emit('move', data, room=room_) # Inform the opponent and spectators
    # TODO: persist move-by-move?
    # username = data['username']
    # movenumber = data['movenumber']
    # move = data['move']
    # clock = data['clock']

def on_game_over(data):
    username = data['username']
    game = None
    # game, player = Game.find(username) TODO
    game.pgn = data['pgn']
    emit('info', game.get_data())
