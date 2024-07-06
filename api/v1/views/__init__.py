#!/usr/bin/python3
"""Blueprint for the views"""

from flask import Blueprint

app_views = Blueprint("app_views", __name__, url_prefix="/api/v1")

# Import all views of RemindMe app
from api.v1.views.users import *
from api.v1.views.reflections import *
from api.v1.views.reminders import *
from api.v1.views.streaks import *
