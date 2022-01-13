'use strict';

// Use state changes true/false to render the buttons properly.
// rework so it only has one render, see notes for pseudocode

function loginUser (email, password, setChange, setUser, setLoggedIn){
  return function () {
  fetch('/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password}),
    })
    .then(response => response.json()
    .then(result => {
      setUser(result.user);
      setLoggedIn(result.success);
      if (result.user === []) {
        alert("Uh oh! Recheck your information, please.");
      }
      else {
        setChange(result.success);
      }
    })
    ); }
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


function LogInBox() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user, setUser] = React.useState([]);
  const [change, setChange] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    fetch('/user-logged')
      .then(response => response.json())
      .then(result => {
        setUser(result.user);
        if (result.user !== [] && result.user !== null && result.user.length !== 0) {
          setLoggedIn(true);
        }
      });
  }, []);

  if (loggedIn === false){
    return (
        <React.Fragment>
        <h2>Log In</h2>
        <label htmlFor="emailLogin">
            <p className="login-prompt no-pad">Email</p>
            <input
            className="form-input no-pad"
            value={email}
            onChange={event => setEmail(event.target.value)}
            id="emailLogin"/>
        </label>
        <br></br>
        <label htmlFor="passwordLogin">
        <p className="login-prompt no-pad">Password</p>
            <input 
            className="form-input no-pad"
            value={password} 
            onChange={event => setPassword(event.target.value)} 
            id="passwordLogin" />
        </label>
        <br></br>
        <button className="btn" onClick={loginUser(email, password, setChange, setUser, setLoggedIn)}>
            Login
        </button>
        </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment>
      <div>
        <button className="btn" onClick={logOut(setUser, setChange, setLoggedIn)}>
          Logout
        </button>
      </div>
      </React.Fragment>
      );
  }

}

ReactDOM.render(<LogInBox />, document.querySelector('#login'));

