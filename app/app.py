#!/usr/bin/python3
"""Set up the flask app"""
from flask import Flask, render_template, request, redirect, url_for
from markupsafe import escape

app = Flask(__name__)


@app.errorhandler(404)
def not_found(error):
	"""Handle 404 error"""
	return escape("Lost?!\n Consider having a remidner!"), 404

@app.route("/", strict_slashes=False)
def home():
	"""Home route"""
	return render_template("index.html")


@app.route("/login", methods=["GET", "POST"],
		   strict_slashes=False)
def login():
	"""Log user in"""
	if request.method == "POST":
		return redirect(url_for('profile'))

	return render_template("login.html")


@app.route("/profile", strict_slashes=False)
def profile():
	"""Profile route"""
	return render_template("profile.html")


if __name__ == "__main__":
	app.run(debug=True)
