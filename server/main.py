import sys

import db
import server
import config


if __name__ == "__main__":
    init = False
    sample_data = False

    if "init" in sys.argv:
        init = True
        sample_data = True

    db.connect2("sqlite:///test2.db", init=init, sample_data=sample_data)

    print("Starting server on port 8888...")

    if "flask" in sys.argv:
        server.flask_server_start()
    else:
        server.server_start(config)
