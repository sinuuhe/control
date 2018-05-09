  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyATQCwO8PQELnDXilRBPIwi1-g0CI6lDz8",
    authDomain: "controlactivos-3dd04.firebaseapp.com",
    databaseURL: "https://controlactivos-3dd04.firebaseio.com",
    projectId: "controlactivos-3dd04",
    storageBucket: "controlactivos-3dd04.appspot.com",
    messagingSenderId: "158922203061"
  };
  firebase.initializeApp(config);
  
  
  //Reference to the db
  var database = firebase.database();

  function login(){
    var email = document.getElementById('user').value;
    email = email + "@gmail.com";
    var pass = document.getElementById('password').value;

    //Auth
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email,pass);
    
    promise.catch(e => console.log(e.message));
};

  //Adding a listener for the user state
  firebase.auth().onAuthStateChanged(firebaseUser => {
    //better to use CSS for the visibility
    if(firebaseUser){
        console.log(firebaseUser);
       //window.location.pathname = "controlActivos/index.html";
        window.location.pathname = "Users/sinuhe/Documents/controlActivos/index.html";
        //document.getElementById('logout').style.display = "block"
    }else{
         //window.location.pathname = "Users/sinuhe/Documents/loggin.html";
        console.log('not logged in');
        //document.getElementById('logout').style.display = "none"
    }

    document.addEventListener('keypress', (event) => {
      const keyName = event.key;
      if(keyName === 'Enter') login();
    });
});