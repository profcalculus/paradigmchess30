from flask import Blueprint

bp = Blueprint('messages', __name__, template_folder='templates')

from app.socketio import handlers