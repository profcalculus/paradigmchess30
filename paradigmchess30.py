from app import create_app, db, cli, socketio
from app.models import User, Post, Message, Notification, Task, Game

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Post': Post, 'Message': Message,
            'Notification': Notification, 'Task': Task, 'Game': Game}

if __name__ == '__main__':
    cli.register(app)
    app.logger.info('socketio launching')
    socketio.run(app)
