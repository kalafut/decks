from collections import namedtuple
from sqlalchemy.sql import select
import db

Resource = namedtuple("Resource", ["table", "has_user_id"])

decks = Resource(db.decks, True)
cards = Resource(db.cards, True)
deckcards = Resource(db.deckcards, False)


def get(resource, user_id=None, id_=None, id_dict=False):
    conn = db.get_conn()
    stmt = select([resource.table]).select_from(resource.table)

    if resource.has_user_id:
        stmt = stmt.where(resource.table.c.owner_id == user_id)

    if id_ is not None:
        stmt = stmt.where(resource.table.c.id == id_)

    query = conn.execute(stmt)
    results = query.fetchall()

    if id_dict:
        return make_id_dict(results)
    else:
        return [dict(row) for row in results]

def post(resource, data, user_id=None):
    data["owner_id"] = user_id
    if "id" in data:
        del data["id"]

    conn = db.get_conn()
    result = conn.execute(resource.table.insert(), data)
    return get(resource, user_id=user_id, id_=result.inserted_primary_key[0], id_dict=True)

def put(resource, data, id_, user_id=None):
    data["owner_id"] = user_id
    data["id"] = id_

    conn = db.get_conn()
    table = resource.table
    conn.execute(table.update()
            .where(table.c.id == id_)
            .where(table.c.owner_id == user_id)
            .values(data))
    return get(resource, user_id=user_id, id_=id_, id_dict=True)


def delete(resource, id_, user_id=None):
    conn = db.get_conn()
    table = resource.table
    conn.execute(table.delete()
                 .where(table.c.id == id_)
                 .where(table.c.owner_id == user_id))

def make_id_dict(rows):
    output = {}
    for row in rows:
        output[row["id"]] = dict(row)
    return output
