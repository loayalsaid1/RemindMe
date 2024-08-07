#!/usr/bin/python3
"""This module implements the authentication routes
    It also implements the upload image route using ImageKit
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from flask_jwt_extended import get_jwt_identity
from models import storage
from models.user import User
import os
from imagekitio import ImageKit

auth = Blueprint('auth', __name__, url_prefix='/api/v1')

# ImageKit Credentials
IMAGEKIT_PRIVATE_KEY = os.getenv('IMAGEKIT_PRIVATE_KEY')
IMAGEKIT_PUBLIC_KEY = os.getenv('IMAGEKIT_PUBLIC_KEY')
IMAGEKIT_URL_ENDPOINT = os.getenv('IMAGEKIT_URL_ENDPOINT')

# Create an instance of ImageKit with the credentials
ik = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
    public_key=IMAGEKIT_PUBLIC_KEY,
    url_endpoint=IMAGEKIT_URL_ENDPOINT
)


@auth.route('/auth/login', methods=['POST'], strict_slashes=False)
def login():
    """The login route"""
    email = request.json.get('email')
    password = request.json.get('password')


    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = storage.get_user_by_email(email)  # Get user from DB

    # Verify password
    if not user or not user.verify_password(password):
        return jsonify({"msg": "Bad email or password"}), 401

    # Create access token and return it
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

# Commented out due to dormancy of the refresh route
# @auth.route('/refresh', methods=['POST'])  # Refresh route
# @jwt_required(refresh=True)
# def refresh():
#     """Method to refresh the access token"""
#     current_user = get_jwt_identity()  # Get current user
#     new_token = create_access_token(identity=current_user)  # Create new token
#     return jsonify(access_token=new_token), 200


@auth.route('/upload', methods=['POST'])
def upload_image():
    """Method to manage image upload using ImageKit"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files['image']  # Get image from request

    extention = image.filename.split('.')[-1]  # Get image extention
    temp_file_path = f'/tmp/temp_image.{extention}'  # Create temporary file
    image.save(temp_file_path)  # Save image to temporary file

    # Upload image to ImageKit
    with open(temp_file_path, 'rb') as f:
        result = ik.upload_file(
            file=f, file_name=f'temp_image.{extention}')


    os.remove(temp_file_path)  # Remove temporary file

    if result.response_metadata.http_status_code == 200:
        image_url = result.url
        return jsonify({"url": image_url}), 200
