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
  var employeId;

  $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    loadEmployees('employe');
    document.getElementById('keeperId').value = "Encargado: (Seleccione Encargado de la Lista)";
  });
         
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
    if(!firebaseUser){
        
        window.location.pathname = "Users/sinuhe/Documents/controlActivos/login.html";
    }else{
        var userId = firebase.auth().currentUser.uid;
        var userName = firebase.database().ref('users/' + userId + '/name');
        userName.on('value', function(snapshot){
            document.getElementById('userName').innerText = 'Usuario: ' + snapshot.val(); 
        });
    };
});

function logout(){
    firebase.auth().signOut();
  };

function actionButton(buttonId, classToSet, elementToShow){
    document.getElementById(buttonId).classList.add(classToSet);
    document.getElementById(elementToShow).classList.remove('hide');
};

function registerActive(){
    var brand = document.getElementById('brand').value;
    var keeperId = document.getElementById('keeperId').value;
    var location = document.getElementById('location').value;
    var maintenanceDate = document.getElementById('maintenanceDate').value;
    var model = document.getElementById('model').value;
    var name = document.getElementById('name').value;
    var registerDate = document.getElementById('registerDate').value;
    var serialNumber = document.getElementById('serialNumber').value;

    var promise = firebase.database().ref('actives/' + serialNumber).set({
            brand: brand,
            keeperId: keeperId,
            location: location,
            maintenanceDate: maintenanceDate,
            model: model,
            name: name,
            registerDate: registerDate,
            id: serialNumber
        });

    promise.then(function(response){
        setModal('Registro Exitoso','El activo se registró correctamente.');
        $('#message').modal('open').value = "";
        document.getElementById('brand').value = "";
        document.getElementById('keeperId').value = "Encargado: (Seleccione un Encargado de la Lista)";
        document.getElementById('location').value = "";
        document.getElementById('maintenanceDate').value = "";
        document.getElementById('model').value = "";
        document.getElementById('name').value = "";
        document.getElementById('registerDate').value = "";
        document.getElementById('serialNumber').value = "";
    }, function(error){
        console.log('bad\n'+ error);
    })
};

function loadEmployees(path,comboBox){
    var employees = firebase.database().ref(path);
        employees.on('value', function(snapshot){
            var employeList = document.getElementById("employeList");

            //Create array of options to be added
            var employeArray = snapshot.val();
            var cool = Object.values(employeArray);

            
            for (var element of cool){
                var option = document.createElement('a');
                option.value = element.name;
                option.text = element.name;
                option.className = 'collection-item modal-action modal-close';
                console.log(element);
                option.setAttribute("onclick","selectEmploye('" + element.name + "','" + element.id +"');");
                option.href = "#!";
                employeList.appendChild(option);
            }
        });
};

function selectEmploye(employeName,employeId){
    this.employeId = employeId;
    var keeper = document.getElementById('keeperId');
    keeper.value = 'Encargado: ' + employeName;
};

function setModal(header, message){
    document.getElementById('modalHeader').innerText = header;
    document.getElementById('modalMessage').innerText = message;
};