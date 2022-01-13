'use strict';

//ideating on condensing html. Would a function be a bad way of doing this? Perhaps a for loop on an array of dictionaries?
function InfoField(props) {
  return (    
    //dissecting this div:
    // classname should be the same for all
    // label htmlFor = idname
    // User's {fieldname}: {props.user[field]}
    // value = first part of react set state, state
    // onchange event goes to setState function
    // placeholder = props.user[field]
    //so calling this could be: <InfoField fieldname = {name}
  <div className="acct-info">
    <label htmlFor="nameInput">
    <section>User's Name: {props.user['name']} </section>
    <input
    className="form-input"
    value={name}
    onChange={event => setName(event.target.value)}
    id="nameInput"
    placeholder={props.user['name']}
    />
    </label>
</div>)

}

//changes user info, must implement all fields and add current password check
function ChangeInfo (props) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const password = props.user['password']
  const [preferredReminderType, setPreferredReminderType] = React.useState('');
  const [currentPass, setCurrentPass] = React.useState('')
 
  // const [phone, setPhone] = React.useState(props.user['phone']);
  // const [preferred_reminder_type, setPreferred_reminder_type] = React.useState(props.user['preferred_reminder_type']);


  //sends info to server
  function sendInfo() {
    return function () {
    console.log(email, password, name, phone, preferredReminderType, currentPass);
    fetch('/change-acct-info', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, name, phone, preferredReminderType, currentPass}),
    })
    .then(response => response.json()
    .then(jsonResponse => {
      console.log(jsonResponse)
    })); 
  }
}
  return (
    // look into using function or forloop+array to condense html 
   <React.Fragment>
     <section id="acct-info-container">
    <div className="acct-info">
      <label htmlFor="nameInput">
        <p>User's Name: {props.user['name']} </p>
        <input
        className="form-input"
        value={name}
        onChange={event => setName(event.target.value)}
        id="nameInput"
        placeholder={props.user['name']}
        />
        </label>
    </div>

    <div className="acct-info">
      <label htmlFor="emailInput">
        <p>User's Email: {props.user['email']} </p>
        <input
        className="form-input"
        value={email}
        onChange={event => setEmail(event.target.value)}
        id="emailInput"
        placeholder={props.user['email']}
        />
        </label>
    </div>
    
    <div className="acct-info">
      <label htmlFor="phoneInput">
        <p>User's Phone: {props.user['phone']} </p>
        <input
        className="form-input"
        value={phone}
        onChange={event => setPhone(event.target.value)}
        id="phoneInput"
        placeholder={props.user['phone']}
        />
        </label>
    </div>

    <div className="acct-info">
      <label htmlFor="preferredInput">
        <p>User's Preferred Reminder Type: {props.user['preferred_reminder_type']} </p>
        <select
        className="form-input"
        value={preferredReminderType}
        onChange={event => setPreferredReminderType(event.target.value)}
        id="preferredInput">
          <option value="text">Text</option>
          <option value="email">Email</option>
        </select>
        </label>
    </div>

    <div className="acct-info">
      <label htmlFor="currentPassInput">
        <p>Input User's Current Password: {props.user['currentPass']} </p>
        <input
        className="form-input"
        type="password"
        value={currentPass}
        onChange={event => setCurrentPass(event.target.value)}
        id="currentPassInput"
        />
        </label>
    </div>

      <button className="btn" type="button" onClick={sendInfo}>
        Change Info
      </button>
    </section>

    <button
    className="btn"
    type="button"
    onClick={(e) => {
    e.preventDefault();
    window.location.href='/medications';
    }}>Medications</button>
    <br></br>

    <button
    className="btn"
    type="button"
    onClick={(e) => {
    e.preventDefault();
    window.location.href='/med-history';
    }}>User's Medication history</button>
    <br></br>

    <button
    className="btn"
    type="button"
    onClick={(e) => {
    e.preventDefault();
    window.location.href='/reminders';
    }}>Future Doses and Beta Reminder Feature</button>
   </React.Fragment>
  )
}


function AccountInfo(props) {
  const user = props.user;
  return (
    <React.Fragment>
      <div className="acct-info acct-display">
        <span className="acct-info info-name">Username:</span> <span className="info-data">{user['name']}</span>
      </div>
      <div>
        <span className="acct-info info-name">Email:</span> <span className="info-data">{user['email']}</span>
      </div>
      <div>
        <span className="acct-info info-name">Phone:</span> <span className="info-data">{user['phone']}</span>
      </div>
      <div>
        <span className="acct-info info-name">Preferred method of contact:</span> 
        <span className="info-data">{user['preferred_reminder_type']}</span>
      </div>
    </React.Fragment>
  )
}



// function to show user
function ShowUserInSession() {
  const [user, setUser] = React.useState('');
// Fetch logged in user.
  React.useEffect(() => {
    fetch('user-logged')
      .then(response => response.json())
      .then(result => {
        setUser(result.user);
      });
  }, []);

  
  //returns user in session, or refers user to mainpage.
  if (user === null) {
    return (
    <section>You're not logged in. 
        <br></br>
        <button
        className="btn"
        type="button"
        onClick={(e) => {
        e.preventDefault();
        window.location.href='/sign-up';
        }}>Sign Up</button>
        <br></br>

        <button
        className="btn"
        type="button"
        onClick={(e) => {
        e.preventDefault();
        window.location.href='/';
        }}>Go back to login.</button>
        <br></br>
    </section> 
    ); }
  else {
    const noName = (user.name === null);
    return (
      <React.Fragment>
        <h1 id="session-user">
          {noName ? 
          (<section>{user['email']}</section>
          ) : (
          <section>{user['name']}</section>)}
        </h1>
        <AccountInfo user={user}/>
        <ChangeInfo user={user} />
      </React.Fragment>) }
  //belongs to ShowUserInSession container 
  }


ReactDOM.render(<ShowUserInSession />, document.querySelector('#account-info'));

