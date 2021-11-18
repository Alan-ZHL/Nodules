import os
from datetime import timedelta

class Config():
    # session-related constants
    SECRET_KEY = os.urandom(24)
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_USE_SIGNER = False
    SESSION_KEY_PREFIX = 'session_'

    # db-related constants
    DB_URL = "mongodb://localhost:27017/"
    DB_NAME = "Nodules"