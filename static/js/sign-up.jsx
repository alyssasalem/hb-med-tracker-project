
'use strict';

// // function to test and show user
// function ShowUser(props) {
//     return (
//       <div>
//         <p> ID: {props.user_id} </p>
//         <p> Email: {props.email} </p>
//       </div>
//     );
//   }

//   //fetch request to get user info
//   fetch('/get-user')
//     .then(response => response.json())
//     .then(responseData => {
//      console.log(responseData['user_id'])
//      ReactDOM.render(<ShowUser user_id={responseData['user_id']} email={responseData['email']} />, document.querySelector('#sign-up-react'));  
//   })
//   ;


function SignUpMessage(props) {
  console.log(props.success)
  if (props.success === true) {
    return (<React.Fragment>You signed up!</React.Fragment>);
  }
  else {
    return (<React.Fragment>Uh oh! Something went wrong!</React.Fragment>);
  }
}


function AddNewAccount() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  function addNewUser() {
    fetch('/add-user', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password}),
    })
    .then(response => response.json()
    .then(jsonResponse => {
      console.log(jsonResponse)
      ReactDOM.render(< SignUpMessage success={jsonResponse.success} />, document.querySelector('#sign-up-message'))
    })); 
}
return (
  <React.Fragment>
  <h2>Sign Up</h2>
  <p>
    <label htmlFor="emailInput">
        <p>Email:</p>
        <input
        value={email}
        onChange={event => setEmail(event.target.value)}
        id="emailInput"/>
    </label>
  </p>
  <p>
    <label htmlFor="passwordInput">
        <p>Password:</p>
        <p>Make sure your password is atleast 8 characters long and has at least one of each of the following: lowercase character, uppercase character, number, special symbol. </p>
        <input value={password} 
        onChange={event => setPassword(event.target.value)} 
        id="passwordInput" />
    </label>
  </p>
  <button type="button" onClick={addNewUser}>
      Add
  </button>
  <div id='sign-up-message'></div>
  </React.Fragment>
);
}

ReactDOM.render(<AddNewAccount />, document.querySelector('#sign-up-react'));
