#!/usr/bin/python3
"""User page view"""

from flask import render_template
from api.v1.views import app_views


@app_views.route('/user_page', methods=['GET'])
def user_page():
    """Return user page template"""
    return render_template('user_page.html')
