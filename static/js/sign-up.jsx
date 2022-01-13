
'use strict';


function SignUpMessage(props) {
  if (props.change === true) {
    if (props.loggedIn === true) {
      return (<React.Fragment><p></p>You signed up!</React.Fragment>);
    }
    else {
      return (<React.Fragment><p></p>Uh oh! Something went wrong!</React.Fragment>);
    }
  } else {
    return null
  }
}

function logOut (setUser, setChange, setLoggedIn){
  return function () {
  fetch('/log-out')
  .then(response => response.json()
  .then(result => {
    console.log("logging out");
    setUser([]);
    setChange(result.success);
    if (result.success === true) {
      setLoggedIn(false);
    }
    })
  ); }
}

function SpecGreeting(props) {
  let greeting = '';
  if (props.user.name !== '' && typeof props.user.name !== 'undefined') {
    greeting = (`Nice to see you, ${props.user.name}!`);
  }
  else {
    greeting = (`You're signed in as ${props.user.email}.`);
  }
  return (<React.Fragment>{greeting}</React.Fragment>);
}


//AddNewAccount is a container function that allows 
// users to input info and sign up
function AddNewAccount() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [preferredReminderType, setPreferredReminderType] = React.useState('');
  const [user, setUser] = React.useState([]);
  const [change, setChange] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  
 
  React.useEffect(() => {
    fetch('/user-logged')
      .then(response => response.json())
      .then(result => {
        setUser(result.user);
        if (result.user !== [] && result.user !== null) {
          setLoggedIn(true);
        }
      });
  }, []);


  function addNewUser(setChange, setUser, setLoggedIn) {
    return function () {
    fetch('/add-user', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password, name, phone, preferredReminderType}),
    })
    .then(response => response.json()
    .then(jsonResponse => {
      console.log(jsonResponse)
      if (jsonResponse.success === true){
        setChange(true);
        setUser(jsonResponse.userAdded);
        setLoggedIn(true);
      }
    })); 
  }
}


console.log(loggedIn);
if (loggedIn !== true){
return (
  <React.Fragment>
    <p></p>
  <section id="sign-up-container">
  <h2>Sign Up</h2>
  <p></p>

  <label htmlFor="emailInput">
    <p className="login-prompt">Email</p>
    <input
    value={email}
    className="form-input"
    onChange={event => setEmail(event.target.value)}
    id="emailInput"/>
  </label>
  <p></p>

  <label htmlFor="passwordInput">
  <p className="login-prompt">Password</p>
      {/* Make sure your password is atleast 8 characters long and has at least one of each of the following: lowercase character, uppercase character, number, special symbol($, @, #, %, !). <br></br> */}
      <input className="form-input" value={password} 
      onChange={event => setPassword(event.target.value)} 
      id="passwordInput" />
  </label>
  <p></p>

  <label htmlFor="nameInput">
    <p className="login-prompt">Name (Optional)</p>
    <input
    value={name}
    className="form-input"
    onChange={event => setName(event.target.value)}
    id="nameInput"/>
  </label>
  <p></p>

  <label htmlFor="phoneInput">
    <p className="login-prompt">Phone (optional)</p>
    <input
    value={phone}
    className="form-input"
    onChange={event => setPhone(event.target.value)}
    id="phoneInput"/>
  </label>
  <p></p>

  <label htmlFor="preferredInput">
    <p className="login-prompt">Best contact (optional)</p>
    <select
    value={preferredReminderType}
    className="form-input"
    onChange={event => setPreferredReminderType(event.target.value)}
    id="preferredInput">
      <option value="text">Text</option>
      <option value="email">Email</option>
    </select>

  </label>
  <p></p>

  <button className="btn" type="button" onClick={addNewUser(setChange, setUser, setLoggedIn)}>
      Add
  </button>
  <div id='sign-up-message'></div>
  </section>
  <SignUpMessage change={change} loggedIn={loggedIn} />
  </React.Fragment>);
} else {
  return (<React.Fragment>
    <SpecGreeting user={user} />
    <div>
      You have an account!  <p></p>
      <button className="btn" onClick={logOut(setUser, setChange, setLoggedIn)}>
        Logout
      </button>
    </div>
    </React.Fragment>
    );
  }
}

//Calls the sign up form
ReactDOM.render(<AddNewAccount />, document.querySelector('#sign-up-react'));
