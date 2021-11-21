from flask import Blueprint, jsonify, request, session
from pymongo import DESCENDING

from api.views import users
from api import collection_users


@users.route("/api/register", methods=["POST"])
def user_register():
    if request.method == "POST":
        data = request.get_json()
        email = data['email']
        password = data['password']
        confirm = data['confirm']
        user_name = data["user_name"]
        if not all([email, password, confirm]):
            return jsonify("Sorry, all the input fields are required.")
        if password != confirm:
            return jsonify("Inconsistent passwords.")
        
        try:
            existent_user = collection_users.find_one({"email": email}, projection={"password": False})
            if existent_user != None:
                return jsonify("User exists with this email. Please try a new one.")
            
            # default role: student (user_id >= 3001)
            max_id = 3000
            for user in collection_users.find(filter={}, sort=[("user_id", DESCENDING)], limit=1, projection={"user_id": True}):
                if user["user_id"] > max_id:
                    max_id = user["user_id"]
            new_user = {
                    "user_id": max_id + 1, "user_name": user_name, 'email': email,
                    'password': password, "role": 0, 
                    "enrolled_courses": ["IT5007", "IT5002"],
                    "favored_courses": [],
                    "taken_courses": ["IT5001", "IT5003"],
                    "about_me": "",
                }
            collection_users.insert_one(new_user)
            return jsonify("Registeration Succeeds!")
        except Exception as e:
            print(e)
            return jsonify("Registration failed due to server error.")
    

@users.route("/api/login", methods=["GET", "POST"])
def user_login():
    if request.method == "POST":
        data = request.get_json()
        email = data['email']
        remember = data['remember']
        password = str(data['password'])

        if not email or not password:
            return jsonify({"status": 0, "message": "Invalid input."})

        # ip = request.remote_addr //for trying limit
        check_comb = {"email": email, "password": password}
        try:
            user = collection_users.find_one(check_comb, projection={"user_id": True, "user_name": True})
            print('Succeed: login matched.')
            session[email] = True
            session.permanent = True
            session["user_id"] = user["user_id"]
            session["user_name"] = user["user_name"]
            return jsonify({"status": 1, "message": 'Log in Successfuuly!'})
        except Exception as e:
            print(e)
            print("Login Error: Fail to find user with given email and password")
            return jsonify({"status": 0, "message": "Mismatch on email or password."})
        

@users.route("/api/users/info", methods=["POST"])
def get_userinfo():
    user_id = session.get("user_id")

    if user_id == None:
        print(f"getUserInfo Error: Probably no user has logined.")
        return jsonify({"user_id": -1})

    try:
        user = collection_users.find_one({"user_id": user_id}, projection={"_id": False, "password": False})
        print(f"Succeed: user {user_id} found.")
        # print(user)
        return jsonify(user)
    except Exception as e:
        print(e)
        print(f"getUserInfor Error: user with id {user_id} is not found.")
        return jsonify({"user_id": -1})


@users.route('/api/logout', methods=["POST"])
def logout(): 
    if request.method == 'POST':
        print("session to be deleted: ", session)    # for tests only
        if session == None:
            print("Logout Error: no session currently.")
            return jsonify({"status": 0})
        
        user_name = session.get("user_name")
        session.clear()
        print(f"Succeed: {user_name} log out successfully. Remaining session info: ", session)    # for tests only
        return jsonify({"status": 1, "user_name": user_name})