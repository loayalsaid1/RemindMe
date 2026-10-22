#!/usr/bin/python3
"""Module for the Flask API v1 app"""
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify, request
from models import storage
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.v1.views.auth import auth
from api.v1.views import app_views
from datetime import timedelta
from os import getenv


app = Flask(__name__, template_folder="templates")

app.config["JWT_SECRET_KEY"] = getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=356)
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = getenv("FLASK_ENV") == "production"
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config["JWT_COOKIE_HTTPONLY"] = True
app.config["JWT_SESSION_COOKIE"] = True
app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token_cookie"
jwt = JWTManager(app)

app.register_blueprint(auth)
app.register_blueprint(app_views)

CORS(
    app,
    resources={r"/api/v1/*": {"origins": getenv("CORS_ORIGINS", "http://localhost:3000")}},
    supports_credentials=True,
)


@app.teardown_appcontext
def teardown_db(exception):
    """Closes the storage on teardown"""
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """This method handles 404 errors"""
    return jsonify({"error": "Uh uh, Not found"}), 404


@app.errorhandler(400)
def bad_request(error):
    """Normalize 400 bodies to one JSON shape."""
    description = getattr(error, "description", None) or "Bad request"
    return jsonify({"statusCode": 400, "path": request.path, "message": description}), 400


@app.errorhandler(403)
def forbidden(error):
    """Normalize 403 bodies to one JSON shape."""
    description = getattr(error, "description", None) or "Forbidden"
    return jsonify({"statusCode": 403, "path": request.path, "message": description}), 403


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5001", debug=False)
