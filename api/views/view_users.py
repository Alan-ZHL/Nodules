from flask import Blueprint, jsonify, request, session
from api.views import users

# hard-coded user data
userinfo = [{"user_id": 0, 'email':'test_user@nus.edu', 'password':123, "username": "tester"}]


@users.route("/register", methods=["POST"])
def user_register():
    if request.method == "POST":
        data = request.get_json()
        email = data['email']
        password = data['password']
        confirm = data['confirm']
        username = data["username"]
        if not all([email, password, confirm]):
            return jsonify("Invalid input.")
        if password != confirm:
            return jsonify("Inconsistent passwords.")
        for user in userinfo:
            if user['email'] == email: 
                return jsonify("User exists.")
        
        new_user = {"user_id": len(userinfo), 'email': email, 'password': password, "username": username}
        userinfo.append(new_user)
        return jsonify("Registeration Success!")
    

@users.route("/login", methods=["GET", "POST"])
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
                print('match')
                session[email] = True
                session.permanent = True
                session["user_id"] = user["user_id"]
                session["username"] = user["username"]
                return jsonify({"status": 1, "message": 'Login Success!'})
        

# # TODO: still developing
# @users.route("/users/info", methods=["POST"])
# def get_userinfo():
#     logined_userid = -1 if session.get("user_id") == None else session.get("user_id")
#     if logined_userid < 0:
#         print("no such user_id")
#         return jsonify({"found": 0})
    
#     current_user = None
#     for user in userinfo:
#         if user["user_id"] == logined_userid:
#             current_user = user
#             break
    
#     if current_user == None:
#         print("user not found")
#         return jsonify({"found": 0});

#     print("user found.")
#     return jsonify({"found": 1, "username": current_user["username"], "email": current_user["email"]})


# # TODO: still developing
# @users.route('/logout')
# def logout(): 
#     if request.method == 'GET':
#         print(session)
#         session.clear() 
#         print(session)
#         session.pop('logged_in', None) #怎么知道用户
#         print(session)