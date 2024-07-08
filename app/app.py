#!/usr/bin/python3
"""Set up the flask app"""
from flask import Flask, flash,render_template, request, redirect, url_for, session
from markupsafe import escape
from flask_login import LoginManager, login_user, current_user, logout_user, login_required
from urllib.parse import urlparse, urljoin
from flask import flash, get_flashed_messages
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, JWTManager
from flask import make_response
from dummy import users
app = Flask(__name__)
app.config['SESSION_PERMANENT'] = True
app.secret_key = b"secret_key"

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Replace with a secure key
jwt = JWTManager(app)

@login_manager.user_loader
def load_user(user_id):
	return users.get(user_id)
	

def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
           ref_url.netloc == test_url.netloc

@app.route("/", strict_slashes=False)
def home():
	"""Home route"""
	if current_user.is_authenticated:
		return render_template("index.html", username=current_user.username)
	else:
		return render_template("index.html", username=None)


@app.route("/login", methods=["GET", "POST"],
		   strict_slashes=False)
def login():
	"""Log user in"""
	if request.method == "POST":
		username = request.form.get("user_name")
		password = request.form.get("password")

		if username in users and users[username].password == password:
			user = users[username]
			print(request.form.get('remember_me', False))
			login_user(user, remember=request.form.get('remember_me', False))
			flash('Logged in', category='success')
			flash('You have been successfully logged in!', 'success')

			next_page = request.args.get('next') or session.get('next')
			if  next_page and is_safe_url(next_page):
				return redirect(next_page)
			
			access_token = create_access_token(identity={'username': username})
			response = make_response(redirect(url_for('profile')))
			response.set_cookie('access_token_cookie', access_token, httponly=False)  # Secure=True if using HTTPS

			return response


		else:
				
			flash('Incorrect username or password. Please try again.', 'error')

			return render_template("login.html")			

	return render_template("login.html")			



@app.route("/profile", strict_slashes=False)
def profile():
	"""Profile route"""
	if current_user.is_authenticated:
		full_name = current_user.full_name
		return render_template("profile.html", name=full_name)
	else:
		return redirect(url_for('home'))

		

@app.route('/logout')
def logout():
	"""logout"""
	if current_user.is_authenticated:
		logout_user()
	return redirect(url_for('home'))


@app.route("/protected", strict_slashes=False)
@login_required
def protected():
	return render_template("protected.html")

@app.errorhandler(404)
def not_found(error):
	"""Handle 404 error"""
	return escape("Lost?!\n Consider having a remidner!"), 404

if __name__ == "__main__":
	app.run(debug=True)
