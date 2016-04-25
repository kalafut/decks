import collections
import string
from random import SystemRandom

import bcrypt
import sqlite3
from sqlalchemy import *
from sqlalchemy.sql import select
from sqlalchemy.engine import Engine
from sqlalchemy import event

DB_NAME = 'sqlite:///test.db'
metadata = MetaData()

__session = None
__conn = None
prng = SystemRandom()

User = collections.namedtuple('User', ['id', 'name', 'email'])
Session = collections.namedtuple('Session', ['session_id', 'user'])

users = Table('users', metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String(255), nullable=False),
        Column('email', String(255), nullable=False),
        Column('password', String(255), nullable=False)
        )

sessions = Table('sessions', metadata,
        Column('id', Integer, primary_key=True),
        Column('session_id', String(255), nullable=False),
        Column('user_id', Integer, ForeignKey('users.id'), nullable=False),
        Column('expiration', Integer, nullable=False, default=0)
        )

students = Table('students', metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String(255), nullable=False),
        Column('teacher_id', Integer, ForeignKey('users.id'), nullable=False)
        )

cards = Table('cards', metadata,
        Column('id', Integer, primary_key=True),
        Column('front', String(255), nullable=False),
        Column('back', String(255), nullable=False, default=""),
        Column('owner_id', Integer, ForeignKey("users.id"), nullable=False)
        )

decks = Table('decks', metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String(255), nullable=False),
        Column('student_id', Integer, ForeignKey("students.id"), nullable=False)
        )

deck_card = Table('deck_card', metadata,
        Column('id', Integer, primary_key=True),
        Column('deck_id', Integer, ForeignKey('decks.id')),
        Column('card_id', Integer, ForeignKey('cards.id')),
        Column('box', Integer, nullable=False, default=0),
        Column('status', Integer, nullable=False, default=0),
        Column('show_count', Integer, nullable=False, default=0),
        Column('last_shown', Integer, nullable=False, default=0)
        )


#def get_session():
#    global __session
#
#    if not __session:
#        __session = sqlite3.connect(DB_NAME)
#        __session.row_factory = sqlite3.Row
#    return __session

def get_conn():
    global __conn

    if not __conn:
        engine = create_engine(DB_NAME)
        __conn = engine.connect()
    return __conn

def get_deck_cards(deck_id):
    conn = get_conn()
    s = select([deck_card.c.id, cards.c.front.label('word'), deck_card.c.box]).select_from(deck_card.join(cards)).where(deck_card.c.deck_id == deck_id)

    query = conn.execute(s)
    results = [as_dict(c) for c in query]

    query.close()

    return results

def update_deck_card(data):
    id = data["id"]
    box = data["box"]

    conn = get_conn()
    stmt = deck_card.update().where(deck_card.c.id == id).values(box=box)
    conn.execute(stmt)

def add_card(data):
    conn = get_conn()
    result = conn.execute(cards.insert(), front=data["front"], owner_id=1)
    new_id = result.inserted_primary_key[0]
    result = conn.execute(deck_card.insert(), deck_id=1, card_id=new_id)

def add_user(name, email, password):
    conn = get_conn()

    result = conn.execute(select([users]).where(users.c.email == email))
    if result.first():
        # already exists
        return False, "Email address already exists"

    pw = password.encode('utf-8')
    hashpw = bcrypt.hashpw(pw, bcrypt.gensalt(12))
    result = conn.execute(users.insert(),
        name=name,
        email=email,
        password=hashpw)
    return True, result.inserted_primary_key[0]

def login(email, password):
    conn = get_conn()

    result = conn.execute(select([users]).where(users.c.email == email))
    user = result.first()
    if not user:
        return False, "Invalid username or password"

    pw = password.encode('utf-8')
    if not bcrypt.hashpw(pw, user.password) == user.password:
        return False, "Invalid username or password"

    user = User(id=user.id, name=user.name, email=user.email)
    session_id = create_session(user)
    return True, Session(session_id=session_id, user=user)

def as_dict(result):
    result_dict = {}
    for key in result.keys():
        result_dict[key] = result[key]

    return result_dict

def get_session(session_id):
    if not session_id:
        return None

    conn = get_conn()
    session = conn.execute(select([sessions]).where(sessions.c.session_id == session_id)).fetchone()
    if not session:
        return None

    user = conn.execute(select([users]).where(users.c.id == session.user_id)).fetchone()

    return User(id=user.id, name=user.name, email=user.email)

def create_session(user):
    session_id = random_session_id()

    conn = get_conn()
    conn.execute(sessions.insert(), session_id=session_id, user_id=user.id, expiration=0)
    return session_id

def random_session_id():
    return "".join([prng.choice(string.ascii_letters) for _ in range(30)])

def create_all():
    engine = create_engine('sqlite:///test.db')
    metadata.create_all(engine)

    conn = get_conn()
    conn.execute(users.insert(), id=1, name="Jim", email="jim@kalafut.net", password="password")
    conn.execute(students.insert(), id=1, name="Ben", teacher_id=1)
    conn.execute(cards.insert(), [
        {'id':1, 'front':'dog', 'owner_id':1},
        {'id':2, 'front':'cat', 'owner_id':1},
        {'id':3, 'front':'pizza', 'owner_id':1}
        ])
    conn.execute(decks.insert(), id=1, name="First Deck", student_id=1)
    conn.execute(deck_card.insert(), [
        {'deck_id':1, 'card_id':1},
        {'deck_id':1, 'card_id':2},
        {'deck_id':1, 'card_id':3}
        ])

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

if __name__ == "__main__":
    create_all()
