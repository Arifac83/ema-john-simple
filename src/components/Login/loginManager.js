import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const initializeLoginFramework=()=>{
    firebase.initializeApp(firebaseConfig);
}

export const handleGoogleSignIn=()=>{
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleProvider)
    .then((result)=>{
    
      const {displayName,email,photoURL}=result.user;
      const singedInUser={
        isSingedIn: true,
        name:displayName, 
        email:email, 
        photo:photoURL
      }
      setUser(singedInUser);   
      console.log(displayName,email,photoURL);
    })
    .catch(error =>{
      console.log(error);
      console.log(error.message);
   })
  }

export const handleFBLogeIn=()=>{
const fbProvider = new firebase.auth.FacebookAuthProvider();
   firebase.auth().signInWithPopup(fbProvider).then(function(result) {
     // This gives you a Facebook Access Token. You can use it to access the Facebook API.
     var token = result.credential.accessToken;
     // The signed-in user info.
     var user = result.user;
     // ...
   }).catch(function(error) {
     // Handle Errors here.
     var errorCode = error.code;
     var errorMessage = error.message;
     // The email of the user's account used.
     var email = error.email;
     // The firebase.auth.AuthCredential type that was used.
     var credential = error.credential;
     // ...
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
 
export const createUserWithEmailAndPassword=()=>{
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

export const signInWithEmailAndPassword=()=>{
    
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