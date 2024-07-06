#!/usr/bin/python3
"""This module defines the user API views"""

from flask import jsonify, request, abort
from models import storage
from models.user import User
from api.v1.views import app_views


@app_views.route('/users', methods=['GET'], strict_slashes=False)
def get_users():
    """Retrieves the list of all users in the RemindMe app"""
    users = storage.all(User).values()
    return jsonify([user.to_dict() for user in users])


@app_views.route("users/<user_id>", methods=['GET'], strict_slashes=False)
def get_user(user_id):
    """Retrieves a specific user in the RemindMe app"""
    user = storage.get(User, user_id)
    if not user:
        abort(404)
    return jsonify(user.to_dict())


@app_views.route('/users', methods=['POST'], strict_slashes=False)
def create_user():
    """Creates a new RemindMe user"""
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()  # Get data from request
    if 'email' not in data or 'password' not in data:
        abort(400, description="Missing email or password")

    new_user = User(**data)  # Create new User
    new_user.save()
    return jsonify(new_user.to_dict()), 201


@app_views.route('/users/<user_id>', methods=['PUT'], strict_slashes=False)
def update_user(user_id):
    """Update the profile of RemindMe user"""
    user = storage.get(User, user_id)
    if not user:
        abort(404)
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()  # Get user data from request
    ignore_keys = ["id", "email", "created_at", "updated_at"]

    for key, value in data.items():
        if key not in ignore_keys:
            setattr(user, key, value)  # Update user
    user.save()
    return jsonify(user.to_dict())


@app_views.route("/user/<user_id>", methods=['DELETE'], strict_slashes=False)
def delete_user(user_id):
    """Delete user, close account, deactivate account"""
    user = storage.get(User, user_id)  # Get specific user
    if user is None:
        abort(404)
    user.delete()
    storage.save()
    return jsonify({})
