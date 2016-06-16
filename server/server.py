import json
import os
import time
import tornado.escape # type: ignore
import tornado.ioloop # type: ignore
import tornado.web    # type: ignore
from flask import Flask, render_template, redirect, request, url_for, jsonify

import db
from db import Session, Deck, Card, CardBase, User
import api

app = Flask(__name__)


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

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    return render_template('index.html')

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


@app.route('/api/v1/decks', methods=['GET', 'POST'])
def decklist():
    session = Session()

    if request.method == 'GET':
        ret = {'data':[x.asDict() for x in session.query(Deck)]}
    elif request.method == 'POST':
        data = request.get_json()
        deck = Deck(name=data['name'], student=data['student'], owner_id=1)
        session.add(deck)
        ret = deck.asDict()
        session.commit()

    session.close()

    return jsonify(ret)

@app.route('/api/v1/decks/<int:id>', methods=['PUT', 'DELETE'])
def deckedit(id):
    session = Session()
    data = request.get_json()

    deck = session.query(Deck).filter_by(id=id).first()
    if request.method == 'PUT':
        deck.name = data['name']
        deck.student = data['student']
    elif request.method == 'DELETE':
        session.delete(deck)

    session.commit()
    session.close()

    return jsonify(deck.asDict())



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

def flask_server_start():
    app.run()
