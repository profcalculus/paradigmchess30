"""Messages Socket.IO Example

Implements a simple messages server.
"""
from json import dumps
from app.globals import Challenge, rooms_per_user, users_per_room
from flask import Blueprint, render_template, request, session, url_for, \
    current_app, session
from flask_socketio import emit, join_room, leave_room
from app import socketio
from app.models import Game

bp = Blueprint('messages', __name__, static_folder='static',
               template_folder='templates')



@bp.route('/')
def index():
    """Return the client application."""
    messages_url = current_app.config.get('MESSAGES_URL') or \
        url_for('messages.index')
    return render_template('messages/main.html', messages_url=messages_url)


@socketio.on('connect')
def on_connect():
    """A new user connects to the messages."""
    if request.args.get('username') is None:
        return False
    username = request.args['username']
    session['username'] = username
    for room in (request.sid,'lobby'):
        users_per_room[room].append(username)
        rooms_per_user[username].append(room)
    current_app.logger.info(f"{session['username']} connected")
    emit('message', {'message': session['username'] + ' has joined.'},
         broadcast=True)


@socketio.on('disconnect')
def on_disconnect():
    """A user disconnected from the messages."""
    username = session['username']
    # Remove the user from the g;obal register of rooms & users
    rooms = rooms_per_user.pop(username)
    for room in rooms:
        users_per_room[room].pop(users_per_room[room].index(username))
    current_app.logger.info(f"{session['username']} disconnected")
    emit('message', {'message': session['username'] + ' has left.'},
         broadcast=True)

# Joining a socketio room
def move_to_room(username, room, leave_current_room=True):
    username = data['username']
    new_room=data['room']
    join_room(new_room)
    # Must leave last room...

    last_room = rooms_per_user[username].pop()
    users_per_room[last_room].pop(users_per_room[last_room].index(username))
    users_per_room[new_room].append[username]
    if not new_room in rooms_per_user[username]:
        rooms_per_user[username].append[new_room]
    msg = f'{username} has entered {new_room}'
    emit('info', dumps({'room':'lobby', 'msg':msg}))
        

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room=data['room']
    leave_room(room)
    emit('info', username +' has left the room', room=room )

@socketio.on('post-message', namespace='/messages')
def on_post_message(message):
    """A user posted a message to the messages."""
    emit('message', {'user': session['username'],
                     'message': message['message']},
         broadcast=True)

def issue_challenge(target_id, mycolour, initial_fen, time_control):
    lobby_users = ONLINE_USERS.get('lobby')
    players = [p for p in lobby_users if p.id == target_id or p.id== current_user.id]
    if len(players) != 2: 
        emit('chat',dumps({name:'ParadigmChess30',
            text:'Sorry, that player is not available in the lobby'}))
        return
    me = [p for p in players if p.id==current_user.id][0]
    target = [p for p in players if p.id==target_id][0]
    if mycolour=='w':
        challenge = Challenge(me,target,initial_fen,time_control)
    else:
        challenge = Challenge(target,me,initial_fen,time_control)
    emit('challenge',dumps(challenge))

def respond_to_challenge(challenge:Challenge, accept:bool):
    challenge.accept = accept
    if accept:
        game = Game(challenge.white_id,
            challenge.black_id,
            challenge.initial_fen,
            timecontrol=challenge.timecontrol)
        session.add(game)
    challenge.game_id = game.id
    emit('challenge_response', dumps(challenge))
 
@socketio.on('challenge_response')
def on_challenge_response(challenge):
    pass ### TODO

