
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL,
    name VARCHAR(50),
    phone VARCHAR(20),
    preferred_reminder_type VARCHAR(20)
);



CREATE TABLE medications(
    med_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id  INTEGER NOT NULL
      REFERENCES users,
    dosage_amt INTEGER,
    dosage_type VARCHAR(30),
    frequency INTEGER,
    per_time VARCHAR(30),
    notes TEXT
);


CREATE TABLE doses(
    dose_id SERIAL PRIMARY KEY,
    user_id  INTEGER NOT NULL
      REFERENCES users,
    med_id  INTEGER NOT NULL
      REFERENCES medications,
    dosage_amt INTEGER,
    dosage_type VARCHAR(30),
    time_taken DATE,
    -- issue above with datetime
    notes TEXT
);

-- test:
