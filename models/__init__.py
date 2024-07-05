#!/usr/bin/python3
"""Module to instantiate FileStorage to store objects"""
import os

storage_t = os.getenv('REMIND_ME_TYPE_STORAGE')

if storage_t == 'db':
    from models.engine.db_storage import DBStorage
    storage = DBStorage()
    storage.reload()
else:
    from models.engine.file_storage import FileStorage
    storage = FileStorage()
    storage.reload()
