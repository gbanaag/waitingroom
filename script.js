//nothing here lol

const firebaseConfig = {
  apiKey: "AIzaSyAvSmFgG6v6yUJPvTsgu-tjBb_40yUe8F0",
  authDomain: "waitingroom-6824b.firebaseapp.com",
  databaseURL: "https://waitingroom-6824b-default-rtdb.firebaseio.com",
  projectId: "waitingroom-6824b",
  storageBucket: "waitingroom-6824b.appspot.com",
  messagingSenderId: "365270418030",
  appId: "1:365270418030:web:f92ab58e1796cebcf81c7f",
  measurementId: "G-F35LZHZW7P"
};
let input;
("use strict");

//grab a form
const form = document.querySelector(".form-inline");

//grab an input
const inputEmail = form.querySelector("#inputEmail");
const age = form.querySelector("#age");
const HistoryFever = form.querySelector("#fever");
const conditions = form.querySelector("#conditions");
const cough = form.querySelector("#cough");
const Contacts = form.querySelector("#contact");
const history = form.querySelector("#history");
const fatigue = form.querySelector("#fatigue");
let x;

let ageData;
let feverData;
let coughData;
let conditionsData;
let contactData;
let historyData;
let fatigueData;
let test;
let TriageType1;
let TriageType2;
let TriageNum1;
let TriageNum2;

let hasInitFormEvaluated = false;

//create a functions to push
function firebasePush(input) {
  //prevents from braking
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

var sessionID;
fetch("https://api.endlessmedical.com/v1/dx/InitSession")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    //creates a sessionID variable

    sessionID = data.SessionID;
    console.log("data this is" + data.SessionID);

    //for the terms of service
    fetch(
      "https://api.endlessmedical.com/v1/dx/AcceptTermsOfUse?SessionID=" +
        sessionID +
        "&passphrase=I%20have%20read%2C%20understood%20and%20I%20accept%20and%20agree%20to%20comply%20with%20the%20Terms%20of%20Use%20of%20EndlessMedicalAPI%20and%20Endless%20Medical%20services.%20The%20Terms%20of%20Use%20are%20available%20on%20endlessmedical.com",
      { method: "post" }
    ).then(function() {
      initform();
    });
  });
//push on form submit
function initform() {
  // if (form != null) {
  form.addEventListener("submit", function(evt) {
    evt.preventDefault();
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //changing the boxed values into accepted JSON API values
    formValueChanger();
    //defining the formvalues dictionary

    let formValues = {
      Age: ageData,
      HistoryFever: feverData,
      //conditions
      Arrhythmia: conditionsData,
      SeverityCough: coughData,
      DyspneaSeveritySubjective: fatigueData,
      //past breathing problems
      PMHXBPInf: historyData,
      ExposureToCovid: contactData
    };
    let theinput = {
      SessionID: sessionID,
      name: "Age",
      value: 10
    };
    console.log(sessionID);

    //initialize the equalTo: returns push ID

    // SessionID: "X8toawsXZakn99Ah"
    let emailHist = 5;
    //printing the dictionary values loop
    Object.entries(formValues).forEach(([key, value]) => {
      theinput.name = key;
      theinput.value = value;
      // console.log(key);
      // console.log(value);
      fetch(
        //  https://api.endlessmedical.com/v1/dx/UpdateFeature?SessionID=cyb5hypAQKqM5kuL&name=Age&value=120
        "https://api.endlessmedical.com/v1/dx/UpdateFeature?" +
          new URLSearchParams(theinput).toString(),

        { method: "post" }
      );
    });

    fetch(
      "https://api.endlessmedical.com/v1/dx/Analyze?SessionID=" +
        sessionID +
        "&NumberOfResults=10"
    )
      .then(function(response) {
        console.log("same");
        return response.json();
      })
      .then(function(data) {
        console.log(ageData);

        TriageType1 = Object.keys(data.Diseases[1])[0];
        TriageType2 = Object.keys(data.Diseases[1])[1];
        TriageNum1 = Object.values(data.Diseases[1])[0];
        TriageNum2 = Object.values(data.Diseases[1])[1];

        console.log("triage" + TriageType1);
       
      });
     let formInputs = {
          inputEmail: inputEmail.value,
          age: age.checked,
          HistoryFever: HistoryFever.checked,
          conditions: conditions.checked,
          cough: cough.checked,
          fatigue: fatigue.checked,
          history: history.checked,
          contacts: Contacts.checked,
          TriageVal1: "" + TriageType1 + TriageNum1,
          TriageVal2: "" + TriageType2 + TriageNum2
        };

    //setting newref it to the push array generated

    //tracking emails with if statement HERE

    // console.log("current:" + newref.key);

    // if (emailHist == newref.key) {

    var ref = firebase.database().ref("info");
    var newref = ref.push();

    //IMPORTANT CODE THAT U NEED -David
    
    var matchingEmailId = ref
      .orderByChild("inputEmail")
      .equalTo(inputEmail.value);

    matchingEmailId
      .once("value")
      .then(function(snapshot) {
        if (snapshot.hasChildren()) {
          return snapshot.forEach(function(child) {
            child.ref.update(formInputs);
          });
        } else {
          return snapshot.ref.push(formInputs);
        }
      })
      .then(function() {
        console.log("update/push done");
        return alert("Data Successfully Sent to Realtime Database");
      })
      .catch(function(error) {
        console.log(error);
      });

    //inside this .then
  });
  //shows alert if everything went well.

  // }
}

function formValueChanger() {
  if (age.checked) {
    ageData = 65;
  } else {
    ageData = 20;
  }
  if (HistoryFever.checked) {
    feverData = 3;
  } else {
    feverData = 2;
  }
  if (conditions.checked) {
    conditionsData = 5;
  } else {
    conditionsData = 2;
  }
  if (cough.checked) {
    coughData = 5;
  } else {
    coughData = 2;
  }
  if (fatigue.checked) {
    fatigueData = 4;
  } else {
    fatigueData = 2;
  }
  if (history.checked) {
    historyData = 3;
  } else {
    historyData = 2;
  }
  if (Contacts.checked) {
    contactData = 5;
  } else {
    contactData = 2;
  }
}

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
firebase.auth().languageCode = "it";
// To apply the default browser preference instead of explicitly setting it.
// firebase.auth().useDeviceLanguage();

provider.setCustomParameters({
  login_hint: "user@example.com"
});
