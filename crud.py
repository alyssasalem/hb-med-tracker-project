"""CRUD operations."""

from model import db, User, Medication, Dose, connect_to_db

def create_user(email, password, name = None, phone = None, preferred_reminder_type = None):
    """Create and return a new user."""

    email = email.lower()
    user = User(email=email, password=password, name=name, phone=phone, preferred_reminder_type = preferred_reminder_type)

    db.session.add(user)
    db.session.commit()

    return user


def change_acct_info(user_id, email, password, name, phone, preferred_reminder_type):
    """Changes account info for User object."""
    user = User.query.get(user_id)
    if email is not None and email != '':
        user.email = email
    if password is not None and password != '':
        user.password = password
    if name is not None and name != '':
        user.name = name
    if phone is not None and phone != '':
        user.phone = phone
    if preferred_reminder_type is not None and preferred_reminder_type != '':
        user.preferred_reminder_type = preferred_reminder_type

    db.session.commit()

    return user


def correct_pass(password, user_id):
    """Takes password and user id, 
    and checks if it's the correct password for the associated user."""
    user_pass = db.session.query(User.password).filter(User.user_id == user_id).first()[0]
    if password == user_pass:
        return True
    
    return False


def get_users():
    """ Returns list of all users """

    return User.query.all()


def get_user_by_id(user_id):
    """Finds one user by their id. """

    return User.query.get(user_id)


def get_user_meds(user_id):
    """ Gets medications from user_id. """
    medications = Medication.query.filter(Medication.user_id == user_id).all()
    return medications


def get_dose_history(med_id):
    """Gets medications associated with med_id."""
    doses = Dose.query.filter(Dose.med_id == med_id).all()
    return doses


def create_med(name, user_id, dosage_amt=None, dosage_type=None, frequency=None, per_time=None, notes=None):
    """Create and return a new medication."""

    med = Medication(name=name, user_id=user_id, dosage_amt=dosage_amt, dosage_type=dosage_type, frequency=frequency, per_time=per_time, notes=notes)
    db.session.add(med)
    db.session.commit()

    return med


def create_dose(user_id, med_id, dosage_amt, dosage_type, time, notes=None):
    """Create and return a new dose."""

    dose = Dose(user_id=user_id, med_id=med_id, dosage_amt=dosage_amt, dosage_type=dosage_type, time=time, notes=notes)
    db.session.add(dose)
    db.session.commit()

    return dose


def dictify_list(class_objects_list):
    """ Takes a list of class objects and turns them into a list of dictionaries."""
    dict_list = []
    if len(class_objects_list) != 0:
        ob_class = type(class_objects_list[0])

        for obj in class_objects_list:
            dict_list.append(ob_class.dictify(obj))

    return dict_list

if __name__ == '__main__':
    from server import app
    connect_to_db(app)
