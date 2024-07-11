#!/usr/bin/python3
"""Core of the application"""
from flask import Flask, flask_login
from flask_jwt_extended import JWTManager
from flask_login import LoginManager, current_user
from markupsafe import escape
from app.blueprints.auth import auth
from models import storage
from models.user import User


app = Flask(__name__)
app.config['SESSION_PERMANENT'] = True
app.secret_key = b"secret_key"

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth.login"

app.config['JWT_SECRET_KEY'] = 'Your_jwt_secret_key, idiot hacker'
jwt = JWTManager(app)

app.register_blueprint(auth)


@login_manager.user_loader
def load_user(user_id):
    return storage.get(User, user_id)


@app.errorhandler(404)
def not_found(error):
    """Handle 404 error"""
    # Or.. Lost? ... probaby you need a reminder.
    return "<h1>Lost?!\n Consider having some remidner!</h1>", 404


@app.route('/')
def home():
    """Home page"""
    return render_template('index.html', username=current_user.user_name)

if __name__ == "__main__":
    app.run(debug=True)
