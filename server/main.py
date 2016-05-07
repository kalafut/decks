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

    db.connect("sqlite:///test.db", init=init, sample_data=sample_data)

    print("Starting server on port 8888...")
    server.server_start(config)
