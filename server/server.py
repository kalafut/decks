import json
import os
import time
import tornado.escape # type: ignore
import tornado.ioloop # type: ignore
import tornado.web    # type: ignore

import db
from db import Session, Deck, Card, CardBase, User
import api

class BaseHandler(tornado.web.RequestHandler):
    def prepare(self):
        self.session = Session()

    def on_finish(self):
        self.session.close()

    def get_current_user(self):
        user = self.session.query(User).filter(User.id==1).first()
        return user

        session_id = self.get_secure_cookie("session_id") # type: bytes
        if session_id:
            return db.get_current_user(session_id.decode())
        else:
            return None

class LoginHandler(BaseHandler):
    def get(self):
        self.render("login.html", error_msg=None)

    def post(self):
        valid, data = db.login(self.get_argument("email"), self.get_argument("password"))
        if valid:
            self.set_secure_cookie("session_id", data.session_id)
            self.redirect("/")
        else:
            self.render("login.html", error_msg=data)

class HomeHandler(BaseHandler):
    def get(self):
        return self.render("templates/index.html")

class SignupHandler(BaseHandler):
    def get(self):
        self.render("signup.html", error_msg=None)

    def post(self):
        valid, data = db.add_user(
            self.get_argument("name"),
            self.get_argument("email"),
            self.get_argument("password")
            )
        if valid:
            self.set_secure_cookie("session_id", str(data))
            self.redirect("/login")
        else:
            self.render("signup.html", error_msg=data)

class AddHandler(BaseHandler):
    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        db.add_card(data)


class WordsHandler(BaseHandler):
    def get(self):
        results = db.get_deckcards(1)

        self.write(results)

    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        db.update_deckcards(data)


class ApiHandler(BaseHandler):
    def get(self, id_=None):
        result = {'data':[x.asDict() for x in self.session.query(self.resource)]}
        self.write(result)

    def post(self, id_=None):
        data = tornado.escape.json_decode(self.request.body)
        del data['id']
        if hasattr(self.resource, 'owner_id'):
            data['owner_id'] = self.current_user.id
        print(data)
        o = self.resource(**data)
        self.session.add(o)
        self.session.commit()
        self.write(o.asDict())

    def put(self, id_=None):
        data = tornado.escape.json_decode(self.request.body)
        record = self.session.query(self.resource).filter_by(id=id_).first()
        for field in self.update_fields:
            if field in data:
                setattr(record, field, data[field])
        self.session.commit()
        self.write(record.asDict())

    def delete(self, id_=None):
        api.delete(self.resource, id_=id_, user_id=1)

class CardHandler(ApiHandler):
    resource = Card

    def post(self, id_=None):
        data = tornado.escape.json_decode(self.request.body)

        cb = CardBase(front=data['front'], back=data['back'])
        card = Card(cardbase=cb)
        self.session.add(card)
        self.session.commit()
        self.write(card.asDict())

class DeckHandler(ApiHandler):
    resource = Deck
    update_fields = ['name', 'student']


class DataHandler(BaseHandler):
    def get(self, deck_id=None):
        output = {
            "object": "full",
            "timestamp": int(time.time()*1000),
            "cards": {},
            "decks": {},
            "deckcards": {}
            }

        cards = db.get_cards(1)
        for row in cards:
            output["cards"][row["id"]] = {
                "id": row["id"],
                "front": row["front"],
                "back": row["back"]
                }

        decks = api.get(api.decks, 1)

        for row in decks:
            output["decks"][row["id"]] = row

        deckcards = api.get(api.deckcards, 1)
        for row in deckcards:
            output["deckcards"][row["id"]] = row

        self.write(output)

    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        db.add_deck(data)

class MainHandler(BaseHandler):
    def initialize(self, store):
        self.store = store

    def get(self, guid):
        """Handle GET requests."""

        # record will be None if GUID is invalid or missing
        record = self.store.get(guid)

        if record:
            self.write(record)
        else:
            raise tornado.web.HTTPError(400)

    def post(self, guid=None):
        """
        Handle POST requests.

        Improper body data (e.g. not JSON, JSON not matching expected
        structure) will all result in status 400.
        """
        try:
            data = tornado.escape.json_decode(self.request.body)
            if "guid" in data:
                del data["guid"]
        except ValueError:
            raise tornado.web.HTTPError(400)

        if not isinstance(data, dict):
            raise tornado.web.HTTPError(400)

        # Default to empty record if no GUID provided or no existing record
        record = {
            "guid": None,
            "expire": "",
            "user": ""
        }

        # Check whether this record already exists and use that data as the default
        if guid:
            record["guid"] = guid
            current_record = self.store.get(guid)
            if current_record:
                record.update(current_record)

        # Update with submitted data
        record.update(data)

        result = self.store.post(record)

        if not result:
            raise tornado.web.HTTPError(400)
        else:
            self.write(result)

    def delete(self, guid):
        """Handle DELETE requests."""
        if not self.store.delete(guid):
            raise tornado.web.HTTPError(400)


def make_app(config):
    """Create application and configure routes."""
    # A GUID-format route, (0-9A-F){32}, could be used here if we just want 404s

    settings = {
        "debug": True,
        "static_path": os.path.join(os.path.dirname(__file__), "..", "static"),
        "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
        "login_url": "/login",
        "xsrf_cookies": False,  # TODO: put this back in
    }
    return tornado.web.Application([
        (r"/api/v1/decks/(.*)", DeckHandler),
        (r"/api/v1/decks", DeckHandler),
        (r"/api/v1/cards/(.*)", CardHandler),
        (r"/api/v1/cards", CardHandler),
        (r"/api/v1/data", DataHandler),
        (r"/word/add", AddHandler),
        (r"/words", WordsHandler),
        (r"/login", LoginHandler),
        (r"/signup", SignupHandler),
        (r"/.*", HomeHandler),
        #(r"/static/(.*)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    ], **settings)


def server_start(config):
    """Create application and start event loop."""
    app = make_app(config)
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
