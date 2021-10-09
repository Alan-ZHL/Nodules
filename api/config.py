import os
from datetime import timedelta

class Config():
    SECRET_KEY = os.urandom(24)
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_USE_SIGNER = False
    SESSION_KEY_PREFIX = 'session_'