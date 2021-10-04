from flask import Blueprint, jsonify


posts = Blueprint("posts", __name__)


@posts.route("/add_post", methods=["POST"])
def add_post():
    message = "Added a new post."

    return jsonify(message)


@posts.route("/posts", methods=["GET"])
def display_posts():
    posts = ["post1", "post2"]

    return jsonify({"posts": posts})