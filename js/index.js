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
  var selectedDepartment = {name: "", id:""};
  var activeFields = [
    {
        propertie: 'name',
        title: 'Nombre'
    },
    {
        propertie: 'model',
        title: 'Modelo'
    },
    {
        propertie: 'sn',
        title: 'Número de Serie'
    },
    {
        propertie: 'keeperName',
        title: 'Responsable'
    },
    {
        propertie: 'status',
        title: 'Estado'
    },
    {
        propertie: 'location',
        title: 'Ubicación'
    }];

    var employeFields = [
        {
            propertie: 'name',
            title: 'Nombre'
        },
        {
            propertie: 'lastname',
            title: 'Apellidos'
        },
        {
            propertie: 'buildingWorkPlace',
            title: 'Ala'
        },
        {
            propertie: 'roomWorkPlace',
            title: 'Habitación'
        },
        {
            propertie: 'phone',
            title: 'Teléfono'
        }];
  $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    loadEmployees('employe');
    loadBuildings('buildingList','roomsList','selectedRoom','selectedBuilding');
    loadBuildings('buildingListEmploye','roomsListEmploye','selectedRoomEmploye','selectedBuildingEmploye');
    loadRooms('A','roomsList');
    loadRooms('A','roomsListEmploye');
    loadDepartments('employeDepartmentList','selectedDepartment');
    document.getElementById('keeperId').value = "Encargado: (Seleccione Encargado de la Lista)";
    document.getElementById('location').value = "Ubicación: (Seleccione Ubicación de la Lista)";
    document.getElementById('selectedRoom').setAttribute('disabled','');
    //document.getElementById('search').addEventListener('keyup', (event) => {
    //     var search = document.getElementById('search').value;
    //  });
      
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

function showQuery(buttonId, classToSet, elementToShow){
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

    var promise = firebase.database().ref('actives/').push({
            brand: brand,
            keeperId: this.selectedEmploye.id,
            keeperName: this.selectedEmploye.name,
            location: location,
            maintenanceDate: maintenanceDate,
            model: model,
            name: name,
            registerDate: registerDate,
            sn: serialNumber,
            status: 'Active'
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
        document.getElementById('selectedBuilding').innerText= "Seleccionar Ala";
        document.getElementById('selectedRoom').innerText= "Seleccionar Habitación";
        this.selectedEmploye.id = "";
        this.selectedEmploye.name = "";
        this.selectedBuilding.id = "";
        this.selectedBuilding.name = "";
        this.selectedRoom.id = "";
        this.selectedRoom.name = "";
        firebase.database().ref('actives/' + promise.key).update({
            id: promise.key
        });
    }, function(error){
        setModal('Error al registrar','No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
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
                option.value = element.name + ' ' + element.lastname;
                option.text = element.name + ' ' + element.lastname;
                option.className = 'collection-item modal-action modal-close';
                option.setAttribute("onclick","selectEmploye('" + element.name + "','" + element.id +"');");
                option.href = "#!";
                employeList.appendChild(option);
            }
        });
};

function loadDepartments(HTMLElementId, nextHTMLElement){
    var department = firebase.database().ref('departments/');
    var departmentList = document.getElementById(HTMLElementId);

    department.on('value', function(snapshot){
        departmentObject = snapshot.val();
        departmentArray = Object.values(departmentObject);

        for (var element of departmentArray){
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name;
            option.text = element.name;
            option.setAttribute("onclick","selectDepartment('" + element.name + "','" + element.id +"','" + nextHTMLElement + "');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            departmentList.appendChild(listItem);
        }
    });
};
function loadBuildings(elementId, nextElementId, selectedRoomInput, selectedBuildingInput){
    var building = firebase.database().ref('locations/');
    var buildingArray, buildingObject;
    var buildingList = document.getElementById(elementId);
    //console.log('elemento: ' + elementId + ' next element: ' + nextElementId + ' selected romm: ' + selectedRoomInput + ' selected building: ' + selectedBuilding);
    building.on('value', function(snapshot){
        buildingObject = snapshot.val();
        buildingArray = Object.values(buildingObject);

        for (var element of buildingArray){
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name;
            option.text = element.name;
            option.setAttribute("onclick","selectBuilding('" + element.name + "','" + element.id +"','" + nextElementId + "','" + selectedRoomInput + "','" + selectedBuildingInput + "');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            buildingList.appendChild(listItem);
        }
    });
};

function loadRooms(buildingId, elementId, nextElementId){
    var building = firebase.database().ref('locations/' + buildingId + '/rooms');
    var location, roomsArray, roomsObject;
    var roomsList = document.getElementById(elementId);
    roomsList.innerHTML = '';

    building.on('value', function(snapshot){
        roomsObject = snapshot.val();
        roomsArray = Object.values(roomsObject);
        for (var element of roomsArray){
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name;
            option.text = element.name;
            option.setAttribute("onclick","selectRoom('" + element.name + "','" + element.id +"','" + nextElementId + "');");
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

function selectBuilding(buildingName, buildingId, elementId, selectedRoomInput, selectedBuildingInput){
    document.getElementById(selectedRoomInput).removeAttribute('disabled');
    document.getElementById(selectedBuildingInput).innerText = "Selección: " + buildingName;
    this.selectedBuilding.name = buildingName;
    this.selectedBuilding.id = buildingId;
    loadRooms(buildingId,elementId,selectedRoomInput);
    document.getElementById(selectedRoomInput).innerText = 'Seleccionar Habitación';
};

function selectRoom(roomName, roomId, elementId){
    document.getElementById(elementId).innerText = "Selección: " + roomName;
    this.selectedRoom.name = roomName;
    this.selectedRoom.id = roomId;
    document.getElementById('location').value = this.selectedBuilding.name + ', ' + this.selectedRoom.name;
};

function selectDepartment(departmentName, departmentId, nextHTMLElement){
    document.getElementById(nextHTMLElement).innerText = 'Selección: ' + departmentName;
    this.selectedDepartment.name = departmentName;
    this.selectedDepartment.id = departmentId;
    
};
function registerEmploye(){
    var employeName = document.getElementById('employeName').value;
    var employeLastname = document.getElementById('employeLastname').value;
    var employeDepartment = this.selectedDepartment;
    var employePhone = document.getElementById('employePhone').value;
    var employeStreet = document.getElementById('employeStreet').value;
    var employeNumber = document.getElementById('employeNumber').value;
    var employeSettlement = document.getElementById('employeSettlement').value;
    var employeCity = document.getElementById('employeCity').value;
    var employeState = document.getElementById('employeState');
    var buildingListEmploye = document.getElementById('buildingListEmploye').innerText;
    var roomsListEmploye = document.getElementById('roomsListEmploye').innerText;

    var promise = firebase.database().ref('employe/').push({
            name: employeName,
            lastname: employeLastname,
            departmentName: employeDepartment.name,
            departmentId: employeDepartment.id,
            phone: employePhone,
            street: employeStreet,
            number: employeNumber,
            settlement: employeSettlement,
            city: employeCity,
            state: employeState,
            buildingWorkPlace: this.selectedBuilding.name,
            roomWorkPlace: this.selectedRoom.name
        });

    promise.then(function(response){
        setModal('Registro Exitoso','El Empleado se registró correctamente.');
        $('#message').modal('open').value = "";
        document.getElementById('employeName').value = "";
        document.getElementById('employeLastname').value = "";
        document.getElementById('selectedDepartment').value = "Seleccionar Departamento";
        document.getElementById('employePhone').value = "";
        document.getElementById('employeStreet').value = "";
        document.getElementById('employeNumber').value = "";
        document.getElementById('employeSettlement').value = "";
        document.getElementById('employeCity').value = "";
        document.getElementById('employeState').value = "";
        document.getElementById('selectedBuildingEmploye').innerText = "Seleccionar Ala";
        document.getElementById('selectedRoomEmploye').innerText = "Seleccionar Habitación";
        this.selectedEmploye.id = "";
        this.selectedEmploye.name = "";
        this.selectedBuilding.id = "";
        this.selectedBuilding.name = "";
        this.selectedRoom.id = "";
        this.selectedRoom.name = "";
        this.selectedDepartment.name = "";
        this.selectDepartment.id = "";
        firebase.database().ref('employe/' + promise.key).update({
            id: promise.key
        });
    }, function(error){
        setModal('Error al registrar','No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
    })
};

function query(findablePath,fieldsArray,tableId){
    var result = firebase.database().ref(findablePath + '/');
    var resultArray;
    var table = document.getElementById(tableId);
    table.innerHTML = "";
    var tableHead, tableBody;

    tableHead = "<thead><tr>"
    tableBody = "<tbody>"

    result.on('value', function(snapshot){
        resultObject = snapshot.val();
        resultArray = Object.values(resultObject);

        for (var field of fieldsArray){
            tableHead += "<th>" + field.title + "</th>";
            //console.log(field.title + ' ' + element[field.propertie]);
        };
        tableHead += "</tr></thead>"
        for (var element of resultArray){
            tableBody += '<tr>';
            for (var field of fieldsArray){
                tableBody += "<td>" + element[field.propertie] + "</td>";
            };
            tableBody += '</tr>';
        }
        tableBody += "</tbody>";
        table.innerHTML = tableHead + tableBody;
        
    });
    
};

function selectFindableType(findablePath,findableName, comboBoxId, sectionToShow,sectionToHide,fieldsArray,tableId){
    query(findablePath,fieldsArray,tableId);
    document.getElementById(comboBoxId).innerText = findableName;
    showSearch(sectionToShow, sectionToHide);
};

function showSearch(sectionToShow,sectionToHide){
    document.getElementById(sectionToShow).classList.remove('hide');
    document.getElementById(sectionToHide).classList.remove('hide');
    document.getElementById(sectionToHide).classList.add('hide');
};

function checkboxChecked(checkboxId, propertieId, inputId){
    if(!document.getElementById(checkboxId).checked){
        document.getElementById(inputId).setAttribute('disabled','');
        document.getElementById(inputId).value = "";
        document.getElementById(inputId).innerText = "Seleccionar";
    }else{
        document.getElementById(inputId).removeAttribute('disabled');  
    }
};

function selectStatus(status,selectedStatus){
    document.getElementById(selectedStatus).innerText = status;
};