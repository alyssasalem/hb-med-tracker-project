"""Seeds database with test data. """

import os
import json
import crud
from model import db, User, Medication, Dose, connect_to_db
import server
from random import choice, randint
from datetime import datetime

# Dropping and creating database
os.system('dropdb meds')
os.system('createdb meds')

# Connects to database and creates tables
connect_to_db(server.app)
db.create_all()



user1 = User(
    email = "test1@email.com", 
    password = "Agoodpass1!", 
    name = "Person Testname",  
    phone = "1 (555)test-phone",  
    preferred_reminder_type = "text")
db.session.add(user1)
db.session.commit()

user2 = User(
    email = "test2@email.net", 
    password = "AGoodPass2@", 
    name = "Nameyname",  
    phone = "222-test-phone",  
    preferred_reminder_type = "text email")
db.session.add(user2)
db.session.commit()

user3 = User(
    email = "test3@email.net", 
    password = "agoodPass3#", 
    name = "Testname",  
    phone = "(333) 333-3333",  
    preferred_reminder_type = "email")
db.session.add(user3)
db.session.commit()

med1 = Medication(name = "Medname1",
                user_id = 1,
                dosage_amt = 10,
                dosage_type = "mg",
                frequency = 2,
                per_time = "day",
                notes = "Take with food. Can cause nausea.")
db.session.add(med1)
db.session.commit()

med2 = Medication(name = "Medname2",
                user_id = 1,
                dosage_amt = 1,
                dosage_type = "l",
                frequency = 1,
                per_time = "week",
                notes = "")
db.session.add(med2)
db.session.commit()

med3 = Medication(name = "Medname3",
                user_id = 1,
                dosage_amt = 1,
                dosage_type = "l",
                frequency = 1,
                per_time = "week",
                notes = "")
db.session.add(med3)
db.session.commit()

dose1 = Dose(user_id = 1,
            med_id = 1,
            dosage_amt = 10,
            dosage_type = "mg",
            time = datetime(2021, 10, 19, 9, 0, 0),
            notes = "Forgot to eat, felt sick.")
db.session.add(dose1)
db.session.commit()

dose2 = Dose(user_id = 1,
            med_id = 1,
            dosage_amt = 10,
            dosage_type = "mg",
            time = datetime(2021, 10, 19, 22, 0, 0),
            notes = "Had a snack, took a bit late")
db.session.add(dose2)
db.session.commit()

dose3 = Dose(user_id = 1,
            med_id = 1,
            dosage_amt = 15,
            dosage_type = "mg",
            time = datetime(2021, 10, 20, 15, 31, 5),
            notes = "forgot to take in morning, had it in afternoon and decided to skip evening.")
db.session.add(dose3)
db.session.commit()

dose4 = Dose(user_id = 1,
            med_id = 1,
            dosage_amt = 10,
            dosage_type = "mg",
            time = datetime(2021, 10, 21, 10, 5, 21),
            notes = "Waited til after breakfast.")
db.session.add(dose4)
db.session.commit()       

