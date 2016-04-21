from sqlalchemy import *
from sqlalchemy.sql import select
import sqlite3

metadata = MetaData()

__session = None
__conn = None

user = Table('users', metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String(255), nullable=False)
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


def get_session():
    global __session

    if not __session:
        __session = sqlite3.connect('test.db')
        __session.row_factory = sqlite3.Row
    return __session

def get_conn():
    global __conn

    if not __conn:
        engine = create_engine('sqlite:///test.db')
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

def as_dict(result):
    result_dict = {}
    for key in result.keys():
        result_dict[key] = result[key]

    return result_dict

