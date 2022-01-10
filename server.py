""" This module is the server for the website. """
# pylint: disable=unused-import
# pylint: disable=import-error
from flask import Flask, render_template, redirect, flash, session, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from model import db, User, Medication, Dose, connect_to_db
import datetime
import calendar
import crud
import json
import os
from jinja2 import StrictUndefined
from twilio.rest import Client 

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


#Test phone number
MY_PHONE = os.environ["MY_PHONE"]

# Twilio App keys 
account_sid = os.environ["ACCOUNT_SID"]
auth_token = os.environ["AUTH_TOKEN"]
client = Client(account_sid, auth_token)
messaging_sid = os.environ["MESSAGING_SERVICE_SID"]

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


@app.route("/reminders")
def reminders():
    """ Show medication reminders."""
    return render_template("reminders.html")


"""
#
#
#
Helper functions section.

General
Homepage
Sign Up 
Profile
    Account Info
    Medications
    Medication History
#
#
#
"""




"""
#
#
#
General helper functions defined below.
#
#
#
"""


def get_user(user_id):
    """ Return user as dictionary. """

    user_object = crud.get_user_by_id(user_id)
    user = User.dictify(user_object)

    return user


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


def send_reminder(dose_id):
    """Sends a message to user to remind them to take their medication."""
    # For testing and demo purposes, all reminders have been sent to my phone number.
   
    dose_instance = Dose.query.get(dose_id)
    
    phone = MY_PHONE
    # example code for implementing this feature to work with any user's phone:
    #   user = User.query.get(dose_instance.user_id)
    #   phone = user.phone
    med = Medication.query.get(dose_instance.med_id)
    reminder_time = str(dose_instance.time.time())

    message_body = f"It's {reminder_time}. Time to take {dose_instance.dosage_amt}{dose_instance.dosage_type} of {med.name}. Notes: {dose_instance.notes}"
    message = client.messages.create(
                              messaging_service_sid=messaging_sid,
                              body=message_body,
                              to= phone
                          )
    print(message.sid)

    freq = med.frequency
    if med.per_time == 'once':
        crud.del_dose(dose_id)
    else:
        if med.per_time == 'hour':
            min_interval = int(60/freq)
            new_datetime = dose_instance.time + datetime.timedelta(minutes=min_interval)
        elif med.per_time == 'day':
            hr_interval = int(24/freq)
            new_datetime = dose_instance.time + datetime.timedelta(hours=hr_interval)
        elif med.per_time == 'week':
            day_interval = int(7/freq)
            new_datetime = dose_instance.time + datetime.timedelta(days=day_interval)
        elif med.per_time == 'month':
            days_in_month = calendar.monthrange(dose_instance.time.year, dose_instance.time.month)[1]
            day_interval = int(days_in_month/freq)
            new_datetime = dose_instance.time + datetime.timedelta(days=day_interval)
        dose_instance.time = new_datetime
    
    db.session.commit()



@app.route("/test-reminders")
def reminder_test():
    """ Tests scheduled reminder feature. """
    crud.check_current_reminders()
    return jsonify({"success": True})
        




"""A reminder feature pseudocode:

function that grabs every dose from the current day for the user. Or all future doses? good feature for profile
function that creates new doses based on user input, and sets times based on if user adds a new time
function that creates a reminder from a dose. Called from other function?

when creating a new dose for the future,
the dose will need to have:
    what time they want to take it
    how often
        if multiple times a day, it'll need to create two new doses for the same med.
    
have the app route pass along:
    how frequently """




"""
#
#
#
Helper functions for homepage.
#
#
#
"""

@app.route("/login", methods=["POST"])
def user_login():
    """ Logs user in."""
    email = request.get_json().get("email")
    password = request.get_json().get("password")

    email = email.lower()

    if User.query.filter(User.email == email).first() and (db.session.query(User.password).filter(User.email == email).first()[0]) == password:
        user = User.query.filter(User.email == email).first()
        session['user'] = user.user_id
        return jsonify({"success": True, "userLogged": User.dictify(user)})
    else:
        return jsonify({"success": False, "userLogged": None})


@app.route("/log-out")
def logout():
    """ Logs user out. """
    user_name = None
    if 'user' in session and session['user'] is not None:
        user = crud.get_user_by_id(session['user'])

        if user.name is not None:
            user_name = str(user.name)

        del session['user']

    return jsonify({"success": True, "name": user_name})


@app.route("/user-logged")
def user_logged():
    """ Checks the user stored in session."""
    if ('user' in session) and (session['user'] is not None) and (User.query.get(session['user'])):
        user = crud.get_user_by_id(session['user'])
        user_dict = User.dictify(user)
        return jsonify({"user": user_dict})
    else:
        return jsonify({"user": None})



"""
#
#
#
Helper functions for sign up page.
#
#
#
"""


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


"""
#
#
#
Helper functions for profile, account info.
#
#
#
"""


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


"""
#
#
#
Helper functions for medication page.
#
#
#
"""


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

@app.route("/delete-med/<med_id>")
def delete_medication(med_id):
    """Deletes a medication from the user's medication list."""
    med = Medication.query.get(med_id)

    for dose in med.doses:
        delete_dose_history(dose.dose_id)
    db.session.delete(med)
    db.session.commit()

    return render_template("medications.html")


"""
#
#
#
Helper functions for medication history page.
#
#
#
"""

@app.route("/get-med-history")
def get_med_history():
    """Get medication history. Doses are returned as a dictionary of lists of dictionaries. 
    Each key in the list associates with a medication med_id, and contains a list of every dose tracked, 
    stored as a dictionary."""
    user = User.query.get(session['user'])
    meds = user.medications
    doses = {}
    current_time = datetime.datetime.now().replace(second=0, microsecond=0) + datetime.timedelta(hours=-8)
    for med in meds:
        med_hist = Dose.query.filter((Dose.med_id == med.med_id),(User.user_id == user.user_id),(Dose.time < current_time)).order_by(Dose.time).all()
        doses[med.med_id] = crud.dictify_list(med_hist)
    dict_meds = crud.dictify_list(meds)
    return jsonify({"success": True, "meds": dict_meds, "doses": doses})

@app.route("/delete-dose/<dose_id>")
def delete_dose_history(dose_id):
    """Deletes a dose from the medication history of the user."""
    dose = Dose.query.get(dose_id)
    current_time = datetime.datetime.now().replace(second=0, microsecond=0) + datetime.timedelta(hours=-8)
    if dose.time < current_time:
        template = "med-history.html"
    else:
        template = "reminders.html"
    
    crud.del_dose(dose_id)
    return render_template(template)

@app.route("/new-dose", methods=["POST"])
def create_dose():
    """Create new dose associated with user's medication."""
    user_id = session['user']
    med_id = request.form['med-id']
    dosage_amt = dosage_amt = int(request.form['dosage-amt'])
    dosage_type = request.form['dosage-type']
    time = request.form['time']
    notes = request.form['notes']
    dose = crud.create_dose(user_id, med_id, dosage_amt, dosage_type, time, notes)
    current_time = datetime.datetime.now().replace(second=0, microsecond=0) + datetime.timedelta(hours=-8)
    if dose.time < current_time:
        return render_template("med-history.html")
    else:
        return render_template("reminders.html")


@app.route("/get-reminders")
def get_reminders():
    """Get reminders from db. Doses are returned as a dictionary of lists of dictionaries. 
    Each key in the list associates with a medication med_id, and contains a list of every dose tracked, 
    stored as a dictionary."""
    user = User.query.get(session['user'])
    meds = user.medications
    doses = {}
    current_time = datetime.datetime.now().replace(second=0, microsecond=0) + datetime.timedelta(hours=-8)
    for med in meds:
        med_hist = Dose.query.filter((Dose.med_id == med.med_id),(User.user_id == user.user_id),(Dose.time > current_time)).order_by(Dose.time).all()
        doses[med.med_id] = crud.dictify_list(med_hist)
    dict_meds = crud.dictify_list(meds)
    print("running")
    return jsonify({"success": True, "meds": dict_meds, "doses": doses})



if __name__ == "__main__":
    #Debug toolbar extension
    connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")
