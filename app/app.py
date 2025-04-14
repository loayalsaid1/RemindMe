#!/usr/bin/python3
"""Core of the application"""
from flask import Flask, redirect, url_for, render_template
from flask_jwt_extended import JWTManager
from flask_login import LoginManager, current_user
from markupsafe import escape
from app.blueprints.auth import auth
from app.blueprints.users import users
from app.blueprints.reminders import reminders
from models import storage
from models.user import User
from os import getenv

app = Flask(__name__)
app.config['SESSION_PERMANENT'] = True
app.secret_key = bytes(getenv("SECRET_KEY"), encoding='utf8')

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth.login"

app.config['JWT_SECRET_KEY'] = getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

app.register_blueprint(auth)
app.register_blueprint(users)
app.register_blueprint(reminders)

@login_manager.user_loader
def load_user(user_id):
    """This function called to load a user from the user ID"""
    return storage.get(User, user_id)


@app.errorhandler(404)
def not_found(error):
    """Handle 404 error"""
    return "<h1>Lost?!\n Consider having some reminders!</h1>", 404


@app.teardown_appcontext
def cut_connection(error):
    """define behavior after each request"""
    storage.close()


@app.route('/')
def home():
    """Home page"""
    if current_user.is_authenticated:
        return redirect(url_for('users.user_profile'))
    else:
        return redirect(url_for('landing'))


@app.route('/landing', strict_slashes=False)
def landing():
    """Redirect to landing page"""
    return redirect('https://remindme-l.mystrikingly.com/')

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
