#!/usr/bin/python3
"""Module that handles views for reflections"""

from api.v1.views import app_views
from models import storage
from models.reflection import Reflection
from flask import jsonify, abort, request


@app_views.route("/reflections", strict_slashes=False, methods=["GET"])
def get_reflections():
