import json
import os
import tornado.escape
import tornado.ioloop
import tornado.web

import db

class WordsHandler(tornado.web.RequestHandler):
    def get(self):
        results = db.get_deck_cards(1)

        self.write(json.dumps(results))

    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        db.update_deck_card(data)

class MainHandler(tornado.web.RequestHandler):
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
        "static_path": os.path.join(os.path.dirname(__file__), "static"),
        "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
        "login_url": "/login",
        "xsrf_cookies": False,  # TODO: put this back in
    }
    return tornado.web.Application([
        #(r"/guid/(.*)", MainHandler, dict(store=mysql.MySQLStore(config))),
        #(r"/guid", MainHandler, dict(store=mysql.MySQLStore(config))),
        (r"/words", WordsHandler, dict()),
        #(r"/static/(.*)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
    ], **settings)


def server_start(config):
    """Create application and start event loop."""
    app = make_app(config)
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
