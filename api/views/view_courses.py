from flask import Blueprint, jsonify, request

from api.views import courses
from api import collection_courses


@courses.route("/api/courses/info", methods=["POST"])
def display_courses():
    data = request.get_json()
    courseid = data["course_id"]

    try:
        course = collection_courses.find_one({"course_id": courseid}, projection={"_id": False})
        return jsonify(course) if course != None else {"course_id": ""}
    except Exception as e:
        print(e)
        return jsonify({"course_id": ""})


@courses.route("/api/courses/mycourse", methods=["POST"])
def my_courses():
    data = request.get_json()
    course_ids = data["course_ids"]
    course_list = []

    def process_time(time_string): # input: "19:30"
        temp = time_string.split(":") # ["19", "30"]
        time_number = int(temp[0]) * 100 + int(temp[1]) # 1930
        return time_number

    try:
        courses = collection_courses.find({'course_id':{'$in':course_ids}}, projection={"_id": False})
        for i in courses:
            course_list.append(i)
        sorted_list = sorted(course_list, key = lambda course:(course['lecture_time'][0], process_time(course['lecture_time'][1])))
        #print(sorted_list)
        return jsonify({"sorted_list":sorted_list})

    except Exception as e:
        print(e)
        return jsonify({"sorted_list": ""})


@courses.route("/api/courses/get_name", methods=["POST"])
def get_course_name():
    data = request.get_json()
    courseid = data["course_id"]

    try:
        course = collection_courses.find_one({"course_id": courseid.upper()}, projection={"_id": False, "course_name": True})
        return jsonify(course) if course != None else {"course_name": ""}
    except Exception as e:
        print(e)
        return jsonify({"course_name": ""})