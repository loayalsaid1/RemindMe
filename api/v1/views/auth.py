#!/usr/bin/python3
"""This module implements the authentication routes"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from flask_jwt_extended import get_jwt_identity
from models import storage
from models.user import User
import os
from imagekitio import ImageKit

auth = Blueprint('auth', __name__, url_prefix='/api/v1')
upload = Blueprint('upload', __name__, url_prefix='/api/v1')


# ImageKit Credentials
IMAGEKIT_PRIVATE_KEY = "private_edl1a45K3hzSaAhroLRPpspVRqM="
IMAGEKIT_PUBLIC_KEY = "public_tTc9vCi5O7L8WVAQquK6vQWNx08="
IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/loayalsaid1/"


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

    # import pdb; pdb.set_trace()

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = storage.get_user_by_email(email)

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


@auth.route('/upload', methods=['POST'])
def upload_image():
    """Method to upload an image"""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files['image']

    extention = image.filename.split('.')[-1]
    temp_file_path = f'temp_image.{extention}'
    image.save(temp_file_path)

    with open(temp_file_path, 'rb') as f:
        result = ik.upload_file(
            file=f, file_name=f'mrnobody.{extention}')

    os.remove(temp_file_path)

    if result.response_metadata.http_status_code == 200:
        image_url = result.url
        return jsonify({"url": image_url}), 200
