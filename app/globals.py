from dataclasses import dataclass
from json import loads, dumps
from app import redis_client
from app.models import User

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






