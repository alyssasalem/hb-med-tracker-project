'use strict';

// Use state changes true/false to render the buttons properly.
// rework so it only has one render, see notes for pseudocode


function Message(props) {
  if (props.change === true){
    if (props.user === null) {
      return (<React.Fragment>You've logged out! Bye!</React.Fragment>);
    } else {
      return (<React.Fragment>Welcome back!</React.Fragment>)
    } 
  } else {
    return null
  }
}

function loginUser (email, password, setChange, setUser){
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
      console.log("now we're logged in!");
      setUser(result.user)
      setChange(result.success)
    })
    ); }
}

function logOut (setUser, setChange){
  return function () {
  fetch('/log-out')
  .then(response => response.json()
  .then(result => {
    setUser(null);
    setChange(result.success);
    })
  ); }
}


function LogInBox() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user, setUser] = React.useState([]);
  const [change, setChange] = React.useState(false);

  React.useEffect(() => {
    fetch('/user-logged')
      .then(response => response.json())
      .then(result => {
        console.log("is a user logged?");
        setUser(result.user);
      });
  }, []);

  if (user === null){
    return (
        <React.Fragment>
        <h2>Log In</h2>
        <p>
        <label htmlFor="emailLogin">
            Email
            <input
            value={email}
            onChange={event => setEmail(event.target.value)}
            id="emailLogin"/>
        </label>
        </p>
        <p>
        <label htmlFor="passwordLogin">
            Password
            <input value={password} 
            onChange={event => setPassword(event.target.value)} 
            id="passwordLogin" />
        </label></p>
        <button onClick={loginUser(email, password, setChange, setUser)}>
            Login
        </button>
        < Message user={user} change={change} />
        </React.Fragment>
    );
  }
  else {
    return (
      <React.Fragment>
      <div>
        <button onClick={logOut(setUser, setChange)}>
          Logout
        </button>
      </div>
      < Message user={user} change={change} />
      </React.Fragment>
      );
  }

}

ReactDOM.render(<LogInBox />, document.querySelector('#login'));

