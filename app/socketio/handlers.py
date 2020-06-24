from flask_socketio import emit, send, join_room, leave_room
from app import socketio
from app.models import Game

@socketio.on('join')
def on_join(data):
    username = data['username']
    room=data['room']
    join_room(room)
    emit('info', username +' has entered the room', room=room )

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room=data['room']
    leave_room(room)
    emit('info', username +' has left the room', room=room )

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
    emit('info', game.show_result())
