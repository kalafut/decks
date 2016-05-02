import json
import os
import tornado.escape # type: ignore
import tornado.ioloop # type: ignore
import tornado.web    # type: ignore

import db

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self) -> db.User:
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

class DeckHandler(BaseHandler):
    def get(self):
        results = db.get_decks(1)
        self.write({"decks":results})

    def post(self):
        raise Exception("Unsupported")

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
        #(r"/guid/(.*)", MainHandler, dict(store=mysql.MySQLStore(config))),
        #(r"/guid", MainHandler, dict(store=mysql.MySQLStore(config))),
        (r"/decks", DeckHandler),
        (r"/word/add", AddHandler),
        (r"/words", WordsHandler),
        (r"/login", LoginHandler),
        (r"/signup", SignupHandler),
        (r"/", HomeHandler),
        #(r"/static/(.*)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    ], **settings)


def server_start(config):
    """Create application and start event loop."""
    app = make_app(config)
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()