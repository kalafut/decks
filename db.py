import sqlite3

__session = None

def get_session():
    global __session

    if not __session:
        __session = sqlite3.connect('test.db')
        __session.row_factory = sqlite3.Row
    return __session
