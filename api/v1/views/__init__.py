#!/usr/bin/python3
"""
Blueprint for the views

This module defines the Flask Blueprint for the views of the RemindMe app.

The Blueprint is named "app_views" and has a URL prefix of "/api/v1".

The module imports all the views for the RemindMe app from separate modules.
"""
from flask import Blueprint

app_views = Blueprint("app_views", __name__, url_prefix="/api/v1")

# Import all views of RemindMe app
# from api.v1.views.user_page import *
from api.v1.views.auth import *
from api.v1.views.streaks import *
from api.v1.views.reminders import *
from api.v1.views.reflections import *
from api.v1.views.users import *
from flask import Blueprint