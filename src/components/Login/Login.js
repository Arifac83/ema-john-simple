import React, { useContext, useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import {UserContext} from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
firebase.initializeApp(firebaseConfig);
function Login(){
  const [newUser,setNewUser]=useState(false);
  const [user,setUser]=useState({
    isSingedIn: false,  
    name:'', 
    email:'', 
    password:'',
    photo:''
  });

  const [loggedInUser,setLoggedInUser] = useContext(UserContext);
  const history=useHistory();
  const location=useLocation();
  let {from}=location.state|| {from : {pathname :"/"}};
 const provider = new firebase.auth.GoogleAuthProvider();
 const fbProvider = new firebase.auth.FacebookAuthProvider();
 const handleSignIn=()=>{
  // console.log('signIn Clicked');
  firebase.auth().signInWithPopup(provider)
  .then((result)=>{
  
    const {displayName,email,photoURL}=result.user;
    const singedInUser={
      isSingedIn: true,
      name:displayName, 
      email:email, 
      photo:photoURL
    }
    setUser(singedInUser);   
    //console.log(displayName,email,photoURL);
  })
  .catch(error =>{
    console.log(error);
    console.log(error.message);
 })
}
  const handleFBLogeIn=()=>{
      firebase.auth().signInWithPopup(fbProvider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log('fb user after sign in',user);

      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode,errorMessage);
      });
  }
  const handleSignOut=()=>{
    
    firebase.auth().signOut()
    .then((result)=>{
      const signOutUser={
        isSingedOut: false,
        name:'',
        photo:'',
        email:'',
        error:'',
        success:false
      };
      setUser(signOutUser);
    })
.catch(error =>{

}) 

  }
  const handleBlur=(event)=> {  

    let isFieldValid =true;
    if( event.target.name==='email'){
      isFieldValid=/\S+@\S+\.\S+/.test(event.target.value);
    }
    if ( event.target.name==='password'){
      const isPasswordValid=event.target.value.length>6;
      const passwordHasNumber= /\d{1}/.test (event.target.value.length);
      isFieldValid=isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid){
   
      const newUserInfo = {...user};
      newUserInfo[event.target.name]=event.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit=(e)=>{
   // console.log(user.email,user.password);
    if(newUser && user.email && user.password){
     // console.log('submitting');
     firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
     .then(res=>{
      const newUserInfo={...user};
      newUserInfo.error='';
      newUserInfo.success=true;
      setUser(newUserInfo); 
      updateUserName(user.name);
       //console.log(res);
     })
     .catch(error=> {
 
      const newUserInfo={...user};
      newUserInfo.error=error.message;
      newUserInfo.success=false;
      setUser(newUserInfo);     

    });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo={...user};
        newUserInfo.error='';
        newUserInfo.success=true;
        setUser(newUserInfo); 
        setLoggedInUser(newUserInfo);
        history.replace(from);
        console.log('sign in user info',res.user)
      })
      .catch(error=> {
      
        const newUserInfo={...user};
        newUserInfo.error=error.message;
        newUserInfo.success=false;
        setUser(newUserInfo);  
     
      });
    }
    e.preventDefault();
  }
  const updateUserName = name=>{
   const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name     
    }).then(function() {     
      console.log('user name successfully updated');
    }).catch(function(error) {
      console.log(error);
    });
  }

  return (
    <div style={{textAlign:'center'}}>
      {
        user.isSingedIn ? <button onClick={handleSignOut}>sign out</button>:
        <button onClick={handleSignIn}>sign in</button>
      }
      <br/>
      <button onClick={handleFBLogeIn}>Sign in using Facebook</button>
      
       {
         user.isSingedIn && 
         <div>
            <p>Welcome,{user.name}</p>
            <p>{user.email}</p>
            <img src={user.photo} alt=""/>
         </div>
         
       }

       <h1> Our  Own Authentication</h1>
       <input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)} id=""/>
       <label htmlFor="newUser">New User Sign Up</label>
       <form onSubmit={handleSubmit}>
       {newUser && <input type="text"  onBlur={handleBlur} name="name" placeholder="your name" required/>}<br/>
         <input type="text"  onBlur={handleBlur} name="email" placeholder="your email address" required/><br/>
         <input type="password" onBlur={handleBlur} name="password" placeholder="your password" required/><br/>
         <input type="submit" value={newUser ? 'sign up':'sign in'}/>
         </form>    
        <p style={{color:'red'}}>{user.error}</p>
        {user.success && <p style={{color:'green'}}>User {newUser ?'created':'logged In'} successfully</p>}
         </div>
  );
}

export default Login;
