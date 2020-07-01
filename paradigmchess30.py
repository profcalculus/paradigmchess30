from app import create_app, db, cli, socketio
from app.models import User, Post, Message, Notification, Task, Game

app = create_app()
cli.register(app)
socketio.run(app)



@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Post': Post, 'Message': Message,
            'Notification': Notification, 'Task': Task, 'Game': Game}
