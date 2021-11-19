from flask import Blueprint, jsonify, request, session

from api.views import posts
from api import collection_posts


# TODO: simplify the post format for postcards
@posts.route("/api/posts/cards", methods=["POST"])
def get_multiple_postcards():
    data = request.get_json()
    access = data["access"]
    courses = data["courses"]
    author_id = data["author_id"]
    posts = filter_posts(access=access, type=2, courses=courses, author_id=author_id)
    
    return jsonify(posts)


@posts.route("/api/posts/get_post", methods=["POST"])
def get_post():
    data = request.get_json()

    try:
        post = collection_posts.find_one({"post_id": data["post_id"]}, projection={"_id": False})
        return jsonify(post) if post else jsonify({"post_id": -1})
    except Exception as e:
        print(e)
        return jsonify({"post_id": -1})


@posts.route("/api/posts/notifs", methods=["POST"])
def get_notifs():
    data = request.get_json()
    courses = data["courses"]
    author_id = data["author_id"]
    notifs = filter_posts(access=1, type=1, courses=courses, author_id=author_id)
    
    return jsonify(notifs)


@posts.route("/api/posts/comments", methods=["POST"])
def get_comments():
    data = request.get_json()
    access = data["access"]
    author_id = data["author_id"]
    indices = data["comments"]

    comments = filter_posts(access=access, type=3, indices=indices, author_id=author_id)

    return jsonify(comments)


# helper functions

# filter_posts: filter posts, notifs or comments with reagard to author_id and course_id
'''
    access: 1: course; 2: public
    type: 0: any; 1: notification; 2: post; 3: comment
    indices, courses: [0]: any
    author_id: 0: any
'''
def filter_posts(access=2, type=0, indices=[0], courses=[0], author_id=0):
    post_filters = {"access": access}
    projection = {"_id": False}

    if type != 0:
        post_filters["post_type"] = type
    if 0 not in indices:
        post_filters["post_id"] = {"$in": indices}
    if 0 not in courses:
        post_filters["course_id"] = {"$in": courses}
    if author_id != 0:
        post_filters["author_id"] = author_id
    # print(post_filters)

    try:
        filtered_posts = []
        for post in collection_posts.find(post_filters, projection=projection):
            filtered_posts.append(post)
        return filtered_posts
    except Exception as e:
        print(e)
        return []