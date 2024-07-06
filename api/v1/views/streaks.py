#!/usr/bin/python3
"""Module that handles views for user streaks"""

from api.v1.views import app_views
from models import storage
from models.streak import Streak
from models.user import User
from flask import jsonify, abort, request


@app_views.route(
    "/users/<user_id>/streak", methods=['GET'], strict_slashes=False)
def get_user_streak(user_id):
    """Retrieves the streak of a specific user"""
    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")
    streak = storage.get(Streak, user_id)
    if not streak:
        return jsonify({"days": 0})  # Return 0 if streak doesn't exist
    return jsonify(streak.to_dict())
