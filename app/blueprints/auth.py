#!/usr/bin/python3
"""Set up the flask app


    I foundout that user_name should be username
"""
from flask import Blueprint, render_template, redirect, url_for, request,\
    flash, make_response
from flask_login import login_user, logout_user, current_user
from flask_jwt_extended import create_access_token
from urllib.parse import urlparse, urljoin
from models import storage
from models.user import User

auth = Blueprint("auth", __name__)


def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and\
        ref_url.netloc == test_url.netloc


@auth.route('/login', methods=["GET", "POST"],
            strict_slashes=False)
def login():
    """Log in user

        if no correct credintials, reload login with a flash

        else:
            if redirected to login page..
                then login and redirect back to where he came form
            else:
                redirect to profile page
    """
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        try:
            user = storage.filter_objects(User, "user_name", username)[0]
        except TypeError:
            user = None

        if not user or not user.password == password:
            flash('Wrong username or password', category='error')
            return redirect(url_for('auth.login'))

        login_user(user, remember=request.form.get('remember'))
        flash("Logged in successfully, Have a nice day ,and life",
              category='success')
        token = create_access_token(identity={'user_id': user.id})

        next_page = request.args.get("next")
        if next_page and is_safe_url(next_page):
            response = make_response(redirect(next_page))
        else:
            response = make_response(str(user))

        response.set_cookie('access_token_cookie', token, httponly=False)

        return response

    return render_template('login.html')


@auth.route('/logout', strict_slashes=False)
def logout():
    """Log current user out"""
    if current_user.is_authenticated:
        logout_user()
        flash('Logged out', category='success')
    else:
        flash('Not logged in', category='info')

    return redirect(url_for('auth.login'))
