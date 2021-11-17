from flask import Blueprint, jsonify, request, session
from api.views import posts


# hard-coded data notifications, posts and comments
# TODO: remove "author_name" from post's metadata, and use additional query to retrieve that (allow for changes in user_name)
notifs_sample = [
    {"post_id": 1, "title": "Remember to submit tutorial 4", "access": 0, "post_type": 0, 
    "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
    "author_id": 1001, "author_name": "Prasanna Karthik Vairam", "date":"2021-09-30",
    "content": "remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd! remember to submit tutorial 4 by Oct 3rd!"},
    {"post_id": 2, "title": "Exam date determined", "access": 0, "post_type": 0,
    "course_id": "IT5002", "course_name": "Computer Systems and Applications",
    "author_id": 1002, "author_name": "Colin Tan", "date": "2021-09-03", 
    "content": "Midterm exam is set on Oct 5th. Please be prepared."}, 
    {"post_id": 3, "title": "Welcome to CS4226!", "access": 0, "post_type": 0, 
    "course_id": "CS4226", "course_name": "Internet Architecture", 
    "author_id": 1003, "author_name": "Richard Ma", "date": "2021-08-26", 
    "content": "Welcome to CS4226. I will be the lecturer of this course. Looking forward to meeting all of you!"}
]
posts_sample = [];
comments_sample = [];
for i in range(20):
    title = f"Sample public post {i}" if i < 16 else f"Sample course post {i}"
    access = 1 if i < 16 else 0
    content = "This is a sample course post. Ask me anything!" if i >= 15 else "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product protopost_types beautifully and efficiently."
    snippet = content[:80] + "..."
    posts_sample.append({
        "post_id": 1056 + i, "title": title, "access": access, "post_type": 1,
        "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
        "author_id": 2001, "author_name": "Donald Trump ex", "date": "2 days ago",
        "content": content,
        "snippet": snippet,
        "details": {"likes": 56, "dislikes": 18, "comments": [i*3, i*3+1, i*3+2]}
    })
for i in range(60):
    access = 1 if i < 48 else 0
    content = "Sounds great!" if i < 48 else "Good job!"
    comments_sample.append({
        "post_id": i, "title": "", "access": access, "post_type": 2,
        "course_id": "IT5007", "course_name": "Software Engineering on Application Architecture",
        "author_id": 2002, "author_name": "Biden III", "date": "2 days ago",
        "content": content,
        "details": {"likes": 10, "dislikes": 2}
    })


@posts.route("/api/posts/cards", methods=["POST"])
def get_multiple_postcards():
    data = request.get_json()
    access = data["access"]
    course_id = data["course_id"]
    author_id = data["author_id"]
    posts = filter_posts(posts=posts_sample, access=access, course_id=course_id, author_id=author_id)
    
    return jsonify(posts)


@posts.route("/api/posts/get_post", methods=["POST"])
def get_post():
    data = request.get_json()
    for post in posts_sample:
        if post["post_id"] == data["post_id"]:
            return jsonify(post)
    
    return jsonify({"post_id": -1})


@posts.route("/api/posts/notifs", methods=["POST"])
def get_notifs():
    data = request.get_json()
    course_id = data["course_id"]
    author_id = data["author_id"]
    notifs = filter_posts(posts=notifs_sample, access=0, course_id=course_id, author_id=author_id)
    
    return jsonify(notifs)


@posts.route("/api/posts/comments", methods=["POST"])
def get_comments():
    data = request.get_json()
    access = data["access"]
    author_id = data["author_id"]
    indices = data["comments"]

    comments = []
    if indices != []:
        for idx in indices:
            comments.append(comments_sample[idx])
    else:
        comments = filter_posts(posts=comments_sample, access=access, author_id=author_id)

    return jsonify(comments)


# helper functions

# filter_posts: filter posts, notifs or comments with reagard to author_id and course_id
def filter_posts(posts, access=1, course_id=0, author_id=0):
    filtered_posts = []
    if course_id == 0 and author_id == 0:
        for post in posts:
            if post["access"] == access:
                filtered_posts.append(post)
    elif course_id == 0:
        for post in posts:
            if post["access"] == access and post["author_id"] == author_id:
                filtered_posts.append(post)
    elif author_id == 0:
        for post in posts:
            if post["access"] == access and post["course_id"] == course_id:
                filtered_posts.append(post)
    else:
        for post in posts:
            if post["access"] == access and (post["course_id"] == course_id and post["author_id"] == author_id):
                filtered_posts.append(post)

    return filtered_posts