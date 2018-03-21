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
  var selectedEmploye = {name: "", id:""};
  var selectedBuilding = {name: "", id: ""};
  var selectedRoom = {name: "", id: ""};

  $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    loadEmployees('employe');
    loadBuildings();
    loadRooms('A');
    document.getElementById('keeperId').value = "Encargado: (Seleccione Encargado de la Lista)";
    document.getElementById('location').value = "Ubicación: (Seleccione Ubicación de la Lista)";
    document.getElementById('selectedRoom').setAttribute('disabled','');
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Hoy',
        clear: 'Limpiar',
        close: 'Ok',
        monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
        monthsShort: [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
        weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
        weekdaysShort: [ 'Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab' ],
        weekdaysLetter: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],
        closeOnSelect: false // Close upon selecting a date,
      });
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
            keeperId: this.selectedEmploye.id,
            keeperName: this.selectedEmploye.name,
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
        document.getElementById('location').value = "Ubicación: (Seleccione Ubicación de la Lista)";
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
            var employeObject = snapshot.val();
            var employeArray = Object.values(employeObject);

            
            for (var element of employeArray){
                var option = document.createElement('a');
                option.value = element.name;
                option.text = element.name;
                option.className = 'collection-item modal-action modal-close';
                option.setAttribute("onclick","selectEmploye('" + element.name + "','" + element.id +"');");
                option.href = "#!";
                employeList.appendChild(option);
            }
        });
};

function loadBuildings(){
    var building = firebase.database().ref('locations/');
    var location, buildingArray, buildingObject;
    var buildingList = document.getElementById("buildingList");

    building.on('value', function(snapshot){
        buildingObject = snapshot.val();
        buildingArray = Object.values(buildingObject);

        for (var element of buildingArray){
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name;
            option.text = element.name;
            option.setAttribute("onclick","selectBuilding('" + element.name + "','" + element.id +"');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            buildingList.appendChild(listItem);
        }
    });
};

function loadRooms(buildingId){
    var building = firebase.database().ref('locations/' + buildingId + '/rooms');
    var location, roomsArray, roomsObject;
    var roomsList = document.getElementById("roomsList");
    roomsList.innerHTML = '';

    building.on('value', function(snapshot){
        roomsObject = snapshot.val();
        roomsArray = Object.values(roomsObject);
        for (var element of roomsArray){
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name;
            option.text = element.name;
            option.setAttribute("onclick","selectRoom('" + element.name + "','" + element.id +"');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            roomsList.appendChild(listItem);
        }
    });    
};

function selectEmploye(employeName,employeId){
    this.selectedEmploye.id = employeId;
    this.selectedEmploye.name = employeName
    var keeper = document.getElementById('keeperId');
    keeper.value = 'Encargado: ' + employeName;
};

function setModal(header, message){
    document.getElementById('modalHeader').innerText = header;
    document.getElementById('modalMessage').innerText = message;
};

function selectBuilding(buildingName, buildingId){
    document.getElementById('selectedRoom').removeAttribute('disabled');
    document.getElementById('selectedBuilding').innerText = buildingName;
    this.selectedBuilding.name = buildingName;
    this.selectedBuilding.id = buildingId;
    loadRooms(buildingId);
    document.getElementById('location').removeAttribute('disabled');
    document.getElementById('selectedRoom').innerText = 'Seleccionar Habitación';
};

function selectRoom(roomName, roomId){
    document.getElementById('selectedRoom').innerText = roomName;
    this.selectedRoom.name = roomName;
    this.selectedRoom.id = roomId;
    document.getElementById('location').value = this.selectedBuilding.name + ', ' + this.selectedRoom.name;
};
