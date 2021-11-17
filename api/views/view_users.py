from flask import Blueprint, jsonify, request, session
from api.views import users

# hard-coded user data
# user_id (testing purpose): 0-999: students; 1001-2000: teachers; 2001 onwards: virtual users (with no detailed info)
userinfo = [
        {
            "user_id": 2001, "user_name": "tester", "email": "test_user@nus.edu", 
            "password": 123, "role": 0, # student; 1:lecturer 2: administer
            "enrolled_courses": ["IT5007", "IT5002", "CS4226"],
            "favored_courses": ["CS5424"],
            "taken_courses": ["IT5001", "IT5003"],
            "about_me": "Hello, testing testing... Hello, testing testing... Hello, testing testing...",
        }
    ]


@users.route("/api/register", methods=["POST"])
def user_register():
    if request.method == "POST":
        data = request.get_json()
        email = data['email']
        password = data['password']
        confirm = data['confirm']
        user_name = data["user_name"]
        if not all([email, password, confirm]):
            return jsonify("Invalid input.")
        if password != confirm:
            return jsonify("Inconsistent passwords.")
        for user in userinfo:
            if user['email'] == email: 
                return jsonify("User exists.")
        
        new_user = {
                "user_id": len(userinfo) + 1, "user_name": user_name, 'email': email,
                'password': password, "role": 0, 
                "enrolled_courses": ["IT5007", "IT5002"],
                "favored_courses": [],
                "taken_courses": ["IT5001", "IT5003"],
                "about_me": "",
            }
        userinfo.append(new_user)
        return jsonify("Registeration Succeeds!")
    

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

        for user in userinfo:
            if user['email'] == email and str(user['password']) == password:
                print('Succeed: login matched.')
                session[email] = True
                session.permanent = True
                session["user_id"] = user["user_id"]
                session["user_name"] = user["user_name"]
                return jsonify({"status": 1, "message": 'Log in Successfuuly!'})

        return jsonify({"status": 0, "message": "Mismatch on email or password."})
        

# TODO: retrieve more personal data besides name and email
@users.route("/api/users/info", methods=["POST"])
def get_userinfo():
    user_id = session.get("user_id")

    if user_id == None:
        print(f"getUserInfo Error: Probably no user has logined.")
        return jsonify({"user_id": -1})
    
    current_user = None
    for user in userinfo:
        if user["user_id"] == user_id:
            current_user = user
            break
    
    if current_user == None:
        print(f"getUserInfor Error: user with id {user_id} is not found.")
        return jsonify({"user_id": -1});

    print(f"Succeed: user {user_id} found.")
    return jsonify(current_user)


# TODO: still developing
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