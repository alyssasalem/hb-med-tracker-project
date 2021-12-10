"""CRUD operations."""

from model import db, User, Medication, Dose, connect_to_db

def create_user(email, password):
    """Create and return a new user."""

    email = email.lower()
    user = User(email=email, password=password)

    db.session.add(user)
    db.session.commit()

    return user


def get_users():
    """ Returns list of all users """

    return User.query.all()


def get_user_by_id(user_id):
    """Finds one user by their id. """

    return User.query.get(user_id)


def create_med(name, user_id, dosage_amt=None, dosage_type=None, frequency=None, per_time=None, notes=None):
    """Create and return a new medication."""

    med = Medication(name=name, user_id=user_id)

    db.session.add(med)
    db.session.commit()

    return med

def create_dose(user_id, med_id, dosage_amt, dosage_type, time, notes=None):
    """Create and return a new user."""

    dose = Dose(user_id=user_id, med_id=med_id, dosage_amt=dosage_amt, dosage_type=dosage_type, time=time, notes=notes)

    db.session.add(dose)
    db.session.commit()

    return dose



if __name__ == '__main__':
    from server import app
    connect_to_db(app)
