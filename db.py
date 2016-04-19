import sqlite3

__session = None

def get_session():
    global __session

    if not __session:
        __session = sqlite3.connect('test.db')
        __session.row_factory = sqlite3.Row
    return __session

def get_deck_cards(deck_id):
    session = get_session()
    query = session.execute("""
        SELECT deck_card.id, cards.front, deck_card.box FROM deck_card
        JOIN cards ON deck_card.card_id = cards.id
        WHERE deck_card.deck_id = ?
        """, str(deck_id))
    results = []
    for c in query:
        results.append({"id":c["id"], "word":c["front"], "box":c["box"]})

    return results

def update_deck_card(data):
    id = data["id"]
    box = data["box"]

    session = get_session()
    session.execute("""
        UPDATE deck_card SET box = ? WHERE id = ?
        """, (box, id))
    session.commit()

