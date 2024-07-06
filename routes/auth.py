#!/usr/bin/python3
"""Routes for authentication"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required
from models.user import User
from models import storage


# Create a Blueprint instance for authentication routes of our app
auth_bp = Blueprint('auth', __name__)


# Route for user sign-up
@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Process the sign-up form data and create a new user
        email = request.form.get('email')
        password = request.form.get('password')
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')

        # Check if the user already exists
        existing_user = storage.get_user_by_email(email)
        if existing_user:
            flash('Email address already in use.', 'danger')
            return redirect(url_for('auth.signup'))

        # Create a new user instance
        new_user = User(email=email, password=password,
                        first_name=first_name, last_name=last_name)
        storage.new(new_user)
        storage.save()

        # Log the user in and redirect to the home page
        login_user(new_user)
        flash('Account created successfully!', 'success')
        return redirect(url_for('index'))

    # Render the sign-up form
    return render_template('signup.html')

# Route for user login


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Process the login form data
        email = request.form.get('email')
        password = request.form.get('password')

        # Retrieve the user by email
        user = storage.get_user_by_email(email)
        if user and user.verify_password(password):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password.', 'danger')
            return redirect(url_for('auth.login'))

    # Render the login form
    return render_template('login.html')

# Route for user logout


@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('auth.login'))
