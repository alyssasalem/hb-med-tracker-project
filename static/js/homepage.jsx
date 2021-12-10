'use strict';

function LoginMessage(props) {
    console.log(props.success)
    if (props.success === true) {
      return (<React.Fragment>You're logged in!</React.Fragment>);
    }
    else {
      return (<React.Fragment>Uh oh! There's no account with that email. </React.Fragment>);
    }
  }

function LogUserIn() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    function loginUser() {
      fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
      })
      .then(response => response.json()
      .then(jsonResponse => {
        console.log(jsonResponse)
        ReactDOM.render(< LoginMessage success={jsonResponse.success} />, document.querySelector('#login-message'))
      })
      ); 
  }
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
    <button type="button" onClick={loginUser}>
        Login
    </button>
    </React.Fragment>
  );
  }
  
  ReactDOM.render(<LogUserIn />, document.querySelector('#login'));
  

