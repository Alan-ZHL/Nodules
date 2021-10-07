from flask import Blueprint, jsonify
from api.views import courses


# print(__name__)
# courses = Blueprint("courses", __name__)


@courses.route("/courses", methods=["GET"])
def display_courses():
    courses = ["Math", "Physics"]

    return jsonify(courses)