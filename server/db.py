import collections
import string
import typing
from random import SystemRandom

import bcrypt
import sqlite3                             # type: ignore
from sqlalchemy import Table, Column, Integer, String, ForeignKey, MetaData # type: ignore
from sqlalchemy import create_engine       # type: ignore
from sqlalchemy.sql import select, delete  # type: ignore
from sqlalchemy.engine import Engine       # type: ignore
from sqlalchemy import event               # type: ignore

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relation, sessionmaker, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    decks = relationship("Deck", back_populates="owner")


class CardBase(Base):
    __tablename__ = 'cardbases'

    id = Column(Integer, primary_key=True)
    front = Column(String(255), nullable=False)
    back = Column(String(255), nullable=False, default="")
    cards = relationship("Card", back_populates="cardbase")

    def __repr__(self):
        return "Card(%r, %r)" % (self.front, self.back)

class MixinAsDict:
    def asDict(self):
        return {k:getattr(self, k) for k in vars(self) if not k.startswith('_')}

class Card(Base, MixinAsDict):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True)
    cardbase_id = Column(Integer, ForeignKey("cardbases.id"))
    cardbase = relationship("CardBase", back_populates="cards")

    deck_id = Column(Integer, ForeignKey("decks.id"))
    deck = relationship("Deck", back_populates="cards")

    box = Column(Integer, nullable=False, default=1)
    status = Column(Integer, nullable=False, default=0)
    show_count = Column(Integer, nullable=False, default=0)
    last_shown = Column(Integer, nullable=False, default=0)

    @property
    def front(self):
        return self.cardbase.front

    @property
    def back(self):
        return self.cardbase.back

    def asDict(self):
        d = super().asDict()
        d.update({'front': self.front, 'back': self.back})
        return d


class Deck(Base, MixinAsDict):
    __tablename__ = 'decks'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    student = Column(String(255), nullable=False, default="")
    cards = relationship("Card", back_populates='deck')

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="decks")




########################


metadata = MetaData()
engine = None
prng = SystemRandom()

#User = collections.namedtuple('User', ['id', 'name', 'email'])
#Session = collections.namedtuple('Session', ['session_id', 'user'])

users = Table('users', metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String(255), nullable=False),
        Column('email', String(255), nullable=False),
        Column('password', String(255), nullable=False)
        )

sessions = Table('sessions', metadata,
        Column('id', Integer, primary_key=True),
        Column('session_id', String(255), nullable=False),
        Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        Column('expiration', Integer, nullable=False, default=0)
        )

cards = Table('cards', metadata,
        Column('id', Integer, primary_key=True),
        Column('front', String(255), nullable=False),
        Column('back', String(255), nullable=False, default=""),
        Column('owner_id', Integer, ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
        )

decks = Table('decks', metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String(255), nullable=False),
        Column('owner_id', Integer, ForeignKey("users.id", ondelete='CASCADE'), nullable=False),
        Column('student', String(255), nullable=False, default=""),
        )

deckcards = Table('deckcards', metadata,
        Column('id', Integer, primary_key=True),
        Column('deck_id', Integer, ForeignKey('decks.id', ondelete='CASCADE')),
        Column('card_id', Integer, ForeignKey('cards.id', ondelete='CASCADE')),
        Column('box', Integer, nullable=False, default=0),
        Column('status', Integer, nullable=False, default=0),
        Column('show_count', Integer, nullable=False, default=0),
        Column('last_shown', Integer, nullable=False, default=0),
        Column('owner_id', Integer, ForeignKey("users.id", ondelete='CASCADE'), nullable=False)
        )

def get_conn():
    return engine.connect()

def get_decks(user_id):
    conn = get_conn()
    s = select([decks.c.id, decks.c.name, decks.c.student]).select_from(decks).where(decks.c.owner_id == user_id)
    query = conn.execute(s)
    results = [as_dict(c) for c in query]
    query.close()
    return results


def get_decks2(user_id):
    conn = get_conn()
    query = conn.execute(select([decks]).select_from(decks).where(decks.c.owner_id == user_id))
    return query.fetchall()


def get_cards(user_id):
    conn = get_conn()
    query = conn.execute(select([cards]).select_from(cards).where(cards.c.owner_id == user_id))
    return query.fetchall()


def get_deckcards2(user_id):
    conn = get_conn()
    query = conn.execute(select([deckcards]).select_from(deckcards.join(decks)).where(decks.c.owner_id == user_id))
    return query.fetchall()


def get_deckcards(deck_id):
    conn = get_conn()
    s = select([deckcards.c.id, cards.c.front.label('word'), deckcards.c.box]).select_from(deckcards.join(cards)).where(deckcards.c.deck_id == deck_id)
    query = conn.execute(s)
    results = [as_dict(c) for c in query]
    query.close()
    return results

def update_deckcards(data):
    id = data["id"]
    box = data["box"]

    conn = get_conn()
    stmt = deckcards.update().where(deckcards.c.id == id).values(box=box)
    conn.execute(stmt)

def add_card(data):
    conn = get_conn()
    result = conn.execute(cards.insert(), front=data["front"], owner_id=1)
    new_id = result.inserted_primary_key[0]
    result = conn.execute(deckcards.insert(), deck_id=1, card_id=new_id)

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

def get_data(user_id, since=0):
    conn = get_conn()
    result = conn.execute(select([cards]).where(cards.c.owner_id == user_id)).fetchall()
    return result

def add_deck(data):
    conn = get_conn()
    result = conn.execute(decks.insert(),
        name=data["name"],
        student=data["student"],
        owner_id=1)


def update_deck(user_id, id_, data):
    conn = get_conn()
    conn.execute(decks.update()
                 .where(decks.c.id == id_)
                 .where(decks.c.owner_id == user_id)
                 .values(name=data["name"], student=data["student"]))


def delete_deck(user_id, id_):
    conn = get_conn()
    conn.execute(decks.delete()
                 .where(decks.c.id == id_)
                 .where(decks.c.owner_id == user_id))

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

def get_current_user(session_id):
    conn = get_conn()
    session = conn.execute(select([sessions]).where(sessions.c.session_id == session_id)).fetchone()

    if not session:
        return None

    user = conn.execute(select([users]).where(users.c.id == session.user_id)).fetchone()
    if not user:
        return None

    return User(id=user.id, name=user.name, email=user.email)

def create_session(user):
    session_id = random_session_id()

    conn = get_conn()
    conn.execute(sessions.insert(), session_id=session_id, user_id=user.id, expiration=0)
    return session_id

def random_session_id():
    return "".join([prng.choice(string.ascii_letters) for _ in range(30)])



def Session():
    return _Session()

def connect2(db_name, init=False, sample_data=False):
    global _Session
    engine = create_engine(db_name)

    if init:
        Base.metadata.create_all(engine)

    _Session = sessionmaker(bind=engine)
    session = _Session()

    if sample_data:
        u = User(name='Jim', email='jim@kalafut.net')
        d = Deck(name='First Deck', owner=u)
        d.cards = [
                Card(cardbase=CardBase(front='Afront', back='Aback')),
                Card(cardbase=CardBase(front='F3', back='')),
                ]

        session.add(d)
        d = Deck(name='Second Deck', owner=u)
        session.add(d)
        session.commit()

def connect(db_name, init=False, sample_data=False):
    global engine

    if engine is not None:
        raise Exception("Engine already connected")

    engine = create_engine(db_name)

    if init:
        metadata.create_all(engine)

    if sample_data:
        conn = get_conn()
        conn.execute(users.insert(), id=1, name="Jim", email="jim@kalafut.net", password="password")
        conn.execute(cards.insert(), [
            {'id':1, 'front':'dog', 'owner_id':1},
            {'id':2, 'front':'cat', 'owner_id':1},
            {'id':3, 'front':'pizza', 'owner_id':1},
            ])
        conn.execute(decks.insert(), [
            {'name': "First Deck", 'owner_id': 1, 'student': ""},
            {'name': "Second Deck", 'owner_id': 1, 'student': "Ben"},
            ])
        conn.execute(deckcards.insert(), [
            {'deck_id':1, 'card_id':1, 'owner_id': 1},
            {'deck_id':1, 'card_id':2, 'owner_id': 1},
            {'deck_id':1, 'card_id':3, 'owner_id': 1}
            ])

def disconnect():
    global engine

    engine = None


@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

