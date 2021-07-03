import React, { useState } from 'react';
import { useContext } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import Header from '../partials/Header';
import { initializeLoginFramework, handleGoogleSignIn, handleSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './LoginManager';



function SignIn() {

  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser ] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
      handleGoogleSignIn()
      .then(res => {
        handleResponse(res, true);
      })
  }

 

  const signOut = () => {
      handleSignOut()
      .then(res => {
          handleResponse(res, false);
      })
  }

  const handleResponse = (res, redirect) =>{
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
        history.replace(from);
    }
  }

  const handleBlur = (e) => {
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber =  /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }

    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    e.preventDefault();
  }



  return (
    <from>
    {/* <h1 ><b>Login</b></h1> */}
   
<div className="border-0   ">
<div  className =" m-5 pb-5 ">
<form onSubmit = {handleSubmit}>
<div className="form-group">
{newUser && <input className="form-control"  name ="name" type="text" onBlur ={handleBlur} placeholder ="your Name"  required/>}

       <br/>
       {newUser && <input className="form-control" name="birth date" type="date" onBlur={handleBlur} placeholder="Your birth Date"/>
         
        }
       <br/>
      {newUser && <input className="form-control" name="profession" type="text" onBlur={handleBlur} placeholder="Your profession"/>
         
    }
</div>
 <br/>
<div className="form-group">
<input className="form-control"  type="text" name ="email" onBlur ={handleBlur} placeholder ="mail address" required/>
</div>
<br/>
<div className="form-group">
<input className="form-control"  type="password" name="password" onBlur ={handleBlur} placeholder="password" required />
</div>
<br/>
<div className="form-group">
<input   type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
<label htmlFor="newUser">new user sign up</label>
</div>

<div >
<input className="form-control" className="btn btn-success btn-lg " onClick ={handleSubmit} type="submit" value={newUser ? 'sign up' : 'sign in'}/>
</div>
</form>


<p style ={{color : "red"}}>{user.error}</p>
{user.success && <p style ={{color : "green"}}>user {newUser ? 'created': 'logged in'} successfully</p>}


<p>Or</p>
<div>
{ user.isSignedIn ? <button onClick={signOut}>Sign Out</button> :
<button  className="btn btn-dark btn-lg"  onClick ={googleSignIn}>Google sign in</button>}

</div> </div></div></from>
  );
}

export default SignIn;