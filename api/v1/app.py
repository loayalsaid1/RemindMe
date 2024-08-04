#!/usr/bin/python3
"""Module for the Flask API v1 app"""

from flask import Flask, jsonify
from api.v1.views import app_views
from models import storage
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.v1.views.auth import auth
from datetime import timedelta
from os import getenv
app = Flask(__name__, template_folder='templates')

# JWT configuration
"""
    These are just arbitrary values for now.
"""
app.config['JWT_SECRET_KEY'] = getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=356)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=356)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(app_views)

# Enable CORS across origins
CORS(app, resources={r"/api/v1/*": {"origins": "*"}})


@app.teardown_appcontext
def teardown_db(exception):
    """Closes the storage on teardown"""
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """This method handles 404 errors"""
    return jsonify({"error": "Uh uh, Not found"}), 404


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5001", debug=False)
