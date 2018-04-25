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
var selectedEmploye = { name: "", id: "" };
var selectedBuilding = { name: "", id: "" };
var selectedRoom = { name: "", id: "" };
var selectedDepartment = { name: "", id: "" };
var activesFilters = {};
var employeFilters = {};
var useDate;
var firstFilter = "";
var secondFilter = "";
var currentQueryResult = undefined;
var expensesFields = [
    {
        propertie: 'name',
        title: "Concepto"
    },
    {
        propertie: 'inDate',
        title: "Fecha"
    },
    {
        propertie: 'vehicleName',
        title: "Vehículo"
    },
    {
        propertie: 'cost',
        title: "Importe"
    },
];
var vehiclesFields = [
    {
        propertie: 'model',
        title: "Modelo"
    },
    {
        propertie: 'brand',
        title: "Marca"
    },
    {
        propertie: 'year',
        title: "Año"
    },
    {
        propertie: 'status',
        title: "Estado"
    },
];
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
        title: 'N.S.'
    },
    {
        propertie: 'brand',
        title: 'Marca'
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
    },
    {
        propertie: 'quantity',
        title: 'Cantidad'
    },
    {
        propertie: 'warantyDate',
        title: 'Fecha garantía'
    },
    {
        propertie: 'category',
        title: 'Categoría'
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

$(document).ready(function () {
    document.getElementById('loading').classList.add('hide');
    document.getElementById('ready').classList.remove('hide');
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    loadEmployees('employe', 'employeeList');
    loadEmployeesFilter('employe', 'activeKeeperFilterSelect');
    loadBuildings('buildingList', 'roomsList', 'selectedRoom', 'selectedBuilding');
    loadBuildings('buildingListEmploye', 'roomsListEmploye', 'selectedRoomEmploye', 'selectedBuildingEmploye');
    loadRooms('A', 'roomsList');
    loadRooms('A', 'roomsListEmploye');
    buildMenu(properties,'toCreate');
    loadDepartments('employeDepartmentList', 'selectedDepartment');
    setCurrentDate('registerDate');
    
    document.getElementById('selectedRoom').setAttribute('disabled', '');

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Hoy',
        clear: 'Borrar',
        close: 'Ok',
        monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        weekdaysLetter: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        closeOnSelect: false // Close upon selecting a date,
    });
});


//Session Timer
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

//Adding a listener for the user state
firebase.auth().onAuthStateChanged(firebaseUser => {
    //better to use CSS for the visibility
    if (!firebaseUser) {

        window.location.pathname = "Users/sinuhe/Documents/controlActivos/login.html";
    } else {
        var userId = firebase.auth().currentUser.uid;
        var userName = database.ref('users/' + userId + '/name');
        userName.on('value', function (snapshot) {
            document.getElementById('userName').innerText = 'Usuario: ' + snapshot.val();
        });
    };
});

function logout() {
    firebase.auth().signOut();
};

function actionButton(elementtoHide, classToSet, elementToShow) {
    console.log(elementToShow)
    document.getElementById(elementtoHide).classList.add(classToSet);
    document.getElementById(elementToShow).classList.remove('hide');
    document.getElementById('printReport').classList.add('hide');
};

function showQuery(elementTohide, classToSet, elementToShow) {
    document.getElementById(elementTohide).classList.add(classToSet);
    document.getElementById(elementToShow).classList.remove('hide');
    loadDrivers('drivers', 'vehicleDriverList')
};
function registerActive() {
    var brand = document.getElementById('brand').value;
    var location = document.getElementById('selectedBuilding').innerText + ', ' + document.getElementById('selectedRoom').innerText ;
    if(document.getElementById('maintenanceDate').value != undefined && document.getElementById('maintenanceDate').value.length > 2 ){
        var maintenanceDate = document.getElementById('maintenanceDate').value;
        var integerMaintenanceDate = formatDate(maintenanceDate);
    }
    else{
    var maintenanceDate = "NA";
    var integerMaintenanceDate = 0;
    }
    var keeperId = this.selectedEmploye.id;
    var model = document.getElementById('model').value;
    var name = document.getElementById('name').value;
    var registerDate = document.getElementById('registerDate').value;
    var integerRegisterDate = formatDate(registerDate);
    var serialNumber = document.getElementById('serialNumber').value;
    var category = document.getElementById('selectedActiveCategory').innerText;
    var quantity = document.getElementById('activeQuantity').value;
    if(document.getElementById('warantyDate').value != undefined && document.getElementById('warantyDate').value.length > 2)
        var warantyDate = document.getElementById('warantyDate').value;
    else
        var warantyDate = "NA";

        console.log(quantity);
    var promise = database.ref('actives/all').push({
        brand: brand.toUpperCase(),
        keeperId: keeperId,
        keeperName: this.selectedEmploye.name.toUpperCase(),
        location: location.toUpperCase(),
        maintenanceDate: maintenanceDate,
        integerMaintenanceDate: integerMaintenanceDate,
        model: model.toUpperCase(),
        name: name.toUpperCase(),
        registerDate: registerDate,
        integerRegisterDate: integerRegisterDate,
        sn: serialNumber.toUpperCase(),
        status: 'ACTIVO',
        category: category.toUpperCase(),
        quantity: quantity,
        warantyDate: warantyDate
    });
    console.log(quantity);
    promise.then(function (response) {
        database.ref('actives/all/' + promise.key).update({
            id: promise.key
        });
        console.log(quantity);
       
        database.ref('actives/name/' + name.toUpperCase() + '/' + promise.key).set({
            brand: brand.toUpperCase(),
        keeperId: keeperId,
        keeperName: this.selectedEmploye.name.toUpperCase(),
        location: location.toUpperCase(),
        maintenanceDate: maintenanceDate,
        integerMaintenanceDate: integerMaintenanceDate,
        model: model.toUpperCase(),
        name: name.toUpperCase(),
        registerDate: registerDate,
        integerRegisterDate: integerRegisterDate,
        sn: serialNumber.toUpperCase(),
        status: 'ACTIVO',
        category: category.toUpperCase(),
        quantity: quantity,
        warantyDate: warantyDate,
        id: promise.key
        });

        database.ref('actives/brand/' + brand.toUpperCase() + '/' + promise.key).set({
            brand: brand.toUpperCase(),
        keeperId: keeperId,
        keeperName: this.selectedEmploye.name.toUpperCase(),
        location: location.toUpperCase(),
        maintenanceDate: maintenanceDate,
        integerMaintenanceDate: integerMaintenanceDate,
        model: model.toUpperCase(),
        name: name.toUpperCase(),
        registerDate: registerDate,
        integerRegisterDate: integerRegisterDate,
        sn: serialNumber.toUpperCase(),
        status: 'ACTIVO',
        category: category.toUpperCase(),
        quantity: quantity,
        warantyDate: warantyDate,
        id: promise.key
        });

        database.ref('actives/model/' + model.toUpperCase() + '/' + promise.key).set({
            brand: brand.toUpperCase(),
        keeperId: keeperId,
        keeperName: this.selectedEmploye.name.toUpperCase(),
        location: location.toUpperCase(),
        maintenanceDate: maintenanceDate,
        integerMaintenanceDate: integerMaintenanceDate,
        model: model.toUpperCase(),
        name: name.toUpperCase(),
        registerDate: registerDate,
        integerRegisterDate: integerRegisterDate,
        sn: serialNumber.toUpperCase(),
        status: 'ACTIVO',
        category: category.toUpperCase(),
        quantity: quantity,
        warantyDate: warantyDate,
        id: promise.key
        });

        database.ref('actives/status/ACTIVO/' + promise.key).set({
            brand: brand.toUpperCase(),
        keeperId: keeperId,
        keeperName: this.selectedEmploye.name.toUpperCase(),
        location: location.toUpperCase(),
        maintenanceDate: maintenanceDate,
        integerMaintenanceDate: integerMaintenanceDate,
        model: model.toUpperCase(),
        name: name.toUpperCase(),
        registerDate: registerDate,
        integerRegisterDate: integerRegisterDate,
        sn: serialNumber.toUpperCase(),
        status: 'ACTIVO',
        category: category.toUpperCase(),
        quantity: quantity,
        warantyDate: warantyDate,
        id: promise.key
        });

        database.ref('actives/category/' + category.toUpperCase() + '/' + promise.key).set({
            brand: brand.toUpperCase(),
        keeperId: keeperId,
        keeperName: this.selectedEmploye.name.toUpperCase(),
        location: location.toUpperCase(),
        maintenanceDate: maintenanceDate,
        integerMaintenanceDate: integerMaintenanceDate,
        model: model.toUpperCase(),
        name: name.toUpperCase(),
        registerDate: registerDate,
        integerRegisterDate: integerRegisterDate,
        sn: serialNumber.toUpperCase(),
        status: 'ACTIVO',
        category: category.toUpperCase(),
        quantity: quantity,
        warantyDate: warantyDate,
        id: promise.key
        });

        database.ref('actives/date/' + integerRegisterDate + '/' + promise.key).set({
            brand: brand.toUpperCase(),
        keeperId: keeperId,
        keeperName: this.selectedEmploye.name.toUpperCase(),
        location: location.toUpperCase(),
        maintenanceDate: maintenanceDate,
        integerMaintenanceDate: integerMaintenanceDate,
        model: model.toUpperCase(),
        name: name.toUpperCase(),
        registerDate: registerDate,
        integerRegisterDate: integerRegisterDate,
        sn: serialNumber.toUpperCase(),
        status: 'ACTIVO',
        category: category.toUpperCase(),
        quantity: quantity,
        warantyDate: warantyDate,
        id: promise.key
        });
        database.ref('actives/keeper/' + keeperId + '/' + promise.key).set({
            brand: brand.toUpperCase(),
        keeperId: keeperId,
        keeperName: this.selectedEmploye.name.toUpperCase(),
        location: location.toUpperCase(),
        maintenanceDate: maintenanceDate,
        integerMaintenanceDate: integerMaintenanceDate,
        model: model.toUpperCase(),
        name: name.toUpperCase(),
        registerDate: registerDate,
        integerRegisterDate: integerRegisterDate,
        sn: serialNumber.toUpperCase(),
        status: 'ACTIVO',
        category: category.toUpperCase(),
        quantity: quantity,
        warantyDate: warantyDate,
        id: promise.key
        });

        
        setModal('Registro Exitoso', 'El activo se registró correctamente.');
        $('#message').modal('open').value = "";
        document.getElementById('brand').value = "";
        document.getElementById('maintenanceDate').value = "";
        document.getElementById('model').value = "";
        document.getElementById('name').value = "";
        document.getElementById('registerDate').value = "";
        document.getElementById('serialNumber').value = "";
        document.getElementById('selectedBuilding').innerText = "Seleccionar Ala";
        document.getElementById('selectedRoom').innerText = "Seleccionar Habitación";
        document.getElementById('activeQuantity').value = "1";
        document.getElementById('warantyDate').value = "";
        this.selectedEmploye.id = "";
        this.selectedEmploye.name = "";
        this.selectedBuilding.id = "";
        this.selectedBuilding.name = "";
        this.selectedRoom.id = "";
        this.selectedRoom.name = "";
        document.getElementById('selectedActiveCategory').innerText = "Seleccionar Categoría"
        
    }, function (error) {
        setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
    })
};

function loadEmployees(path, comboBoxId) {
    var employees = database.ref(path);
    employees.on('value', function (snapshot) {
        var employeList = document.getElementById(comboBoxId);

        //Create array of options to be added
        var employeObject = snapshot.val();
        var employeArray = Object.values(employeObject);


        for (var element of employeArray) {
            var item = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name + ' ' + element.lastname;
            option.text = element.name + ' ' + element.lastname;
            option.className = 'collection-item modal-action modal-close';
            option.setAttribute("onclick", "selectEmploye('" + element.name + " " + element.lastname + "','" + element.id + "');");
            option.href = "#!";
            item.appendChild(option)
            employeList.appendChild(item);
        }
    });
};
function loadEmployeesChange(path, comboBoxId) {
    var employees = database.ref(path);
    employees.on('value', function (snapshot) {
        var employeList = document.getElementById(comboBoxId);

        //Create array of options to be added
        var employeObject = snapshot.val();
        var employeArray = Object.values(employeObject);


        for (var element of employeArray) {
            var option = document.createElement('a');
            option.value = element.name + ' ' + element.lastname;
            option.text = element.name + ' ' + element.lastname;
            option.className = 'collection-item';
            option.setAttribute("onclick", "selectEmployeChange('" + element.name + " " + element.lastname + "');");
            option.href = "#!";
            employeList.appendChild(option);
        }
    });
};

function loadEmployeesFilter(path, comboBoxId) {
    var employees = database.ref(path);
    employees.on('value', function (snapshot) {
        var employeList = document.getElementById(comboBoxId);

        //Create array of options to be added
        var employeObject = snapshot.val();
        var employeArray = Object.values(employeObject);


        for (var element of employeArray) {
            var item = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name + ' ' + element.lastname;
            option.text = element.name + ' ' + element.lastname;
            option.className = 'collection-item';
            option.setAttribute("onclick", "selectEmployeFilter('selectedActiveKeeperFilter','activesFilters','" + element.name + " " + element.lastname + "','keeperName');");
            option.href = "#!";
            item.appendChild(option);
            employeList.appendChild(item);
        }
    });
};

function loadDepartments(HTMLElementId, nextHTMLElement) {
    var department = database.ref('departments/');
    var departmentList = document.getElementById(HTMLElementId);

    department.on('value', function (snapshot) {
        departmentObject = snapshot.val();
        departmentArray = Object.values(departmentObject);

        for (var element of departmentArray) {
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name;
            option.text = element.name;
            option.setAttribute("onclick", "selectDepartment('" + element.name + "','" + element.id + "','" + nextHTMLElement + "');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            departmentList.appendChild(listItem);
        }
    });
};
function loadBuildings(elementId, nextElementId, selectedRoomInput, selectedBuildingInput) {
    var building = database.ref('locations/');
    var buildingArray, buildingObject;
    var buildingList = document.getElementById(elementId);
    building.on('value', function (snapshot) {
        buildingObject = snapshot.val();
        buildingArray = Object.values(buildingObject);

        for (var element of buildingArray) {
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name;
            option.text = element.name;
            option.setAttribute("onclick", "selectBuilding('" + element.name + "','" + element.id + "','" + nextElementId + "','" + selectedRoomInput + "','" + selectedBuildingInput + "');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            buildingList.appendChild(listItem);
        }
    });
};

function loadRooms(buildingId, elementId, nextElementId) {
    var building = database.ref('locations/' + buildingId + '/rooms');
    var location, roomsArray, roomsObject;
    var roomsList = document.getElementById(elementId);
    roomsList.innerHTML = '';

    building.on('value', function (snapshot) {
        roomsObject = snapshot.val();
        roomsArray = Object.values(roomsObject);
        for (var element of roomsArray) {
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name;
            option.text = element.name;
            option.setAttribute("onclick", "selectRoom('" + element.name + "','" + element.id + "','" + nextElementId + "');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            roomsList.appendChild(listItem);
        }
    });
};

function selectEmploye(employeName, employeId) {
    this.selectedEmploye.id = employeId;
    this.selectedEmploye.name = employeName
    var keeper = document.getElementById('selectedEmployee');
    keeper.innerText = employeName;
};

function selectEmployeChange(employeName) {
    document.getElementById('newKeeper').innerText = "Nuevo Responsable: " + employeName;
};


function setModal(header, message) {
    document.getElementById('modalHeader').innerText = header;
    document.getElementById('modalMessage').innerText = message;
};

function selectBuilding(buildingName, buildingId, elementId, selectedRoomInput, selectedBuildingInput) {
    document.getElementById(selectedRoomInput).removeAttribute('disabled');
    document.getElementById(selectedBuildingInput).innerText = buildingName;
    this.selectedBuilding.name = buildingName;
    this.selectedBuilding.id = buildingId;
    loadRooms(buildingId, elementId, selectedRoomInput);
    document.getElementById(selectedRoomInput).innerText = 'Seleccionar Habitación';
};

function selectRoom(roomName, roomId, elementId) {
    document.getElementById(elementId).innerText = roomName;
    this.selectedRoom.name = roomName;
    this.selectedRoom.id = roomId;
    //document.getElementById('selectedBuid').value = this.selectedBuilding.name + ', ' + this.selectedRoom.name;
};

function selectDepartment(departmentName, departmentId, nextHTMLElement) {
    document.getElementById(nextHTMLElement).innerText = departmentName;
    this.selectedDepartment.name = departmentName;
    this.selectedDepartment.id = departmentId;

};
function registerEmploye() {
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


    var promise = database.ref('employe/').push({
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

    promise.then(function (response) {
        setModal('Registro Exitoso', 'El Empleado se registró correctamente.');
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
        database.ref('employe/' + promise.key).update({
            id: promise.key
        });
    }, function (error) {
        setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
    })
};

function vehiclesQuery(findablePath, fieldsArray, tableId, filterId, search) {
    document.getElementById('loadingVehiclesQuery').classList.remove('hide');
    document.getElementById(tableId).classList.add('hide')
    var filter;
    if (search != undefined) filter = search.toLocaleLowerCase();
    else filter = document.getElementById(filterId).innerText.toLocaleLowerCase();
    var result = database.ref(findablePath + '/' + filter);
    var resultArray;
    var table = document.getElementById(tableId);
    var table = document.getElementById(tableId);
    table.innerHTML = "";

    var tableHead, tableBody;
    tableHead = "<thead><tr>"
    tableBody = "<tbody>"

    result.on('value', function (snapshot) {
        if (snapshot.val() != undefined && snapshot.val() != null) {
            resultObject = snapshot.val();
            this.currentQueryResult = resultObject;
            resultArray = Object.values(resultObject);
            //without filters
            for (var field of fieldsArray) {
                tableHead += "<th>" + field.title + "</th>";
            };
            tableHead += "</tr></thead>"
            for (var element of resultArray) {
                tableBody += '<tr>';
                for (var field of fieldsArray) {
                    if (element[field.propertie] == undefined) {
                        tableBody += "<td>NA</td>"
                    } else {
                        tableBody += "<td>" + element[field.propertie] + "</td>";
                    }
                };
                if (filter.toLowerCase() == 'disponible') {
                    tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick='deleteVehicle( &quot;" + element.id + "&quot; , &quot;unsubscribeContent&quot; , &quot;deleteButton&quot; );'>Baja</a>  </td>";

                    tableBody += "<td><a class='waves-effect waves-light btn lime darken-4' onclick='newExpense(&quot;" + element.id + "&quot;,&quot;vehiclesExpenses&quot;,&quot;vehiclesQuery&quot;,&quot;expensesTitle&quot;);'>Nvo. Gasto</a>  </td>";
                    tableBody += "<td><a class='waves-effect waves-light btn blue' onclick='useVehicle(&quot;" + element.id + "&quot;)'>Usar</a>  </td>";
                }
                if (filter.toLowerCase() == 'en uso') {
                    tableBody += "<td><a class='waves-effect waves-light btn lime darken-4 '  onclick='finishTrip(&quot;" + element.id + "&quot;);'>Terminar salida</a>  </td>";
                }
                if (filter.toLowerCase() == 'reparacion') {
                    tableBody += "<td><a class='waves-effect waves-light btn orange modal-trigger' href='#modalInfo' onclick='repairingDetails(&quot;" + element.id + "&quot;);'> Detalles</a></td>";
                    tableBody += "<td><a class='waves-effect waves-light btn green' >Reparacion Lista</a></td>";
                }


                tableBody += '</tr>';
            }
            tableBody += "</tbody>";
            table.innerHTML += tableHead + tableBody;

        } else {
            tableBody += "<h5 class=' blue-text center-align'>                          No hay resultados para vehículos " + filter + " :(</h5>";
            table.innerHTML += tableHead + tableBody;
        }
        document.getElementById('loadingVehiclesQuery').classList.add('hide');
        document.getElementById(tableId).classList.remove('hide')
    });

};
function query(findablePath, fieldsArray, tableId, filters) {

    var printBtn = document.getElementById('printReport');
    printBtn.classList.remove('hide');
    document.getElementById('dateInputs').classList.add('hide');


    var result = database.ref(findablePath + '/').orderByChild('name');
    var resultArray;
    var table = document.getElementById(tableId);
    table.innerHTML = "";

    var tableHead, tableBody;
    tableHead = "<thead><tr>"
    tableBody = "<tbody>"

    result.on('value', function (snapshot) {
        resultObject = snapshot.val();
        resultArray = Object.values(resultObject);
        if (this.useDate == undefined) {
            if (filters == undefined || jQuery.isEmptyObject(filters)) {

                //without filters
                for (var field of fieldsArray) {
                    tableHead += "<th>" + field.title + "</th>";
                };
                tableHead += "</tr></thead>"
                for (var element of resultArray) {
                    tableBody += '<tr>';
                    for (var field of fieldsArray) {
                        if (element[field.propertie] == undefined) {
                            tableBody += "<td>NA</td>"
                        } else {
                            tableBody += "<td>" + element[field.propertie] + "</td>";
                        }
                    };
                    if (element.buildingWorkPlace == undefined) {
                        if (element.status.toLowerCase() == 'baja') {
                            tableBody += "<td><a class='waves-effect waves-light btn red disabled modal-trigger' href='#buildings'>Baja</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                        }
                        if (element.status.toLowerCase() == 'activo') {
                            tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                        }
                        if (element.status.toLowerCase() == 'reparacion') {
                            tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn yellow modal-trigger' href='#modalInfo' onclick = 'viewStatus( &quot;modalInfoContent&quot;,&quot;" + element.id + "&quot;,&quot;repairingActives&quot;);'>Ver Detalle</a>  </td>";
                        }
                    }
                    tableBody += '</tr>';
                }
                tableBody += "</tbody>";
                table.innerHTML += tableHead + tableBody;

            } else {//with filters
                var found = 0;
                var filteredResults = [];
                var _filters = Object.values(filters);
                for (var field of fieldsArray) {
                    tableHead += "<th>" + field.title + "</th>";
                };
                tableHead += "</tr></thead>"

                for (var element of resultArray) {
                    for (var filter of _filters) {
                        if (element[filter.name].toLowerCase().indexOf(filter.search.toLowerCase()) > -1) {
                            found++;
                        } else {
                            found--;
                        }
                    };
                    if (found == _filters.length) filteredResults.push(element);
                    found = 0;
                };

                for (var element of filteredResults) {
                    tableBody += '<tr>';
                    for (var field of fieldsArray) {
                        //here we check the status so we can put the buttons
                        if (element[field.propertie] == undefined) {
                            tableBody += "<td>NA</td>"
                        } else {
                            tableBody += "<td>" + element[field.propertie] + "</td>";
                        }
                    };
                    if (element.buildingWorkPlace == undefined) {
                        if (element.status.toLowerCase() == 'baja') {

                            tableBody += "<td><a class='waves-effect waves-light btn red'disabled>Baja</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                        }
                        if (element.status.toLowerCase() == 'activo') {

                            tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                        }
                        if (element.status.toLowerCase() == 'reparacion') {

                            tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn yellow modal-trigger' href='#modalInfo' onclick = 'viewStatus( &quot;modalInfoContent&quot;,&quot;" + element.id + "&quot;,&quot;repairingActives&quot;);'>Ver Detalle</a>  </td>";
                        }
                    }
                    tableBody += '</tr>';
                }
                tableBody += "</tbody>";
                table.innerHTML += tableHead + tableBody;


                cleanActiveInputs(findablePath + "Filters");
            }
        } else {
            // searching with dates
            var found = 0;
            var filteredResults = [];
            var dateFilteredResults = [];
            var _filters = Object.values(filters);
            for (var field of fieldsArray) {
                tableHead += "<th>" + field.title + "</th>";
            };
            tableHead += "</tr></thead>"

            for (var element of resultArray) {
                for (var filter of _filters) {
                    if (element[filter.name] != undefined) {
                        if (element[filter.name].toLowerCase().indexOf(filter.search) > -1) {
                            found++;
                        } else {
                            found--;
                        }
                    } else {
                        filteredResults.push(element);
                    }
                };
                if (found == _filters.length) filteredResults.push(element);
                found = 0;
            };

            for (var element of filteredResults) {
                for (var filter of _filters) {
                    if (verifyDate(filter, element)) {
                        dateFilteredResults.push(element);
                    }
                };
                found = 0;
            };

            for (var element of dateFilteredResults) {
                tableBody += '<tr>';
                for (var field of fieldsArray) {//here we check the status so we can put the buttons
                    if (element[field.propertie] == undefined) {
                        tableBody += "<td>NA</td>"
                    } else {
                        tableBody += "<td>" + element[field.propertie] + "</td>";
                    }
                };
                if (element.buildingWorkPlace == undefined) {
                    if (element.status.toLowerCase() == 'baja') {
                        tableBody += "<td><a class='waves-effect waves-light btn red'disabled>Baja</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                    }
                    if (element.status.toLowerCase() == 'activo') {
                        tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                    }
                    if (element.status.toLowerCase() == 'reparacion') {
                        tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn yellow modal-trigger' href='#modalInfo' onclick = 'viewStatus( &quot;modalInfoContent&quot;,&quot;" + element.id + "&quot;,&quot;repairingActives&quot;);'>Ver Detalle</a>  </td>";
                    }
                }
                tableBody += '</tr>';
            }
            tableBody += "</tbody>";
            table.innerHTML += tableHead + tableBody;
            cleanActiveInputs(findablePath + "Filters");
        }
    });
};



function selectFindableType(findablePath, findableName, comboBoxId, sectionToShow, sectionToHide, fieldsArray, tableId) {
    this.useDate = undefined;
    document.getElementById(comboBoxId).innerText = findableName;
    showSearch(sectionToShow, sectionToHide);
};

function showSearch(sectionToShow, sectionToHide) {
    document.getElementById(sectionToShow).classList.remove('hide');
    document.getElementById(sectionToHide).classList.remove('hide');
    document.getElementById(sectionToHide).classList.add('hide');
};

function checkboxChecked(checkboxId, propertieId, inputId, filters) {

    if (filters != undefined) {

        var _filters = this[filters];
        if (!document.getElementById(checkboxId).checked) {
            delete _filters[propertieId];
            document.getElementById(inputId).setAttribute('disabled', '');
            document.getElementById(inputId).value = "";
            document.getElementById(inputId).innerText = "Seleccionar";
        } else {
            document.getElementById(inputId).removeAttribute('disabled');
            _filters[propertieId] = {
                name: propertieId,
                search: ""
            };
        }
    }
};

function selectStatus(propertie, status, selectedStatus, filters) {
    var _filters = this[filters];
    _filters[propertie] = {
        name: propertie,
        search: status
    };
    document.getElementById(selectedStatus).innerText = status;

};

function fillSearchInput(HTMLElementId, filters, propertie) {
    var _filters = this[filters];
    _filters[propertie].search = document.getElementById(HTMLElementId).value.toLowerCase();
};

function selectEmployeFilter(HTMLElementId, filters, name, propertie) {
    document.getElementById(HTMLElementId).innerText = name
    var _filters = this[filters];
    _filters[propertie].search = name;

};

function formatDate(date) {
    var spaMonth = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var engMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (date != undefined && date.length > 0) {
        var res = date.split(" ");
        res = res[1].slice(0, res[1].indexOf(","));
        var monthIndex = spaMonth.indexOf(res);
        var newDate = date.replace(res, engMonth[monthIndex]);
        var formattedDate = Date.parse(newDate);
        return formattedDate;
    }
};

function confirmUnsubscribing(activeId, modalId, path, fields) {
    var active = database.ref(path + '/' + activeId);
    active.on('value', function (snapshot) {
        var _active = snapshot.val();
        if (_active != null) {
            var quantity = _active.quantity;
            document.getElementById(modalId).innerHTML = "<ul><li>NOMBRE: " + _active.name + "</li><li>MODELO: " + _active.model + "</li><li>NUÚMERO DE SERIE: " + _active.sn + "</li><li>MARCA: " + _active.brand + "</li><li>RESPONSABLE: " + _active.keeperName + "</li><li>UBICACIÓN: " + _active.location + "</li><li>CANTIDAD: " + _active.quantity + "</li><br><br><label>Cantidad a dar de baja:</label><input type='number' step='1' min='1' max='" + _active.quantity + "'name='activeQuantityConfirm' id='activeQuantityConfirm' class='validate' required pattern='[0-9]'></ul>";
            document.getElementById('deleteButton').setAttribute("onclick", "deleteElement('" + _active.id + "','" + path + "', '" + fields + "'," + _active.quantity + ",'activeQuantityConfirm');");
        }
    });
};

function deleteVehicle(vehicleId, modalId, buttonId) {
    if (currentQueryResult[vehicleId] != null) {
        document.getElementById(modalId).innerHTML = "<h4>Dar Vehículo de baja?</h4><ul><li>MODELO: " + currentQueryResult[vehicleId].model + "</li><li>MARCA: " + currentQueryResult[vehicleId].brand + "</li><li>AÑO: " + currentQueryResult[vehicleId].year + "</li><li>TIPO DE MOTOR: " + currentQueryResult[vehicleId].engineType + "</li></ul>";
        document.getElementById(buttonId).setAttribute("onclick", "deleteVehicleConfirm('" + vehicleId + "');");
    }
};

function deleteVehicleConfirm(vehicleId) {
    var _vehicle = new Vehicle();
    _vehicle.id = vehicleId;
    _vehicle.brand = currentQueryResult[vehicleId].brand;
    _vehicle.model = currentQueryResult[vehicleId].model;
    _vehicle.year = currentQueryResult[vehicleId].year;
    _vehicle.engineType = currentQueryResult[vehicleId].engineType;
    var search = document.getElementById('selectedVehicleExpense').innerText.toLocaleLowerCase();
    Vehicle.delete(_vehicle, 'vehiclesResultsTable', 'selectedDriverVehicleStatus', search);
};
function repairActive(activeId, HTMLElementId, path, fields) {
    var active = database.ref(path + '/' + activeId);
    document.getElementById('query').classList.add('hide');
    document.getElementById(HTMLElementId).classList.remove('hide');
    active.on('value', function (snapshot) {
        var _active = snapshot.val();
        if (_active != null) {
            document.getElementById('repairingHeader').innerHTML = "<h2>Reparación Activo</h2><h5>Nombre del Activo: " + _active.name + "</h5><h5>Número de serie: " + _active.sn + "</h5>";
            document.getElementById('repairingContent').innerHTML = "<form><div class='input-field'><label>Costo de la Reparación</label><input type='text' class='validate' id='repairingCost'></div><div class='input-field'><label>Lugar de Reparación</label><input type='text' class='validate' id='repairingPlace'></div></form><a id='acceptRepairing' class='col s3 offset-s2 waves-effect waves-light btn-large'>Aceptar</a><a  class='col s3 offset-s2 waves-effect waves-light btn-large' id='cancelRepairing' onclick='actionButton(&quot;repairing&quot;, &quot;hide&quot;, &quot;query&quot;);'>Cancelar</a>";
            document.getElementById('acceptRepairing').setAttribute("onclick", "newRepairing('" + _active.id + "','" + _active.sn + "','repairingBeginingDate','repairingFinishDate','repairingCost','repairingPlace','" + _active.name + "');");
        }
    });
};

function newRepairing(active, activeSN, repairingBeginingDateInputId, repairingFinishDateInputId, repairingCostInputId, repairingPlaceInputId, activeName) {
    var repairingBeginingDate = document.getElementById(repairingBeginingDateInputId).value;
    var repairingFinishDate = document.getElementById(repairingFinishDateInputId).value;
    var repairingCost = document.getElementById(repairingCostInputId).value;
    var repairingPlace = document.getElementById(repairingPlaceInputId).value;
    database.ref('actives/' + active).update({
        status: 'Reparacion'
    });

    var promise = database.ref('repairingActives/' + active).set({
        repairingBeginingDate: repairingBeginingDate,
        integerRepairingBeginingDate: formatDate(repairingBeginingDate),
        repairingFinishDate: repairingFinishDate,
        integerRepairingFinishDate: formatDate(repairingFinishDate),
        cost: repairingCost,
        place: repairingPlace,
        sn: activeSN.toUpperCase(),
        name: activeName
    });

    promise.then(function (response) {
        setModal('Registro Exitoso', 'El activo se ha enviado a reparar.');
        $('#message').modal('open').value = "";
        document.getElementById(repairingBeginingDateInputId).value = "";
        document.getElementById(repairingFinishDateInputId).value = "";
        document.getElementById(repairingCostInputId).value = "";
        document.getElementById(repairingPlaceInputId).value = "";
        query('actives', activeFields, 'resultsTable', activesFilters);
        actionButton('repairing', 'hide', 'query');
    });
};

function deleteElement(id, path, fields, currentQuantity, newQuantity) {
    var promise;

    var newQuantity = document.getElementById(newQuantity).value;
    if (newQuantity > currentQuantity) {

        setModal('Error', 'Ha intentado dar de baja un número de piezas mayor al existente');
        $('#message').modal('open').value = "";
    }
    if (newQuantity < currentQuantity) {//normal

        promise = database.ref(path + '/' + id).update({
            quantity: (currentQuantity - newQuantity)
        });
    };
    if (newQuantity == currentQuantity) {//delete

        promise = database.ref(path + '/' + id).update({
            status: 'Baja',
            quantity: 0
        });
    };
    if (promise != undefined) {
        promise.then(function (response) {
            query(path, this[fields], 'resultsTable');
            setModal('Baja Correcta', 'La baja del activo se realizó correctamente.');
            $('#message').modal('open').value = "";
        }, function (error) {
            setModal('Error al hacer la baja', 'No se pudo llevar a cabo la baja. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        })
    }
};

function useDates(checkboxId, inputsDivId) {
    var inputs = ['dateBeforeInput', 'dateAfterInput', 'dateBetweenInputA', 'dateBetweenInputB'];
    var properties = ['dateBefore', 'dateAfter', 'dateBetween'];
    if (!document.getElementById(checkboxId).checked) {
        document.getElementById(inputsDivId).classList.add('hide');
        this.useDate = undefined;

        for (var i = 0; i < inputs.length; i++) {
            document.getElementById(inputs[i]).setAttribute('disabled', '');
            document.getElementById(inputs[i]).value = "";
            document.getElementById(inputs[i]).innerText = "Seleccionar Fecha";
            delete this.activesFilters[properties[i]];
            document.getElementById(inputs[i]).removeAttribute('disabled');
        };
    } else {
        document.getElementById(inputsDivId).classList.remove('hide');
        for (var i = 0; i < inputs.length; i++) {
            document.getElementById(inputs[i]).value = "";
            document.getElementById(inputs[i]).innerText = "Seleccionar Fecha..."
        };
        this.useDate = true;
    }
};

function checkboxCheckedDate(checkboxId, propertie, inputId, filters) {
    var _filters = this[filters];

    var inputs = ['dateBeforeInput', 'dateAfterInput', 'dateBetweenInputA', 'dateBetweenInputB'];
    var properties = ['dateBefore', 'dateAfter', 'dateBetween'];
    if (inputId == 'dateBetweenInput') {

        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i] != 'dateBetweenInputA' && inputs[i] != 'dateBetweenInputB') {
                document.getElementById(inputs[i]).setAttribute('disabled', '');
                document.getElementById(inputs[i]).value = "";
                document.getElementById(inputs[i]).innerText = "Seleccionar Fecha";
                delete _filters[properties[i]];
            } else {
                document.getElementById(inputs[i]).removeAttribute('disabled');
            }
        };
    } else {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i] != inputId) {
                document.getElementById(inputs[i]).setAttribute('disabled', '');
                document.getElementById(inputs[i]).value = "";
                document.getElementById(inputs[i]).innerText = "Seleccionar Fecha";
                delete _filters[properties[i]];
            } else {
                document.getElementById(inputs[i]).removeAttribute('disabled');
            }
        };
    }
};

function addDateToFilters(inputId, propertie, filters) {
    var _filters = this[filters];
    _filters[propertie] = {
        name: propertie,
        search: formatDate(document.getElementById(inputId).value)
    };
};

function addBetweenDateToFilters(inputId, propertie, filters) {
    var _filters = this[filters];
    if (_filters[propertie] == undefined) {
        var searchArray = [];
        if (inputId == 'dateBetweenInputA')
            searchArray[0] = (formatDate(document.getElementById(inputId).value));
        else
            searchArray[1] = (formatDate(document.getElementById(inputId).value));
        _filters[propertie] = {
            name: propertie,
            search: searchArray
        };
    } else {
        var searchArray = _filters[propertie].search;
        if (inputId == 'dateBetweenInputA')
            searchArray[0] = (formatDate(document.getElementById(inputId).value));
        else
            searchArray[1] = (formatDate(document.getElementById(inputId).value));
        _filters[propertie] = {
            name: propertie,
            search: searchArray
        };
    }

};

function verifyDate(filter, element) {
    switch (filter.name) {
        case 'dateBefore':
            if (filter.search > element.integerRegisterDate) return true;
            break;
        case 'dateAfter':
            if (filter.search < element.integerRegisterDate) return true;
            break;
        case 'dateBetween':
            if (filter.search[0] <= element.integerRegisterDate && element.integerRegisterDate <= filter.search[1]) return true;
            break;
    };
    return false;
};

function viewStatus(modalContentId, activeId, path) {
    var active = database.ref(path + '/' + activeId);

    active.on('value', function (snapshot) {
        var _active = snapshot.val();
        if (_active != null) {
            document.getElementById(modalContentId).innerHTML = "<h6>Nombre del activo: " + _active.name + "</h6><h6>Número de serie: " + _active.sn + "</h6><h6>Fecha de reparación: " + _active.repairingBeginingDate + "</h6><h6>Fecha de entrega: " + _active.repairingFinishDate + "</h6><h6>Costo de la reparación: " + _active.cost + "</h6><h6>Lugar de la reparación: " + _active.place + "</h6>";
            document.getElementById('repairingDoneButton').setAttribute("onclick", "confirmRepairing('" + activeId + "');");
        }
    });
};

function changeKeeper(modalContentId, activeId, fields) {
    loadEmployeesChange('employe', modalContentId);
    document.getElementById('confirmChange').setAttribute("onclick", "confirmChange('" + activeId + "','" + fields + "');");
};

function confirmRepairing(activeId) {
    var promise = database.ref('actives' + '/' + activeId + '/status').set('Activo');
    promise.then(function (response) {
        query('actives', this['activeFields'], 'resultsTable');
        setModal('Reparación realizada', 'El activo ahora se encuentra reparado.');
        $('#message').modal('open').value = "";
    }, function (error) {
        setModal('Error al hacer la reparacion', 'No se pudo llevar a cabo la reparacion. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
    })
    var prom = database.ref('repairingActives/' + activeId).set(null);
};

function confirmChange(activeId, fields) {
    var keeperName = document.getElementById('newKeeper').innerText;

    keeperName = keeperName.slice(18, keeperName.length);
    var promise = database.ref('actives' + '/' + activeId).update({
        keeperName: keeperName,
        keeperId: keeperId
    });
    promise.then(function (response) {
        query(fields, this['activeFields'], 'resultsTable');
        setModal('Cambio de responsable exitoso', 'El activo ha cambiado de responsable.');
        $('#message').modal('open').value = "";
    }, function (error) {
        setModal('Error al hacer la reparacion', 'No se pudo llevar a cabo la reparacion. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
    })
};

function cleanActiveInputs(filtersName) {
    this[filtersName] = {};
    this.useDate = undefined;
    var checkboxes = ['activeName', 'activeBrand', 'activeModel', 'activeStatus', 'activeDate', 'activeKeeperFilter', 'activeCategoryFilterCheckbox', 'employeNameCheckbox',
        'employeLastnameCheckbox', 'employeBuildingWorkPlaceCheckbox', 'dateBefore', 'dateAfter', 'dateBetween',];
    var inputs = ['activeNameInput', 'activeBrandInput', 'activeModelInput', 'selectedStatus', 'selectedActiveCategoryFilter', 'selectedActiveKeeperFilter', 'employeNameCheckboxInput',
        'employeLastnameCheckboxInput', 'employeBuildingWorkPlaceCheckboxInput', 'dateBeforeInput', 'dateAfterInput', 'dateBetweenInputA', 'dateBetweenInputB'];

    for (var check = 0; check < checkboxes.length; check++) {

        document.getElementById(checkboxes[check]).checked = false;
    };
    for (var input = 0; input < inputs.length; input++) {
        document.getElementById(inputs[input]).text = "Buscar";
        document.getElementById(inputs[input]).value = "";
        document.getElementById(inputs[input]).setAttribute("disabled", "");
    };

};

function makePDF() {
    var date = new Date();

    jsPDF.autoTableSetDefaults({ headerStyles: { fillColor: [62, 39, 35] } });
    var doc = new jsPDF('l', 'pt');

    var res = doc.autoTableHtmlToJson(document.getElementById("resultsTable"));
    var cols = [res.columns[0], res.columns[1], res.columns[2], res.columns[3], res.columns[4], res.columns[5]];

    var header = function (data) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
        doc.text("Reporte " + date.toLocaleDateString(), data.settings.margin.left, 20);
    };

    var options = {
        theme: 'grid',
        addPageContent: header,
        margin: {
            top: 100
        },
        startY: doc.autoTableEndPosY() + 40
    };

    doc.autoTable(cols, res.data, options);

    doc.save("reporte" + date.toLocaleDateString() + ".pdf");
};
function selectCategory(categoryName, nextHTMLElement) {
    document.getElementById(nextHTMLElement).innerText = categoryName;
};

function setCurrentDate(dateInputId) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth(); //January is 0!
    var year = today.getFullYear();
    if (dateInputId != undefined && dateInputId.length > 0)
        document.getElementById(dateInputId).value = formatDateToSpanish(day, month, year);
    else return today.getTime();
};

function getMonth(date) {
    var res = date.split(" ");
    var month = res[1].slice(0, res[1].length - 1)
    return month;
}

function formatDateToSpanish(day, month, year) {
    var formatedDate;
    var spaMonth = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    formatedDate = day + ' ' + spaMonth[month] + ', ' + year;
    return formatedDate
};

function test(sinuhe) {
    alert('name: ' + sinuhe.name + '\n lastname: ' + sinuhe.lastname);
};

function registerVehicle() {
    var newVehicle = new Vehicle();
    newVehicle.register(newVehicle);
};

function registerDriver() {
    var newDriver = new Driver();
    newDriver.register(newDriver);
};

function newExpense(vehicleId, elementToShow, elementToHide, titleId) {
    setCurrentDate('expenseTodayDate');
    var vehicle = this.currentQueryResult[vehicleId];
    document.getElementById('vehicleExpensesId').innerText = vehicleId;
    document.getElementById(titleId).innerText = vehicle.brand + " " + vehicle.model + " " + vehicle.year;
    document.getElementById(elementToShow).classList.remove('hide');
    document.getElementById(elementToHide).classList.add('hide');

};
function useExpensesDates(elementToShow, checkboxId) {
    if (document.getElementById(checkboxId).checked)
        document.getElementById(elementToShow).classList.remove('hide');
    else
        document.getElementById(elementToShow).classList.add('hide');
};

function confirmExpense(vehicleId) {
    var newExpense = new Expenses();
    newExpense.vehicleId = this.currentQueryResult[document.getElementById(vehicleId).innerText].id;
    newExpense.createExpense(newExpense);
};

function repairingDetails(vehicleId) {
    var vehicle = this.currentQueryResult[vehicleId];
    if (vehicle != null) {
        document.getElementById('modalInfoContent').innerHTML = "<h6>Vehiculo: " + vehicle.brand + " " + vehicle.model + " " + vehicle.year + "</h6><h6>Fecha ingreso taller: " + vehicle.inDate + "</h6><h6>Fecha de entrega: " + vehicle.outDate + "</h6><h6>Costo: " + vehicle.cost + "</h6><h6>Detalles: " + vehicle.details + "</h6>";
        document.getElementById('repairingDoneButton').setAttribute("onclick", "confirmVehicleRepairing('" + vehicleId + "');");
    }

};

function confirmVehicleRepairing(vehicleId) {
    Expenses.repairingDone(vehicleId);
}

function loadDrivers(path, listId) {
    var employees = database.ref(path);
    employees.on('value', function (snapshot) {
        var employeList = document.getElementById(listId);

        //Create array of options to be added
        var employeObject = snapshot.val();
        var employeArray = Object.values(employeObject);


        for (var element of employeArray) {
            var item = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name + ' ' + element.lastname;
            option.text = element.name + ' ' + element.lastname;
            option.className = 'collection-item modal-action modal-close';
            option.setAttribute("onclick", "selectDriver('" + element.name + " " + element.lastname + "','" + element.id + "','vehicleDriver');");
            option.href = "#!";
            item.appendChild(option);
            employeList.appendChild(item);
        }
    });
};

function selectDriver(employeName, employeId, selectedHTML) {
    document.getElementById(selectedHTML).innerText = employeName;
    document.getElementById('driverTripId').innerText = employeId;
};

function useVehicle(vehicleId) {
    actionButton('vehiclesQuery', 'hide', 'newTrip');
    document.getElementById('vehicleTripId').innerText = vehicleId;
    document.getElementById('tripTitle').innerText = this.currentQueryResult[vehicleId].brand + " " + this.currentQueryResult[vehicleId].model + " " + this.currentQueryResult[vehicleId].year;
}

function confirmTrip(vehicleId) {
    var _vehicleId = document.getElementById(vehicleId).innerText;
    var newTrip = new Trips();
    newTrip.vehicleId = _vehicleId;
    newTrip.newTrip(newTrip);
};

function finishTrip(vehicleId) {
    actionButton('vehiclesQuery', 'hide', 'finishTrip');
    var trip = database.ref('salidas/en curso/' + vehicleId);
    var objectTrip;
    trip.on('value', function (snapshot) {
        objectTrip = snapshot.val();
        if (objectTrip != undefined) {
            document.getElementById('finishTripTitle').innerHTML = "<br><h4>Detalles:</h4><h5>Vehiculo: " + objectTrip.vehicle + "</h5><h5>Fecha salida: " + objectTrip.date + "</h5><h5>Motivo salida: " + objectTrip.issue + "</h5><h5>Conductor: " + objectTrip.driver + "</h5><br>";
            document.getElementById('confirmFinishButton').setAttribute("onclick", "confirmFinishTrip('" + objectTrip.vehicleId + "','" + objectTrip.tripId + "');");
        }
    });
};

function confirmFinishTrip(vehicleId, tripId) {
    Trips.finisTrip(vehicleId, tripId);
};

function searchExpenses(filterId, selectedMonthId) {
    document.getElementById('signature').classList.remove('hide');
    var filter = document.getElementById(filterId).innerText;
    var month = document.getElementById(selectedMonthId).innerText;
    month = month.toLowerCase();
    console.log('/expenses/date/' + month)
    vehiclesQueryReport('/expenses/date/' + month, expensesFields, 'vehiclesFiltersResultsTable', filterId);
}

function vehiclesQueryReport(findablePath, fieldsArray, tableId, filterId, search) {
    document.getElementById('loadingVehiclesQuery').classList.remove('hide');
    document.getElementById(tableId).classList.add('hide')
    var filter;
    if (search != undefined) filter = search.toLocaleLowerCase();
    else filter = document.getElementById(filterId).innerText.toLocaleLowerCase();
    var result = database.ref(findablePath + '/' + filter);
    var resultArray;
    var table = document.getElementById(tableId);
    var table = document.getElementById(tableId);
    table.innerHTML = "";

    var tableHead, tableBody;
    tableHead = "<thead><tr>"
    tableBody = "<tbody>"

    result.on('value', function (snapshot) {
        var total = 0;
        if (snapshot.val() != undefined && snapshot.val() != null) {
            resultObject = snapshot.val();
            this.currentQueryResult = resultObject;
            resultArray = Object.values(resultObject);
            //without filters
            for (var field of fieldsArray) {
                tableHead += "<th>" + field.title + "</th>";
            };
            tableHead += "</tr></thead>"
            for (var element of resultArray) {
                tableBody += '<tr>';
                for (var field of fieldsArray) {
                    if (element[field.propertie] == undefined) {
                        tableBody += "<td>NA</td>"
                    } else {
                        if (field.propertie == 'cost') {
                            total += Number(element[field.propertie]);
                            tableBody += "<td> $ " + element[field.propertie] + "</td>";
                        } else
                            tableBody += "<td>" + element[field.propertie] + "</td>";

                    }
                };
                if (filter.toLowerCase() == 'disponible') {
                    tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick='deleteVehicle( &quot;" + element.id + "&quot; , &quot;unsubscribeContent&quot; , &quot;deleteButton&quot; );'>Baja</a>  </td>";

                    tableBody += "<td><a class='waves-effect waves-light btn lime darken-4' onclick='newExpense(&quot;" + element.id + "&quot;,&quot;vehiclesExpenses&quot;,&quot;vehiclesQuery&quot;,&quot;expensesTitle&quot;);'>Nvo. Gasto</a>  </td>";
                    tableBody += "<td><a class='waves-effect waves-light btn blue' onclick='useVehicle(&quot;" + element.id + "&quot;)'>Usar</a>  </td>";
                }
                if (filter.toLowerCase() == 'en uso') {
                    tableBody += "<td><a class='waves-effect waves-light btn lime darken-4 '  onclick='finishTrip(&quot;" + element.id + "&quot;);'>Terminar salida</a>  </td>";
                }
                if (filter.toLowerCase() == 'reparacion') {
                    tableBody += "<td><a class='waves-effect waves-light btn orange modal-trigger' href='#modalInfo' onclick='repairingDetails(&quot;" + element.id + "&quot;);'> Detalles</a></td>";
                    tableBody += "<td><a class='waves-effect waves-light btn green' >Reparacion Lista</a></td>";
                }


                tableBody += '</tr>';
            }
            tableBody += "<tr></td><td> </td><td> </td><td></td><td></tr><td> </td><td> </td><td> </td><td>Total: $ " + total + "</td>"
            tableBody += "</tbody>";
            table.innerHTML += tableHead + tableBody;

        } else {
            tableBody += "<h5 class=' blue-text center-align'>                          No hay resultados para vehículos " + filter + " :(</h5>";
            table.innerHTML += tableHead + tableBody;
        }

        document.getElementById('loadingVehiclesQuery').classList.add('hide');
        document.getElementById(tableId).classList.remove('hide')

    });

};

function makePDFReport() {
    var date = new Date();

    jsPDF.autoTableSetDefaults({ headerStyles: { fillColor: [62, 39, 35] } });
    var doc = new jsPDF('l', 'pt');

    var res = doc.autoTableHtmlToJson(document.getElementById("vehiclesFiltersResultsTable"));
    var cols = [res.columns[0], res.columns[1], res.columns[2], res.columns[3]];

    var header = function (data) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
        doc.text("Reporte de " + document.getElementById('selectedVehicleFilter').innerText + " al " + date.toLocaleDateString(), data.settings.margin.left, 20);
    };

    var options = {
        theme: 'grid',
        addPageContent: header,
        margin: {
            top: 100
        },
        startY: 35
    };

    doc.autoTable(cols, res.data, options);
    let finalY = doc.autoTable.previous.finalY; // The y position on the page
    if (document.getElementById('firstPrintingName').value.length > 0) {
        doc.text(50, finalY + 230, document.getElementById('firstPrintingName').value);
        doc.text(50, finalY + 200, "____________________")
    }
    if (document.getElementById('secondPrintingName').value.length > 0) {
        doc.text(600, finalY + 230, document.getElementById('secondPrintingName').value)
        doc.text(600, finalY + 200, "____________________")
    }

    doc.save("reporte" + date.toLocaleDateString() + ".pdf");
    document.getElementById('firstPrintingName').value = "";
    document.getElementById('secondPrintingName').value = "";
    document.getElementById('signature').classList.add('hide');
}

function buildMenu(properties, htmlId){
    var toSet = document.getElementById(htmlId);
    var body = document.createElement(properties.htmlElement);
    body.className = properties.classes;
    body.textContent = properties.value;
    body.id = properties.id;
    body.type = properties.type;
    body.setAttribute(properties.events.name, properties.events.method);
    if(properties.innerElements != ' ')menuBuilder(properties.innerElements,body);

    toSet.appendChild(body);
};

function menuBuilder(propertie, incoming){
    for(element of propertie){
        var newElement = document.createElement(element.htmlElement);
            newElement.className = element.classes;
            newElement.textContent = element.value;
            newElement.id = element.id;
            newElement.type = element.type;
            if(element.events != ' ')
                newElement.setAttribute(element.events.name, element.events.method);
            if(element.innerElements != ' ') {
                menuBuilder(element.innerElements,newElement);
            }
            incoming.appendChild(newElement);
    }
};


function queryTest(filters) {
    if(filters != undefined){
        var _filters = Object.values(filters);
        var x = database.ref('actives');
        for(filter of _filters){

            x = x.orderByChild(filter.propertie);
            x = x.equalTo(filter.search);
        }
        x.on('value', function(snapshot) {
            console.log(snapshot.val());
        });
    } 
};

function selectNormalFilter(comboId, filter, selectedValue,filterName,input){
    document.getElementById(comboId).innerText = selectedValue;
    this[filterName].name = filter;
    document.getElementById(input).classList.remove('hide');
    document.getElementById('keeperFirstFilter').classList.add('hide');
    document.getElementById('statusFirstFilter').classList.add('hide');
    document.getElementById('categoryFirstFilter').classList.add('hide');
}

function removeFilter(secondFilter,secondActiveFilterInput){
    this[secondFilter] = "";
    document.getElementById(secondActiveFilterInput).value = "";
    document.getElementById(secondActiveFilterInput).classList.add('hide');
}

function firstFilterKeeper(keeperFirstFilter,activeFilterKeeperList,comboId,selectedFilter){
    document.getElementById(keeperFirstFilter).classList.remove('hide');
    loadEmployeesFirstFilter('employe', activeFilterKeeperList);
    document.getElementById(comboId).innerText = selectedFilter;
    document.getElementById('firstActiveFilterInput').classList.add('hide');
    document.getElementById('statusFirstFilter').classList.add('hide');
    document.getElementById('categoryFirstFilter').classList.add('hide');
    document.getElementById('dateInputsFirstFilter').classList.add('hide');
};

function selectEmployeFirstFilter(comboId,employeName,employeId, hiddenElementId){
    document.getElementById(comboId).innerText = employeName;
    document.getElementById(hiddenElementId).innerText = employeId;
};

function loadEmployeesFirstFilter(path, comboBoxId) {
    var employees = database.ref(path);
    employees.on('value', function (snapshot) {
        var employeList = document.getElementById(comboBoxId);

        //Create array of options to be added
        var employeObject = snapshot.val();
        var employeArray = Object.values(employeObject);


        for (var element of employeArray) {
            var item = document.createElement('li');
            var option = document.createElement('a');
            option.value = element.name + ' ' + element.lastname;
            option.text = element.name + ' ' + element.lastname;
            option.className = 'collection-item modal-action modal-close';
            option.setAttribute("onclick", "selectEmployeFirstFilter('firstFilterSelectedKeeper','" + element.name + " " + element.lastname + "','" + element.id + "','firstFilterKeeperId');");
            option.href = "#!";
            item.appendChild(option)
            employeList.appendChild(item);
        }
    });
};

function selectFirstFilterStatus(comboId,statusToSet){
    document.getElementById(comboId).innerText = statusToSet
}

function useStatusFirstFilter(elementId,value){
    document.getElementById('categoryFirstFilter').classList.add('hide');
    document.getElementById('firstActiveFilter').innerText = value;
    document.getElementById(elementId).classList.remove('hide');
    document.getElementById('firstActiveFilterInput').classList.add('hide');
    document.getElementById('keeperFirstFilter').classList.add('hide');
    document.getElementById('dateInputsFirstFilter').classList.add('hide');
    
};

function useDateFirstFilter(datesId){
    document.getElementById('categoryFirstFilter').classList.add('hide');
    document.getElementById(datesId).classList.remove('hide');
    document.getElementById('firstActiveFilterInput').classList.add('hide');
    document.getElementById('keeperFirstFilter').classList.add('hide');
    document.getElementById('firstActiveFilter').innerText = "Fechas";
};

function checkboxCheckedDateFirst(checkboxId, propertie, inputId, filters) {
    var _filters = this[filters];

    var inputs = ['dateBeforeInputFirst', 'dateAfterInputFirst', 'dateBetweenInputAFirst', 'dateBetweenInputBFirst'];
    if (inputId == 'dateBetweenInputFirst') {

        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i] != 'dateBetweenInputAFirst' && inputs[i] != 'dateBetweenInputBFirst') {
                document.getElementById(inputs[i]).setAttribute('disabled', '');
                document.getElementById(inputs[i]).value = "";
                document.getElementById(inputs[i]).innerText = "Seleccionar Fecha";
            } else {
                document.getElementById(inputs[i]).removeAttribute('disabled');
            }
        };
    } else {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i] != inputId) {
                document.getElementById(inputs[i]).setAttribute('disabled', '');
                document.getElementById(inputs[i]).value = "";
                document.getElementById(inputs[i]).innerText = "Seleccionar Fecha";
                delete _filters[properties[i]];
            } else {
                document.getElementById(inputs[i]).removeAttribute('disabled');
            }
        };
    }
};