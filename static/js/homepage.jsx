'use strict';

// Use state changes true/false to render the buttons properly.
// 

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
  

function LogOutMessage(props) {
  console.log(props.success)
  if (props.success === true) {
    
    let byebye = "";
    if (props.user !== null){
      byebye = ` ${props.user}`;
    }

    return (<React.Fragment>You've logged out! Bye{byebye}!</React.Fragment>);
  }
  
}

function Logout() {

  function logUserOut() {
    fetch('/log-out')
    .then(response => response.json()
    .then(jsonResponse => {
      console.log(jsonResponse)
      ReactDOM.render(< LogOutMessage success={jsonResponse.success} user={jsonResponse.name} />, document.querySelector('#logout-message'))
      })
    ); 

  }
  return (
      <div>
        <button type="button" onClick={logUserOut}>
          Logout
        </button>
        <section id="logout-message"></section>
      </div>
      );}


function CheckUser(){
  const [user, setUser] = React.useState([]);

  function userLogged(){
    React.useEffect(() => {
      fetch('/user-logged')
        .then(response => response.json())
        .then(result => {
          setUser(result.user);
          console.log(user)
        });
    }, []);
    return user
  }

  userLogged()
  let userInSession = (user !== null);
  return (
    <React.Fragment>
      {userInSession ? (<Logout />) : ( <LogUserIn />) }
    </React.Fragment>

  );
}

ReactDOM.render(<CheckUser />, document.querySelector('#login'));



//need to set effect so that logout only appears when logged in, 
//and login and signout only appears when logged out
//

  

