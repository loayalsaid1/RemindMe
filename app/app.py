#!/usr/bin/python3
"""Core of the application"""
from flask import Flask, render_template
from flask_jwt_extended import JWTManager
from flask_login import LoginManager, current_user
from markupsafe import escape
from app.blueprints.auth import auth
from app.blueprints.users import users
from models import storage
from models.user import User


app = Flask(__name__)
app.config['SESSION_PERMANENT'] = True
app.secret_key = b"secret_key"

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "auth.login"

app.config['JWT_SECRET_KEY'] = 'CIBwsUdxn67Uezxe8JAa_OLHuiPn0wQIHFZvv3pjEZo'
jwt = JWTManager(app)

app.register_blueprint(auth)
app.register_blueprint(users)


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
        return render_template('index.html', username=current_user.user_name)
    return render_template('index.html')


if __name__ == "__main__":
    app.run(debug=True, port=5000)
