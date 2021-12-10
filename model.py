"""Models for medication tracker app."""
# pylint: disable=unused-import
# pylint: disable=import-error
import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id     = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email       = db.Column(db.String(50), unique=True, nullable=False)
    password    = db.Column(db.String(30), nullable=False)
    name        = db.Column(db.String(50))
    phone       = db.Column(db.String(20))
    preferred_reminder_type = db.Column(db.String(20))

    medications = db.relationship('Medication', back_populates="user")
    doses       = db.relationship('Dose', back_populates="user")

    def dictify(self):
        """Returns instance as dict"""
        return {
            'user_id':  self.user_id,
            'email':    self.email,
            'password': self.password,
            'name':     self.name,
            'phone':    self.phone,
            'preferred_reminder_type': self.preferred_reminder_type,
                        }

    def __repr__(self):
        return f'<User user_id={self.user_id} email={self.email}>'


# CREATE TABLE users(
#     user_id SERIAL PRIMARY KEY,
#     email VARCHAR(50) NOT NULL,
#     password VARCHAR(30) NOT NULL,
#     name VARCHAR(50),
#     phone VARCHAR(20),
#     preferred_reminder_type VARCHAR(20)
# );


class Medication(db.Model):
    """A medication."""

    __tablename__ = "medications"

    med_id      = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name        = db.Column(db.String(50), nullable=False)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    dosage_amt  = db.Column(db.Integer)
    dosage_type = db.Column(db.String(30))
    frequency   = db.Column(db.Integer)
    per_time    = db.Column(db.String(30))
    notes       = db.Column(db.Text)
    
    user        = db.relationship('User', back_populates="medications")
    doses       = db.relationship('Dose', back_populates="medication")

    def dictify(self):
        """Returns instance as dict"""
        return {
            'med_id':       self.med_id,
            'name':         self.name,
            'user_id':      self.user_id,
            'dosage_amt':   self.dosage_amt,
            'dosage_type':  self.dosage_type,
            'frequency':    self.frequency,
            'per_time':     self.per_time,
            'notes':        self.notes,
        }

    def __repr__(self):
        return f'<Medication med_id={self.med_id} name={self.name}>'


# CREATE TABLE medications(
#     med_id SERIAL PRIMARY KEY,
#     name VARCHAR(50) NOT NULL,
#     user_id  INTEGER NOT NULL
#       REFERENCES users,
#     dosage_amt INTEGER,
#     dosage_type VARCHAR(30),
#     frequency INTEGER,
#     per_time VARCHAR(30),
#     notes TEXT
# );

class Dose(db.Model):
    """A singular instance of medication dosage."""

    __tablename__ = "doses"

    dose_id     = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    med_id      = db.Column(db.Integer, db.ForeignKey('medications.med_id'), nullable=False)
    dosage_amt  = db.Column(db.Integer)
    dosage_type = db.Column(db.String(30))
    time        = db.Column(db.DateTime)
    notes       = db.Column(db.Text)
    
    user        = db.relationship('User', back_populates="doses")
    medication  = db.relationship('Medication', back_populates="doses")

    def dictify(self):
        """Returns instance as dict"""
        return {
            'dose_id'       : self.dose_id,
            'user_id'       : self.user_id,
            'med_id'        : self.med_id,
            'dosage_amt'    : self.dosage.amt,
            'dosage_type'   : self.dosage_type,
            'time'          : self.time,
            'notes'         : self.notes,
        } 

    def __repr__(self):
        return f'<Dose dose_id={self.user_id} med_id={self.med_id}>'
# CREATE TABLE doses(
#     dose_id SERIAL PRIMARY KEY,
#     user_id  INTEGER NOT NULL
#       REFERENCES users,
#     med_id  INTEGER NOT NULL
#       REFERENCES medications,
#     time TIME NOT NULL,
#     dosage_amt INTEGER,
#     dosage_type VARCHAR(30),
#     time_taken DATE,
#     notes TEXT
# );



def connect_to_db(flask_app, db_uri="postgresql:///meds", echo=True):
    """ Connects to database"""
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    # probably get rid of this after testing
    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    #note from another hw that I think is helpful:
    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
