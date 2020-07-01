"""Messages Socket.IO Example

Implements a simple messages server.
"""
from flask import Blueprint, render_template, request, session, url_for, \
    current_app
from flask_socketio import emit
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


@socketio.on('connect', namespace='/messages')
def on_connect():
    """A new user connects to the messages."""
    if request.args.get('username') is None:
        return False
    session['username'] = request.args['username']
    current_app.logger.info(f"{session['username']} connected")
    emit('message', {'message': session['username'] + ' has joined.'},
         broadcast=True)


@socketio.on('disconnect', namespace='/messages')
def on_disconnect():
    """A user disconnected from the messages."""
    current_app.logger.info(f"{session['username']} disconnected")
    emit('message', {'message': session['username'] + ' has left.'},
         broadcast=True)

@socketio.on('join')
def on_join(data):
    username = data['username']
    room=data['room']
    join_room(room)
    msg = f'{username} has entered {room}'
    if room != 'lobby':
        emit('info', json.dumps({'room':room, 'msg':f'{username} has entered {room}'}))
    emit('info', json.dumps({'room':'lobby', 'msg':f'{username} has entered {room}'}))
        

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
