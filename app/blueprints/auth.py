#!/usr/bin/python3
"""Blueprint for authentication routes"""

from flask import Blueprint, render_template, redirect, url_for, request
from flask import flash, make_response
from flask_login import login_user, logout_user, current_user, login_required
from flask_jwt_extended import create_access_token
from models import storage
from models.user import User
from app.blueprints.utils import RegisterFrom, LoginFrom, is_safe_url
from app.blueprints.utils import make_initial_username, FinalizeProfile
import os
from imagekitio import ImageKit


auth = Blueprint("auth", __name__)

# ImageKit Credentials
IMAGEKIT_PRIVATE_KEY = "private_edl1a45K3hzSaAhroLRPpspVRqM="
IMAGEKIT_PUBLIC_KEY = "public_tTc9vCi5O7L8WVAQquK6vQWNx08="
IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/loayalsaid1/"

# Create an instance of ImageKit with the credentials
ik = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
    public_key=IMAGEKIT_PUBLIC_KEY,
    url_endpoint=IMAGEKIT_URL_ENDPOINT
)


@auth.route('/register', methods=["GET", "POST"],
            strict_slashes=False)
def register():
    """Register a new user"""
    form = RegisterFrom()
    if form.validate_on_submit():
        email = request.form.get("email")

        if storage.filter_objects(User, "email", email):
            flash("Email already exists", category="danger")
            return render_template('register.html', form=form)

        user = User()

        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.password = request.form.get("password")

        user.user_name = make_initial_username(first_name, last_name)
        user.set_password(user.password)  # Hash and set password
        user.save()

        flash("Successfully registered", category="success")

        login_user(user, remember=True)

        # Create access token and set it in the cookie for authentication
        token = create_access_token(identity=user.id)

        response = make_response(redirect(url_for('auth.finalize_profile')))
        response.set_cookie('access_token_cookie', token, httponly=False)

        return response

    return render_template('register.html', form=form)


@auth.route('/finalize_profile', methods=["GET", "POST"], strict_slashes=False)
@login_required
def finalize_profile():
    """
    Finalize the user profile by updating the user's information.

    This route is accessible only to authenticated users. It handles the
    finalization of the user profile after the user has submitted the form. The
    form is validated using the `FinalizeProfile` class. If the
    username is different from the current user's username, it checks if the
    username already exists in the database. If the username exists, it displays
    an error message and returns the 'finalize_profile.html' template with the
    form.

    Returns:
    - If the form is valid and the user submits the form:
        - If the username is different and already exists:
            - Render the 'finalize_profile.html' template with the form.
        - If the form contains an image file:
            - Upload the image file to the image storage service.
            - Set the image URL in the user's profile.
            - Update the user's information.
            - Redirect to the 'profile' route.
    - If the form is not valid or the user does not submit the form:
        - Render the 'finalize_profile.html' template with the form and the
          current user's information.
    """
    form = FinalizeProfile()
    if request.method == "POST":
        if form.validate_on_submit():
            image_file = form.image.data
            username = form.username.data
            gender = form.gender.data
            description = form.description.data

            if username != current_user.user_name:
                if storage.filter_objects(User, "user_name", username):
                    flash("Username already exists", category="danger")
                    return render_template('finalize_profile.html', form=form)
            if image_file:
                extention = image_file.filename.split('.')[-1]
                temp_file_path = f'temp_image.{extention}'
                with open(temp_file_path, 'wb') as f:
                    image_file.save(f)
                with open(temp_file_path, 'rb') as f:
                    result = ik.upload_file(
                        file=f, file_name=f'{current_user.user_name}.{extention}')
                os.remove(temp_file_path)

                if result.response_metadata.http_status_code == 200:
                    image_url = result.url
                else:
                    flash("Failed to upload image", category="danger")
                    return render_template('finalize_profile.html', form=form)

            current_user.user_name = username
            current_user.gender = gender
            current_user.description = description
            current_user.img_url = image_url
            storage.save()

            return redirect(url_for('users.profile'))

    return render_template(
        'finalize_profile.html', form=form, user=current_user)


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
    form = LoginFrom()

    if form.validate_on_submit():
        username_or_id = request.form.get("username_or_id")
        password = request.form.get("password")

        try:
            try:
                username_or_id = int(username_or_id)
                user = storage.filter_objects(
                    User, "user_custom_id", username_or_id)[0]
            except ValueError:
                user = storage.filter_objects(
                    User, "user_name", username_or_id)[0]
        except TypeError:
            user = None

        # check if user exists, verify password and login
        if not user or not user.verify_password(password):
            flash('Wrong username or password', category='error')
            return redirect(url_for('auth.login'))

        login_user(user, remember=request.form.get('remember'))
        flash("Logged in successfully, Have a nice day ,and life",
              category='success')
        token = create_access_token(identity=user.id)

        next_page = request.args.get("next")
        if next_page and is_safe_url(next_page):
            response = make_response(redirect(next_page))
        else:
            response = make_response(redirect("/profile"))

        response.set_cookie('access_token_cookie', token, httponly=False)

        return response

    return render_template('login.html', form=form)


@auth.route('/logout', strict_slashes=False)
def logout():
    """Log current user out"""
    if current_user.is_authenticated:
        logout_user()
        flash('Logged out', category='success')
    else:
        flash('Not logged in', category='info')

    return redirect(url_for('auth.login'))
