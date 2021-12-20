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


"""General helper functions defined below."""
## Change to bottom of server.

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

@app.route("/profile")
def profile():
    """ Show account profile."""
    return render_template("profile.html")


@app.route("/medications")
def med_page():
    """Show page with user's medications currently on file."""
    return render_template("medications.html")


@app.route("/med-history")
def med_history():
    """Show page with user's tracked medication history currently on file."""
    return render_template("med-history.html")


#
#
#
"""Helper functions section.

General helper functions.
Homepage helper functions. """
#
#
#

@app.route("/get-user")
def get_user():
    """ Return user. """
    # for testing, update with working id passing
    user_id = 1
    
    user_object = crud.get_user_by_id(user_id)
    user = User.dictify(user_object)

    return user


#
#
#
"""Helper functions for homepage."""
#
#
#
@app.route("/login", methods=["POST"])
def user_login():
    """ Logs user in."""
    email = request.get_json().get("email")
    password = request.get_json().get("password")

    email = email.lower()

    if User.query.filter(User.email == email).first() and (db.session.query(User.password).filter(User.email == email).first()[0]) == password:
        user = User.query.filter(User.email == email).first()
        session['user'] = user.user_id
        return jsonify({"success": True, "userLogged": session['user']})
    else:
        return jsonify({"success": False, "userLogged": None})


@app.route("/log-out")
def logout():
    """ Logs user out. """
    user_name = None
    user = crud.get_user_by_id(session['user'])

    if user.name is not None:
        user_name = str(user.name)

    del session['user']

    return jsonify({"success": True, "name": user_name})


@app.route("/user-logged")
def user_logged():
    """ Checks the user stored in session."""
    if ('user' in session and (User.query.get(session['user']))):
        user = crud.get_user_by_id(session['user'])
        user_dict = User.dictify(user)
        return jsonify({"user": user_dict})
    else:
        return jsonify({"user": None})


#
#
#
"""Helper functions for sign up page."""
#
#
#

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

#
#
#
"""Helper functions for profile, account info."""
#
#
#

@app.route("/change-acct-info", methods=["POST"])
def change_acct():
    """Allows a user to change their account info."""
    user_id = session['user']
    email = request.get_json().get("email")
    password = request.get_json().get("password")
    name = request.get_json().get("name")
    phone = request.get_json().get("phone")
    preferred_reminder_type = request.get_json().get("preferred_reminder_type")
    current_pass = request.get_json().get("currentPass")
    
    if crud.correct_pass(current_pass, user_id):
        crud.change_acct_info(user_id, email, password, name, phone, preferred_reminder_type)
        return jsonify({"success": True})

    # Add why it didn't pass into the string, maybe. or add on other side.
    return jsonify({"success": False})

#
#
#
"""Helper functions for medication page."""
#
#
#

@app.route("/med-look-up")
def user_meds():
    """Grab user's medications from db, return as list of dictionaries."""
    meds = crud.get_user_meds(session['user'])
    meds_dict = crud.dictify_list(meds)
    return jsonify({"meds": meds_dict})

@app.route("/new-med", methods=["POST"])
def create_med():
    """Create new med associated with user."""
    name = request.form['name']
    dosage_amt = int(request.form['dosage-amt'])
    dosage_type = request.form['dosage-type']
    frequency =  int(request.form['frequency'])
    per_time = request.form['per-time']
    notes = request.form['notes']
    med = crud.create_med(name, session['user'], dosage_amt, dosage_type, frequency, per_time, notes)
    med_dict = Medication.dictify(med)


    return render_template("medications.html")


#
#
#
"""Helper functions for medication history page."""
#
#
#
@app.route("/get-med-history")
def get_med_history():
    """Get medication history. Doses are returned as a dictionary of lists of dictionaries. 
    Each key in the list associates with a med_id, and contains a list of every dose tracked, 
    stored as a dictionary."""
    user = User.query.get(session['user'])
    meds = user.medications
    doses = {}
    for med in meds:
        doses[med.med_id] = crud.dictify_list(med.doses)
        print(f"AHHHHHHHHHHHHHHHHHHHHHHHHHHHH{doses[med.med_id]}")
    dict_meds = crud.dictify_list(meds)

    print(dict_meds)
    print(doses)
    return jsonify({"success": True, "meds": dict_meds, "doses": doses})


@app.route("/new-dose", methods=["POST"])
def create_dose():
    """Create new med associated with user."""
    user_id = session['user']
    med_id = request.form['med-id']
    doseage_amt = dosage_amt = int(request.form['dosage-amt'])
    dosage_type = request.form['dosage-type']
    time = request.form['time']
    notes = request.form['notes']
    dose = crud.create_dose(user_id, med_id, dosage_amt, dosage_type, time, notes)
    dose_dict = Dose.dictify(dose)

    return render_template("med-history.html")


if __name__ == "__main__":
    #Debug toolbar extension
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
