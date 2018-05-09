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
var database = firebase.database();

//Session Timer
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });


//Adding a listener for the user state
firebase.auth().onAuthStateChanged(firebaseUser => {
    //better to use CSS for the visibility
    if (!firebaseUser) {
        //window.location.pathname = "controlActivos/login.html";
        window.location.pathname = "Users/sinuhe/Documents/controlActivos/login.html";
    } else {
        var userId = firebase.auth().currentUser.uid;
        var userName = database.ref('users/' + userId + '/userName');
        userName.on('value', function (snapshot) {
            document.getElementById('userName').innerText = 'Usuario: ' + snapshot.val();
        });
        cu = database.ref('users/' + userId).on('value', function (s) {
            this.cu = s.val();
        })

    };
});
$(document).ready(function () {
    fillUsers();
    $('.modal').modal();
    document.getElementById('loading').classList.add('hide');
    document.getElementById('ready').classList.remove('hide');
});
function logout() {
    firebase.auth().signOut();
};
function fillUsers(){
    
    var usersRef = database.ref('users');
    var users
    var list = document.getElementById('usersList');
    usersRef.on('value', function(s){
        
        users = Object.values(s.val());
        for(var user of users){
            var editButtonA = document.createElement('a');
            var deleteButtonA = document.createElement('a');
            var editButton = document.createElement('div');
            var deleteButton = document.createElement('div');
            editButton.className = 'chip green';
            //editButton.setAttribute("onclick", "selectEmploye('" + element.name + " " + element.lastname + "','" + element.id + "');");
            editButton.innerHTML = "<a class='white-text' onclick='deleteUser('" + user.id + "')'>Editar</a>";
            deleteButton.className = 'chip red';
            //deleteButton.setAttribute("onclick", "selectEmploye('" + element.name + " " + element.lastname + "','" + element.id + "');");
            deleteButton.innerHTML = "<a class='white-text' onclick='editUser('" + user.id + "')'>Eliminar</a>";
            var item = document.createElement('li');
            var title = document.createElement('div');
            title.className = "collapsible-header";
            title.innerHTML ="<li class='material-icons'>account_circle</li>" + user.userName + ' ' + user.lastname;
            body =  document.createElement('div');
            body.className = "collapsible-body";
            span =  document.createElement('span');
            span.innerText = "Nombre: " + user.userName + '\nApellidos: '+ user.lastname + '\nTeléfono: ' + user.phone +'\nTipo de usuario: ' + user.type + '\n\n';
            editButtonA.appendChild(editButton);
            deleteButtonA.appendChild(deleteButton)
            span.appendChild(editButtonA);
            span.appendChild(deleteButtonA);
            body.appendChild(span);
            item.appendChild(title);
            item.appendChild(body);
            list.appendChild(item);
        }
    })
}

function newUser(){
    
    var newUserName = document.getElementById('newUserName').value;
    var newUserLastname = document.getElementById('newUserLastname').value;
    var newUserAddress = document.getElementById('newUserAddress').value;
    var newUserPhone = document.getElementById('newUserPhone').value;
    var newUserNickname = document.getElementById('newUserNickname').value + "@gmail.com";
    var newUserType = document.getElementById('selectedNewUserType').innerText;
    var newUserPassword = document.getElementById('newUserPassword').value;
    var newUserConfirmPassword = document.getElementById('newUserConfirmPassword').value;
    if(newUserPassword == newUserConfirmPassword){

    var promise = firebase.auth().createUserWithEmailAndPassword(newUserNickname, newUserPassword );
      promise.then(function (response){
          $('#newUserModal').modal('close');
          database.ref('users/' + response.uid).set({
            userName: newUserName,
              lastname: newUserLastname,
              address: newUserAddress,
              phone: newUserPhone,
              nickname: newUserNickname,
              type: newUserType
          })
          setModal('Registro Correcto', 'El usuario se registró correctamente.');
            $('#message').modal('open').value = "";
            location.reload();
          //clean inputs
      },function (error){
          alert(error)
      })
      
    }else{
        alert('Las Contraseñas no coinciden');
    }
      
}

function selectUserType(userType,selectedNewUserType){
    document.getElementById('selectedNewUserType').innerText = userType;
}
function setModal(header, message) {
    document.getElementById('modalHeader').innerText = header;
    document.getElementById('modalMessage').innerText = message;
};