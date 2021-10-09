from flask import Blueprint, jsonify, request, flash, session, redirect, url_for
from api.views import users
from functools import wraps

# users = Blueprint("users", __name__)
# hard-coded user data
userinfo = [{'email':'admin@nus.edu', 'password':123}]


@users.route("/register", methods=["POST"])
def user_register():

    data = request.get_json()
    email = data['email']
    password = data['password']
    confirm = data['confirm']
    if not all([email, password, confirm]):
        return jsonify("Invalid input.")
    if password != confirm:
        return jsonify("Inconsistent passwords.")
    for user in userinfo:
        if user['email'] == email: 
            return jsonify("User exists.")
    
    userinfo.append({'email': email, 'password': password})
    print(userinfo)
    return jsonify("Registeration Success!")
    

@users.route("/login", methods=["GET", "POST"])
def user_login():
    print(userinfo)

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
                # curr_user = User()
                # curr_user.id = email
                # login_user(curr_user)
                session[email] = True
                session.permanent = True
                return jsonify({"status": 1, "message": 'Login Success!'})

                # return redirect('../public/index.html')
            else:
                return jsonify({"status": 0, "message": 'Invalid email or password.'})


# TODO: still developing
@users.route('/logout')
def logout(): 
    if request.method == 'GET':
        print(session)
        session.clear() 
        print(session)
        session.pop('logged_in', None) #怎么知道用户
        print(session)
        return redirect(url_for('user_login'))