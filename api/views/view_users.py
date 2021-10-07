from flask import Blueprint, jsonify
from api.views import users
from api import login_manager # (put your import here)


# print(__name__)
# users = Blueprint("users", __name__)
# print(login_manager)


@users.route("/register", methods=["POST"])
def user_register():
    message = "Registered a new user."

    return jsonify(message)


@users.route("/login", methods=["POST"])
def user_login():
    fields = ["username", "password"]

    return jsonify({"required fields": fields})