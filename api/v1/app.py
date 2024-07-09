#!/usr/bin/python3
"""Module for the Flask app"""

from flask import Flask, jsonify
from api.v1.views import app_views
from models import storage
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.v1.views.auth import auth
from datetime import timedelta

app = Flask(__name__)

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'CIBwsUdxn67Uezxe8JAa_OLHuiPn0wQIHFZvv3pjEZo'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=17)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(app_views)

CORS(app, resources={r"/api/v1/*": {"origins": "*"}})


@app.teardown_appcontext
def teardown_db(exception):
    """Closes the storage on teardown"""
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """This method handles 404 errors"""
    return jsonify({"error": "Uh uh, Not found"}), 404
