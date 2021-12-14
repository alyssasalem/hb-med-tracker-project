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
    <p>User's Name: {props.user['name']} </p>
    <input
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
  const phone = props.user['phone']
  const password = props.user['password']
  const preferred_reminder_type = props.user['preferred_reminder_type']
  const [currentPass, setCurrentPass] = React.useState('')
 
  // const [phone, setPhone] = React.useState(props.user['phone']);
  // const [preferred_reminder_type, setPreferred_reminder_type] = React.useState(props.user['preferred_reminder_type']);


  //sends info to server
  function sendInfo() {
    console.log(email, password, name, phone, preferred_reminder_type, currentPass);
    fetch('/change-acct-info', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, name, phone, preferred_reminder_type, currentPass}),
    })
    .then(response => response.json()
    .then(jsonResponse => {
      console.log(jsonResponse)
    })); 
}
  return (
    // look into using function or forloop+array to condense html 
   <React.Fragment>
    <div className="acct-info">
      <label htmlFor="nameInput">
        <p>User's Name: {props.user['name']} </p>
        <input
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
        value={email}
        onChange={event => setEmail(event.target.value)}
        id="emailInput"
        placeholder={props.user['email']}
        />
        </label>
    </div>
    
    <div className="acct-info">
      <label htmlFor="currentPassInput">
        <p>User's Current Password: {props.user['currentPass']} </p>
        <input
        type="password"
        value={currentPass}
        onChange={event => setCurrentPass(event.target.value)}
        id="currentPassInput"
        />
        </label>
    </div>

    <button type="button" onClick={sendInfo}>
      Change Info
    </button>

    <p><a href="/medications"> User's Medications </a></p>
   </React.Fragment>
  )
}


function AccountInfo(props) {
  const user = props.user;
  return (
    <React.Fragment>
      <div className="acct-info">
        Username: {user['name']}
      </div>
      <div>
        Email: {user['email']}
      </div>
      <div>
        Phone: {user['phone']}
      </div>
      <div>
        Preferred method of contact: {user['preferred_reminder_type']}
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
        <a href="/"> Go back to login.</a></section>
    ); }
  else {
    const noName = user['name'] === null;
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

