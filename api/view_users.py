from flask import Blueprint, jsonify


users = Blueprint("users", __name__)


@users.route("/register", methods=["POST"])
def user_register():
    message = "Registered a new user."

    return jsonify(message)


@users.route("/login", methods=["POST"])
def user_login():
    fields = ["username", "password"]

    return jsonify({"required fields": fields})