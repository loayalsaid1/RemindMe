#!/usr/bin/python3
"""Main file for the RemindMe application"""

from api.v1.app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
