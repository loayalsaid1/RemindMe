#!/usr/bin/python3
"""Authentication routes: cookie JWT login, logout, me, image upload."""

from datetime import timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
)
from models import storage
from models.user import User
from api.v1.serializers import user_public_dict
import os
from imagekitio import ImageKit

auth = Blueprint("auth", __name__, url_prefix="/api/v1")

IMAGEKIT_PRIVATE_KEY = os.getenv("IMAGEKIT_PRIVATE_KEY")
IMAGEKIT_PUBLIC_KEY = os.getenv("IMAGEKIT_PUBLIC_KEY")
IMAGEKIT_URL_ENDPOINT = os.getenv("IMAGEKIT_URL_ENDPOINT")

ik = ImageKit(
    private_key=IMAGEKIT_PRIVATE_KEY,
    public_key=IMAGEKIT_PUBLIC_KEY,
    url_endpoint=IMAGEKIT_URL_ENDPOINT,
)

REMEMBER_EXPIRES = timedelta(days=356)


@auth.route("/auth/login", methods=["POST"], strict_slashes=False)
def login():
    """Issue an HttpOnly access cookie. remember=true → 356d, else session."""
    body = request.get_json(silent=True) or {}
    email = body.get("email")
    password = body.get("password")
    remember = bool(body.get("remember"))

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = storage.get_user_by_email(email)
    if not user or not user.verify_password(password):
        return jsonify({"msg": "Bad email or password"}), 401

    expires = REMEMBER_EXPIRES if remember else timedelta(hours=12)
    access_token = create_access_token(identity=user.id, expires_delta=expires)
    response = jsonify(user_public_dict(user))
    cookie_kwargs = {
        "httponly": True,
        "samesite": "Lax",
        "secure": os.getenv("FLASK_ENV") == "production",
        "path": "/",
    }
    if remember:
        cookie_kwargs["max_age"] = int(REMEMBER_EXPIRES.total_seconds())
    response.set_cookie("access_token_cookie", access_token, **cookie_kwargs)
    return response, 200


@auth.route("/auth/logout", methods=["POST"], strict_slashes=False)
def logout():
    """Clear the access cookie."""
    response = jsonify({"success": True})
    unset_jwt_cookies(response)
    response.set_cookie(
        "access_token_cookie",
        "",
        expires=0,
        httponly=True,
        samesite="Lax",
        path="/",
    )
    return response, 200


@auth.route("/auth/me", methods=["GET"], strict_slashes=False)
@jwt_required()
def me():
    """Current user from the cookie. Identity never comes from the body."""
    user_id = get_jwt_identity()
    user = storage.get(User, user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user_public_dict(user)), 200


@auth.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():
    """Upload an image via ImageKit. Auth required."""
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files["image"]
    extention = image.filename.split(".")[-1]
    temp_file_path = f"/tmp/temp_image.{extention}"
    image.save(temp_file_path)

    with open(temp_file_path, "rb") as f:
        result = ik.upload_file(file=f, file_name=f"temp_image.{extention}")

    os.remove(temp_file_path)

    if result.response_metadata.http_status_code == 200:
        return jsonify({"url": result.url}), 200
    return jsonify({"error": "Failed to upload image"}), 500
