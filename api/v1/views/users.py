#!/usr/bin/python3
"""This module defines the user API views"""

from flask import jsonify, request, abort
from models import storage
from models.user import User
from api.v1.views import app_views
from flask_jwt_extended import jwt_required, get_jwt_identity


@app_views.route('/users', methods=['GET'], strict_slashes=False)
def get_users():
    """Retrieves the list of all users in the RemindMe app"""
    users = storage.all(User).values()
    return jsonify([user.to_dict() for user in users])


@app_views.route("users/<user_id>", methods=['GET'], strict_slashes=False)
@jwt_required()
def get_user(user_id):
    """Retrieves a specific user in the RemindMe app"""
    current_user_id = get_jwt_identity()  # Get current user
    if current_user_id != user_id:
        abort(403, description="Access forbidden")
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

    new_user = User()  # Create new User
    for key, value in data.items():
        if key not in ['id', 'created_at', 'updated_at']:
            setattr(new_user, key, value)
    new_user.set_password(data['password'])  # Hash and set password
    new_user.save()
    return jsonify(new_user.to_dict()), 201


@app_views.route('/users/<user_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
def update_user(user_id):
    """Update the profile of a RemindMe user"""
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        abort(403, description="Access forbidden")

    user = storage.get(User, user_id)
    if not user:
        abort(404)
    if not request.get_json():
        abort(400, description="Not a JSON")

    data = request.get_json()  # Get user data from request
    ignore_keys = ["id", "created_at", "updated_at"]

    for key, value in data.items():
        if key not in ignore_keys:
            if key == "password":
                user.set_password(value)
            else:
                setattr(user, key, value)  # Update user

    user.save()
    return jsonify(user.to_dict())


@app_views.route("/user/<user_id>", methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_user(user_id):
    """Delete user, close account, deactivate account"""
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        abort(403, description="Access forbidden")

    user = storage.get(User, user_id)
    if not user:
        abort(404, description="User not found")

    user.delete()
    storage.save()
    return jsonify({}), 200

@app_views.route('/check_user/<username>', strict_slashes=False)
def check_user(username):
    """Check if a user with a username exists"""
    user = storage.filter_objects(User, "user_name", username)
    if user:
        return jsonify({'exists': True}), 200

    else:
        return jsonify({'exists': False}), 404
