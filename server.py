""" This module is the server for the website. """
# pylint: disable=unused-import
# pylint: disable=import-error
from flask import Flask, render_template, redirect, flash, session, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from model import db, User, Medication, Dose, connect_to_db
import crud
import json
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


"""General functions defined below."""
##

def password_check(word):
    """Checks if password has the correct characters."""
    special_sym = ['$', '@', '#', '%', '!']
    if ((len(word) < 8) 
        or (not any(char.isdigit() for char in word))
        or (not any(char.isupper() for char in word))
        or (not any(char.islower() for char in word))
        or (not any(char in special_sym for char in word))
        ):
        return False

    return True


""" App routes defined below. """
##

@app.route("/")
def homepage():
    """ Show the homepage."""
    return render_template("homepage.html")


@app.route("/sign-up")
def sign_up():
    """ Show sign-up form."""
    return render_template("sign-up.html")


@app.route("/add-user", methods=["POST"])
def add_user():
    """ Add new user."""
    email = request.get_json().get("email")
    password = request.get_json().get("password")

    # fails to add user: 
    # If the email is already in the database, or the password doesn't have the right chars
    if (User.query.filter(User.email == email).first()) or (not password_check(password)):
        return jsonify({"success": False, "userAdded": None})

    #add logic to tell user why their sign up didn't work

    new_user = User.dictify(crud.create_user(email, password))

    return jsonify({"success": True, "userAdded": new_user})


@app.route("/login", methods=["POST"])
def user_login():
    """ Logs user in."""
    email = request.get_json().get("email")
    password = request.get_json().get("password")

    email = email.lower()

    if User.query.filter(User.email == email).first() and (db.session.query(User.password).filter(User.email == email).first()[0]) == password:
        user = User.query.filter(User.email == email).first()
        session['user'] = user.user_id
    #Largely for testing purposes, tbh.
    if 'user' in session:
        user_id = int(session['user'])
    else:
        return jsonify({"success": False, "userLogged": None})

    return jsonify({"success": True, "userLogged": user_id})


@app.route("/get-user")
def get_user():
    """ Return user. """
    # for testing, update with working id passing
    user_id = 1
    
    user_object = crud.get_user_by_id(user_id)
    user = User.dictify(user_object)

    return user


@app.route("/user-logged")
def user_logged():
    """ Checks the user stored in session."""
    if ('user' in session):
        return User.dictify(session['user'])
    else:
        return None


if __name__ == "__main__":
    #Debug toolbar extension
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
