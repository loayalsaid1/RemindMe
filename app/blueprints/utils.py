#!/usr/bin/python3
"""Just a file to hold some utility functions and classes

    So I don't mess up my code.
"""
from flask import request
from urllib.parse import urlparse, urljoin
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FileField
from wtforms.validators import InputRequired, Regexp, Length


class LoginFrom(FlaskForm):
    """A class representing the class form for login using flask-wtf"""
    username_or_id = StringField("Username/Custom ID", validators=[
          InputRequired(),
          Regexp(
              r'^[A-Za-z0-9]+(\s[A-Za-z0-9]+)*$',
              message="Only letters and numbers are allowed."
              ),
          Length(min=4, max=64)
        ])
    password = PasswordField("Password", validators=[
        InputRequired(),
        Length(min=8, max=64)
    ])

    submit = SubmitField("Log In", render_kw={"class": "submit"})


class RegisterFrom(FlaskForm):
    """Class forming the register form using flask-wtf"""
    image = FileField("Profile Image", validators=[InputRequired()])
    submit = SubmitField("Register", render_kw={"class": "submit"})


def is_safe_url(target):
    """Function to check hte safety of urls to pretect against XSS attacks
        in redirections and stuff
    """
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and\
        ref_url.netloc == test_url.netloc
