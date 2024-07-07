#!/usr/bin/python3
"""This module implements the authentication routes"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from flask_jwt_extended import get_jwt_identity
from api.v1.utils import get_user_by_email

auth = Blueprint('auth', __name__)


@auth.route('/auth/login', methods=['POST'])  # Login route
def login():
    """The login route"""
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = get_user_by_email(email)

    if not user or not user.verify_password(password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200


@auth.route('/refresh', methods=['POST'])  # Refresh route
@jwt_required(refresh=True)
def refresh():
    """Method to refresh the access token"""
    current_user = get_jwt_identity()  # Get current user
    new_token = create_access_token(identity=current_user)  # Create new token
    return jsonify(access_token=new_token), 200
