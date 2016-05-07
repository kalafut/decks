import pytest

import api
import db as _db

test_decks = [
        {'name': "First Deck", 'owner_id': 1, 'student': ""},
        {'name': "Second Deck", 'owner_id': 1, 'student': "Ben"},
        ]

@pytest.fixture
def db(request):
    _db.connect("sqlite://", init=True)

    def close():
        _db.disconnect()
    request.addfinalizer(close)
    return _db


@pytest.fixture
def db_preloaded(request, db):
    engine = db.engine
    engine.execute(_db.users.insert(), id=1, name="Jim", email="jim@kalafut.net", password="password")
    engine.execute(_db.cards.insert(), [
        {'id':1, 'front':'dog', 'owner_id':1},
        {'id':2, 'front':'cat', 'owner_id':1},
        {'id':3, 'front':'pizza', 'owner_id':1},
        ])
    engine.execute(_db.decks.insert(), [
        {'name': "First Deck", 'owner_id': 1, 'student': ""},
        {'name': "Second Deck", 'owner_id': 1, 'student': "Ben"},
        ])
    engine.execute(_db.deckcards.insert(), [
        {'deck_id':1, 'card_id':1, 'owner_id': 1},
        {'deck_id':1, 'card_id':2, 'owner_id': 1},
        {'deck_id':1, 'card_id':3, 'owner_id': 1}
        ])
    return db

def test_tables(db_preloaded):
    db = db_preloaded
    exp_tables = [
        "users",
        "decks",
        "cards",
        "sessions",
        "deckcards",
        "deckperms"
        ]

    tables = db.engine.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    list_equals(exp_tables, tables, 0)

def test_decks(db):
    db.engine.execute(_db.users.insert(), id=1, name="Jim", email="", password="")
    db.engine.execute(_db.users.insert(), id=2, name="Jim", email="", password="")
    db.engine.execute(_db.decks.insert(), [
        {'name': "First", 'student': ""},
        {'name': "Second", 'student': ""},
        ])
    db.engine.execute(_db.deckperms.insert(), [
        {"user_id": 1, "deck_id": 1, "permission": 0},
        {"user_id": 1, "deck_id": 2, "permission": 0},
        ])

    decks = api.get(api.decks, user_id=1)
    list_equals(["First", "Second"], decks, "name")


def list_equals(exp, act, field=None):
    act = list(act)
    assert len(exp) == len(act)
    if field is not None:
        act = [x[field] for x in act]

    for val in exp:
        assert val in act
