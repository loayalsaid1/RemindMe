#!/usr/bin/python3
"""Module to instantiate FileStorage to store objects"""

from models.engine.file_storage import FileStorage

storage = FileStorage()
storage.reload()
