from dataclasses import dataclass
from json import loads, dumps
from app import redis_client
from app.models import User

# NB global app state! TODO: review this if we need > 1 Flask instance
""" Global allocation of rooms to users (many<->many) for socketio """
def leave_room(user:OnlineUser, room:str) -> None:
    rooms_for_user = redis_client.hget('rooms_per_user', user.username)
    users_for_room = redis_client.hget('users_per_room', room)
    rooms_for_user.pop(rooms_for_user.index(room))
    users_for_room.pop(users_for_room.index(user.username))
    redis_client.hset('rooms_per_user',user.username,rooms_for_user)
    redis_client.hset('users_per_room',room,users_for_room)
    
def goto_room(user:OnlineUser, room:str)->None:
    rooms_for_user = redis_client.hget('rooms_per_user', user.username)
    users_for_room = redis_client.hget('users_per_room', room)
    rooms_for_user.append(room)
    users_for_room.append(user.username)
    redis_client.hset('rooms_per_user',user.username,rooms_for_user)
    redis_client.hset('users_per_room',room,users_for_room)

@dataclass
class OnlineUser:
    id:int
    name:str
    game_id:int = None
    colour:str = None

@dataclass
class OnlineGame:
    id: int
    white: OnlineUser
    black: OnlineUser

@dataclass
class Challenge:
    white: OnlineUser
    black: OnlineUser
    initial_fen: str # Compressed form, eg 'nqbbn'
    time_control: str # '(B|F|S)<initial_s>+<delta_s>' eg 'F180+3'
    challenger: str # username
    accepted: bool = None
    game_id: int = None# This is populated in the response (if the challenge is accepted)

class OnlineUsers:
    """
    Keeps track of players and their locations (using Redis)
    """
    _key='p30:online_users'
    def get(self, where=None): ## 'where' can be 'lobby' or 'playing' or None
        users = loads(redis_client.get(self._key) or '{}')
        if where == 'lobby':
            return [u for u in users if u.game_id is None]
        elif where == 'playing':
            return [u for u in users if u.game_id is not None]
        else:
            return users

    def _set(self, users):
        redis_client.set(_key,dumps(users))
    def add(self, user:User):
        users = self.get()
        users[user.name] = OnlineUser(user.id, user.name)
        self._set(users)
    def remove(self, user_name):
        users = self.get()
        del users[user_name]
        self._set(users)
    def move(self, user_name, game_id=None, colour=None): # Move a user to or from a game
        users = self.get()
        users[user_name].game_id = game_id
        if game_id is not None:
            users[user_name].colour = colour
        self._set(users)
    def games(self):
        players = self.get('playing')
        games = defaultdict(OnlineGame)
        for name, player in players.iteritems():
            games[player.game_id].setattr(player.colour,player.name)
        return games
        
ONLINE_USERS = OnlineUsers()






