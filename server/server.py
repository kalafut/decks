import json
import os
import random
import time
import tornado.escape # type: ignore
import tornado.ioloop # type: ignore
import tornado.web    # type: ignore

import db
import api

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self) -> db.User:
        session_id = self.get_secure_cookie("session_id") # type: bytes
        if session_id:
            return db.get_current_user(session_id.decode())
        else:
            return None

class LoginHandler(BaseHandler):
    def get(self):
        self.render("templates/login.html", error_msg=None)

    def post(self):
        valid, data = db.login(self.get_argument("email"), self.get_argument("password"))
        if valid:
            self.set_secure_cookie("session_id", data.session_id)
            next_url = self.get_argument("next", default='/decks')
            if next_url:
                self.redirect(next_url)
            else:
                self.redirect("/decks")
        else:
            self.render("templates/login.html", error_msg=data)

class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("session_id")
        self.redirect("/login")

class DeckListHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        decks = list(api.get(api.decks, user_id=1, id_dict=False))
        self.render("templates/decklist.html", decks=decks)

class DeckEditHandler(BaseHandler):
    def get(self, id_):
        if int(id_) >= 0:
            deck = list(api.get(api.decks, user_id=1, id_=id_, id_dict=False))[0]
            cards = db.get_cards_for_deck(id_)
        else:
            deck = { "name": "", "student": "" }
            cards = None
        self.render("templates/deckedit.html", deck=deck, cards=cards)

    def post(self, id_):
        data = {
            "name": self.get_argument("name"),
            "student": self.get_argument("student")
            }
        if int(id_) >= 0:
            api.put(api.decks, data, user_id=1, id_=id_)
        else:
            api.post(api.decks, data, user_id=1)

        self.redirect("/decklist")


class CardEditHandler(BaseHandler):
    def get(self, id_):
        if int(id_) >= 0:
            card = list(api.get(api.cards, user_id=1, id_=id_, id_dict=False))[0]
        else:
            card = { "front": "", "back": "" }
        self.render("templates/cardedit.html", card=card)

    def post(self, id_):
        data = {
            "front": self.get_argument("front"),
            "back": self.get_argument("back")
            }
        if int(id_) >= 0:
            api.put(api.cards, data, user_id=1, id_=id_)
        else:
            api.post(api.cards, data, user_id=1)

        next_url = self.get_argument("next")
        if next_url:
            self.redirect(next_url)
        else:
            self.redirect("/decklist")

class DrillHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, deck_id):
        cards = db.get_cards_for_deck(deck_id)
        card = random.choice(cards)
        self.render("templates/card_drill.html", card=card)

    @tornado.web.authenticated
    def post(self, deck_id):
        print(self.get_argument("response"))

class AddCardHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, deck_id):
        card = { "front": "", "back": "" }
        self.render("templates/cardedit.html", card=card)

    @tornado.web.authenticated
    def post(self, deck_id):
        db.add_card2(deck_id, self.get_argument("front"), self.get_argument("back"))
        self.redirect('/decks/{}/edit'.format(deck_id))

class HomeHandler(BaseHandler):
    def get(self):
        return self.redirect("/decks")

class SignupHandler(BaseHandler):
    def get(self):
        self.render("templates/signup.html", error_msg=None)

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
        output = api.get(self.resource, user_id=1, id_=id_, id_dict=True)
        self.write(output)

    def post(self, id_=None):
        data = tornado.escape.json_decode(self.request.body)
        output = api.post(self.resource, data, user_id=1)
        self.write(output)

    def put(self, id_=None):
        data = tornado.escape.json_decode(self.request.body)
        output = api.put(self.resource, data, id_=id_, user_id=1)
        self.write(output)

    def delete(self, id_=None):
        api.delete(self.resource, id_=id_, user_id=1)

class CardHandler(ApiHandler):
    resource = api.cards


class DeckHandler(ApiHandler):
    resource = api.decks


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
        (r"/logout", LogoutHandler),
        (r"/signup", SignupHandler),
        (r"/decklist", DeckListHandler),
        (r"/cards/(.*)/edit", CardEditHandler),
        (r"/decks/(.*)/edit", DeckEditHandler),
        (r"/decks/(.*)/addcard", AddCardHandler),
        (r"/decks/(.*)/drill", DrillHandler),
        (r"/decks", DeckListHandler),
        (r"/.*", HomeHandler),
    ], **settings)


def server_start(config):
    """Create application and start event loop."""
    app = make_app(config)
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
