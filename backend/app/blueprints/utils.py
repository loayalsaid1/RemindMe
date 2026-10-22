#!/usr/bin/python3
"""Just a file to hold some utility functions and classes

    So I don't mess up my code.
"""
from flask import request
from urllib.parse import urlparse, urljoin
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FileField
from wtforms import RadioField, TextAreaField
from wtforms.validators import InputRequired, Regexp, Length, Email
from flask_wtf.file import FileField, FileAllowed
from models import storage
from models.user import User


class LoginFrom(FlaskForm):
    """A class representing the class form for login using flask-wtf"""
    username_or_id = StringField("Username/Custom ID", validators=[
          InputRequired(),
          Regexp(
              r'^[A-Za-z0-9]+(\s[A-Za-z0-9]+)*$',
              message="Only letters and numbers are allowed."),
          Length(min=4, max=64)
        ])
    password = PasswordField("Password", validators=[
        InputRequired(),
        Length(min=8, max=64)
    ])

    submit = SubmitField("Log In", render_kw={"class": "submit"})


class RegisterFrom(FlaskForm):
    """Class forming the register form using flask-wtf"""
    first_name = StringField("First Name", validators=[
        InputRequired(),
        Length(max=32)
    ])
    last_name = StringField("Last Name", validators=[
        InputRequired(),
        Length(max=32)
    ])
    email = StringField("Email", validators=[
        InputRequired(),
        Length(max=255),
        Email()
    ])
    password = StringField("Password", validators=[
        InputRequired(),
        Length(min=8, max=64)
    ])
    submit = SubmitField("Register")


class FinalizeProfile(FlaskForm):
    """form to get the rest of user data"""
    username = StringField("Username", validators=[
        InputRequired(),
        Length(min=4, max=32),
        Regexp(
            r'^[A-Za-z0-9]+(\s[A-Za-z0-9]+)*$',
            message="Only letters and numbers are allowed."),

    ])
    gender = RadioField(
        'Gender', choices=[('male', 'Male'), ('female', 'Female')],
        validators=[InputRequired()])
    image = FileField(
        'Profile Image', validators=[FileAllowed(
            ['jpg', 'jpeg', 'png', 'gif', 'webp'])])
    description = TextAreaField('Description', validators=[
        InputRequired(),
        Length(max=512)
        ])
    submit = SubmitField('Done!')


def is_safe_url(target):
    """Function to check the safety of urls to pretect against XSS attacks
        in redirections and stuff
    """
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and\
        ref_url.netloc == test_url.netloc


def make_initial_username(first_name, last_name):
    """Make initial usrname based on first and last name"""
    initial_username = ''.join(
        e for e in f"{first_name}{last_name}" if e.isalnum()).lower()
    existing_users = storage.filter_objects(
        User, "user_name", initial_username)
    if existing_users:
        i = 1
        while True:
            new_username = f"{initial_username}{i}"
            if not storage.filter_objects(User, "user_name", new_username):
                break
            i += 1
        initial_username = new_username
    return initial_username
