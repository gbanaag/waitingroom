
firebase.initializeApp({
  // Initialization here
});

var provider = new firebase.auth.GoogleAuthProvider();

function googleSignin() {
  firebase
    .auth()

    .signInWithPopup(provider)
    .then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      // console.log(token);
      // console.log(user);
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(error.code);
      console.log(error.message);
    });
}

function googleSignout() {
  firebase
    .auth()
    .signOut()

    .then(
      function() {
        console.log("Signout Succesfull");
      },
      function(error) {
        console.log("Signout Failed");
      }
    );
}

var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

var reference = firebase.database().ref();

// reference.on(
//   "value",
//   function(snapshot) {
//     console.log(snapshot.val());
//   },
//   function(error) {
//     console.log("Error: " + error.code);
//   }
// );

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // alert("Signed in");
    document.getElementById("loginout").innerHTML = "Log out";
    document.getElementById("form-data").style.visibility = "visible";
    document.getElementById("signinwithgoogle").style.visibility = "hidden";
    document.getElementById("signout").style.visibility = "visible";

    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }

    reference
      .child("info")
      .orderByChild("inputEmail")
      .equalTo(email)
      .on("child_added", function(snapshot) {
        console.log("fuck u");
        console.log(snapshot.val());
      });

    // var ref = firebase.database().ref("info");
    // let emailHist = ref
    //   .orderByChild("inputEmail")
    //   .equalTo(inputEmail.value)
    //   .on("child_added", function(snapshot) {
    //     console.log(snapshot.key);
    //   });

    document.getElementById("inputEmail").value = user.email;
    document.getElementById("inputEmail").disabled = true;
  } else {
    // alert("Signed out");
    document.getElementById("loginout").innerHTML = "Log in";
    document.getElementById("form-data").style.visibility = "hidden";
    document.getElementById("signinwithgoogle").style.visibility = "visible";
    document.getElementById("signout").style.visibility = "hidden";
    // No user is signed in.
  }
});
