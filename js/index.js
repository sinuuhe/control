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
  var activeFilters = {};
  var employeFilters = {};
  var useDate;
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
      
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Hoy',
        clear: 'Borrar',
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
        var userName = database.ref('users/' + userId + '/name');
        userName.on('value', function(snapshot){
            document.getElementById('userName').innerText = 'Usuario: ' + snapshot.val(); 
        });
    };
});

function logout(){
    firebase.auth().signOut();
  };

function actionButton(elementtoHide, classToSet, elementToShow){
    document.getElementById(elementtoHide).classList.add(classToSet);
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
    var integerMaintenanceDate = formatDate(maintenanceDate);
    var model = document.getElementById('model').value;
    var name = document.getElementById('name').value;
    var registerDate = document.getElementById('registerDate').value;
    var integerRegisterDate = formatDate(registerDate);
    var serialNumber = document.getElementById('serialNumber').value;

    var promise = database.ref('actives/').push({
            brand: brand,
            keeperId: this.selectedEmploye.id,
            keeperName: this.selectedEmploye.name,
            location: location,
            maintenanceDate: maintenanceDate,
            integerMaintenanceDate: integerMaintenanceDate,
            model: model,
            name: name,
            registerDate: registerDate,
            integerRegisterDate: integerRegisterDate,
            sn: serialNumber,
            status: 'Activo'
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
        database.ref('actives/' + promise.key).update({
            id: promise.key
        });
    }, function(error){
        setModal('Error al registrar','No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
    })
};

function loadEmployees(path,comboBox){
    var employees = database.ref(path);
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
                option.setAttribute("onclick","selectEmploye('" + element.name + " " + element.lastname + "','" + element.id +"');");
                option.href = "#!";
                employeList.appendChild(option);
            }
        });
};

function loadDepartments(HTMLElementId, nextHTMLElement){
    var department = database.ref('departments/');
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
    var building = database.ref('locations/');
    var buildingArray, buildingObject;
    var buildingList = document.getElementById(elementId);
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
    var building = database.ref('locations/' + buildingId + '/rooms');
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
        database.ref('employe/' + promise.key).update({
            id: promise.key
        });
    }, function(error){
        setModal('Error al registrar','No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
    })
};

function query(findablePath,fieldsArray,tableId,filters){
    var result = database.ref(findablePath + '/').orderByChild('name');
    var resultArray;
    var table = document.getElementById(tableId);
    table.innerHTML = "";
    var tableHead, tableBody;
    tableHead = "<thead><tr>"
    tableBody = "<tbody>"

    result.on('value', function(snapshot){
        resultObject = snapshot.val();
        resultArray = Object.values(resultObject);
        if(this.useDate == undefined){
            if(filters == undefined || jQuery.isEmptyObject(filters)){
                    for (var field of fieldsArray){
                        tableHead += "<th>" + field.title + "</th>";
                    };
                    tableHead += "</tr></thead>"
                    for (var element of resultArray){
                        tableBody += '<tr>';
                        for (var field of fieldsArray){
                            tableBody += "<td>" + element[field.propertie] + "</td>";
                        };
                        if(element.buildingWorkPlace == undefined){
                            if(element.status == 'Baja'){
                                tableBody += "<td><a class='waves-effect waves-light btn red'disabled>Baja</a>  </td>";
                                tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                            }
                            if(element.status == 'Activo'){ 
                                tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                                tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                            }
                            if(element.status == 'Reparacion'){ 
                                tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                                tableBody += "<td><a class='waves-effect waves-light btn yellow' onclick = 'viewStatus( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Ver Detalle</a>  </td>";
                            }
                        }
                        tableBody += '</tr>';
                    }
                    tableBody += "</tbody>";
                    table.innerHTML = tableHead + tableBody;
                    
                }else{
                    var found = 0;
                    var filteredResults = [];
                    var _filters = Object.values(filters);
                    for (var field of fieldsArray){
                        tableHead += "<th>" + field.title + "</th>";
                    };
                    tableHead += "</tr></thead>"

                    for (var element of resultArray){
                        for (var filter of _filters){
                            if(element[filter.name].toLowerCase().indexOf(filter.search) > -1){
                                found ++;
                            }else{
                                found --;
                            }
                        };
                        if(found == _filters.length) filteredResults.push(element);
                        found = 0;
                    };    

                    for (var element of filteredResults){
                        tableBody += '<tr>';
                        for (var field of fieldsArray){//here we check the status so we can put the buttons
                            tableBody += "<td>" + element[field.propertie] + "</td>";
                        };
                        if(element.buildingWorkPlace == undefined){
                            if(element.status == 'Baja'){
                                tableBody += "<td><a class='waves-effect waves-light btn red'disabled>Baja</a>  </td>";
                                tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                            }
                            if(element.status == 'Activo'){ 
                                tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                                tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                            }
                            if(element.status == 'Reparacion'){ 
                                tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                                tableBody += "<td><a class='waves-effect waves-light btn yellow' onclick = 'viewStatus( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Ver Detalle</a>  </td>";
                            }
                        }
                        tableBody += '</tr>';
                    }
                    tableBody += "</tbody>";
                    table.innerHTML = tableHead + tableBody;            
                } 
        } else{// searching with dates
            var found = 0;
            var filteredResults = [];
            var dateFilteredResults = [];
            var _filters = Object.values(filters);
            for (var field of fieldsArray){
                tableHead += "<th>" + field.title + "</th>";
            };
            tableHead += "</tr></thead>"

            for (var element of resultArray){
                for (var filter of _filters){
                    if(element[filter.name] != undefined){
                        if(element[filter.name].toLowerCase().indexOf(filter.search) > -1){
                            found ++;
                        }else{
                            found --;
                        }
                    }else{
                        filteredResults.push(element);
                    }
                };
                if(found == _filters.length) filteredResults.push(element);
                found = 0;
            };    
            
            for (var element of filteredResults){
                for (var filter of _filters){
                    if(verifyDate(filter,element)){
                        dateFilteredResults.push(element);
                    }
                };
                found = 0;
            };  

            for (var element of dateFilteredResults){
                tableBody += '<tr>';
                for (var field of fieldsArray){//here we check the status so we can put the buttons
                    tableBody += "<td>" + element[field.propertie] + "</td>";
                };
                if(element.buildingWorkPlace == undefined){
                    if(element.status == 'Baja'){
                        tableBody += "<td><a class='waves-effect waves-light btn red'disabled>Baja</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                    }
                    if(element.status == 'Activo'){ 
                        tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                    }
                    if(element.status == 'Reparacion'){ 
                        tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn yellow' onclick = 'viewStatus( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives&quot;,&quot;activeFields&quot;);'>Ver Detalle</a>  </td>";
                    }
                }
                tableBody += '</tr>';
            }
            tableBody += "</tbody>";
            table.innerHTML = tableHead + tableBody;   
        }   
        
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

function checkboxChecked(checkboxId, propertieId, inputId,filters){
    var _filters = this[filters];
        if(!document.getElementById(checkboxId).checked){
        delete _filters[propertieId];
        document.getElementById(inputId).setAttribute('disabled','');
        document.getElementById(inputId).value = "";
        document.getElementById(inputId).innerText = "Seleccionar";
    }else{
        document.getElementById(inputId).removeAttribute('disabled');  
        _filters[propertieId] = {
            name: propertieId,
            search: ""
        };
    }
};

function selectStatus(propertie,status,selectedStatus, filters){
    var _filters = this[filters];
    _filters[propertie] = {
        name: propertie,
        search: status
    };
    document.getElementById(selectedStatus).innerText = status;

};

function fillSearchInput(HTMLElementId, filters, propertie){
    var _filters = this[filters];
    _filters[propertie].search = document.getElementById(HTMLElementId).value.toLowerCase();
};

function formatDate(date){
    var spaMonth = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var enMonth = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if(date != undefined){
        var res = date.split(" ");
        res = res[1].slice(0,res[1].indexOf(","));
        var monthIndex = spaMonth.indexOf(res);
        var newDate = date.replace(res,enMonth[monthIndex]);
        var formattedDate = Date.parse(newDate);
        return formattedDate;
}
};

function confirmUnsubscribing(activeId, modalId, path, fields){
    var active  = database.ref(path + '/' + activeId);
    active.on('value', function(snapshot){
        var _active = snapshot.val();
        if(_active != null){
            document.getElementById(modalId).innerHTML = "<ul><li>NOMBRE: " + _active.name + "</li><li>MODELO: " + _active.model + "</li><li>NUÚMERO DE SERIE: " + _active.sn + "</li><li>MARCA: " + _active.brand + "</li><li>RESPONSABLE: " + _active.keeperName + "</li><li>UBICACIÓN: " + _active.location + "</li></ul>";
            document.getElementById('deleteButton').setAttribute("onclick","deleteElement('" + _active.id + "','" + path + "', '" + fields + "');");
        }
    });
};

function repairActive(activeId, HTMLElementId, path, fields){
    var active  = database.ref(path + '/' + activeId);
    document.getElementById('query').classList.add('hide');
    document.getElementById(HTMLElementId).classList.remove('hide');
    active.on('value', function(snapshot){
        var _active = snapshot.val();
        if(_active != null){
            document.getElementById('repairingHeader').innerHTML = "<h2>Reparación Activo</h2><h5>Nombre del Activo: " + _active.name + "</h5><h5>Número de serie: " + _active.sn + "</h5>";
            document.getElementById('repairingContent').innerHTML = "<form><div class='input-field'><label>Costo de la Reparación</label><input type='text' class='validate' id='repairingCost'></div><div class='input-field'><label>Lugar de Reparación</label><input type='text' class='validate' id='repairingPlace'></div></form><a id='acceptRepairing' class='col s3 offset-s2 waves-effect waves-light btn-large'>Aceptar</a><a  class='col s3 offset-s2 waves-effect waves-light btn-large' id='cancelRepairing' onclick='actionButton(&quot;repairing&quot;, &quot;hide&quot;, &quot;query&quot;);'>Cancelar</a>";
            document.getElementById('acceptRepairing').setAttribute("onclick","newRepairing('" + _active.id + "','repairingBeginingDate','repairingFinishDate','repairingCost','repairingPlace');");
        }
    });
};

function newRepairing(active,repairingBeginingDateInputId,repairingFinishDateInputId,repairingCostInputId,repairingPlaceInputId){
    var repairingBeginingDate = document.getElementById(repairingBeginingDateInputId).value;
    var repairingFinishDate = document.getElementById(repairingFinishDateInputId).value; 
    var repairingCost = document.getElementById(repairingCostInputId).value;
    var repairingPlace = document.getElementById(repairingPlaceInputId).value;

    database.ref('actives/' + active).update({
        status: 'Reparacion'
    });

    var promise = database.ref('repairingActives/').push({
        repairingBeginingDate: repairingBeginingDate,
        integerRepairingBeginingDate: formatDate(repairingBeginingDate),
        repairingFinishDate: repairingFinishDate,
        integerRepairingFinishDate: formatDate(repairingFinishDate),
        cost: repairingCost,
        place: repairingPlace
    });

    promise.then(function(response){
        setModal('Registro Exitoso','El activo se ha enviado a reparar.');
        $('#message').modal('open').value = "";
        document.getElementById(repairingBeginingDateInputId).value = "";
        document.getElementById(repairingFinishDateInputId).value = "";
        document.getElementById(repairingCostInputId).value = "";
        document.getElementById(repairingPlaceInputId).value = "";
        query('actives',activeFields,'resultsTable',activeFilters);
        actionButton('repairing', 'hide', 'query');
    });
};

function deleteElement(id,path,fields){   
    var promise = database.ref(path + '/' + id + "/status").set('Baja');
    promise.then(function(response){
        query(path,this[fields],'resultsTable');
        setModal('Baja Correcta','La baja del activo se realizó correctamente.');
        $('#message').modal('open').value = "";
    }, function(error){
        setModal('Error al hacer la baja','No se pudo llevar a cabo la baja. Por favor inténtelo de nuevo.');
        $('#message').modal('open').value = "";
    })  
};

function useDates(checkboxId, inputsDivId){
    if(!document.getElementById(checkboxId).checked){
        document.getElementById(inputsDivId).classList.add('hide');
        var inputs = ['dateBeforeInput','dateAfterInput','dateBetweenInputA','dateBetweenInputB'];
        var properties = ['dateBefore','dateAfter','dateBetween'];
        this.useDate = undefined;

        for (var i = 0; i < inputs.length; i++){
            document.getElementById(inputs[i]).setAttribute('disabled','');
            document.getElementById(inputs[i]).value = "";
            document.getElementById(inputs[i]).innerText = "Seleccionar Fecha";
            delete this.activeFilters[properties[i]];
            document.getElementById(inputs[i]).removeAttribute('disabled');  
        };
    }else{
        document.getElementById(inputsDivId).classList.remove('hide');
        document.getElementById('dateBeforeInput').value = "";
        document.getElementById('dateBeforeInput').innerText = "Seleccionar Fecha...";
        document.getElementById('dateAfterInput').value = "";
        document.getElementById('dateAfterInput').innerText = "Seleccionar Fecha...";
        document.getElementById('dateBetweenInputA').value = "";
        document.getElementById('dateBetweenInputA').innerText = "Seleccionar Fecha...";
        document.getElementById('dateBetweenInputB').value = "";
        document.getElementById('dateBetweenInputB').innerText = "Seleccionar Fecha...";
        this.useDate = true;
    }
};

function checkboxCheckedDate(checkboxId, propertie, inputId,filters){
    var _filters = this[filters];
    
    var inputs = ['dateBeforeInput','dateAfterInput','dateBetweenInputA','dateBetweenInputB'];
    var properties = ['dateBefore','dateAfter','dateBetween'];
    if(inputId == 'dateBetweenInput'){
        
        for (var i = 0; i < inputs.length; i++){
            if(inputs[i] != 'dateBetweenInputA' && inputs[i] != 'dateBetweenInputB'){
                document.getElementById(inputs[i]).setAttribute('disabled','');
                document.getElementById(inputs[i]).value = "";
                document.getElementById(inputs[i]).innerText = "Seleccionar Fecha";
                delete _filters[properties[i]];
            }else{
                document.getElementById(inputs[i]).removeAttribute('disabled');  
            }
        }; 
    }else{
    for (var i = 0; i < inputs.length; i++){
        if(inputs[i] != inputId){
            document.getElementById(inputs[i]).setAttribute('disabled','');
            document.getElementById(inputs[i]).value = "";
            document.getElementById(inputs[i]).innerText = "Seleccionar Fecha";
            delete _filters[properties[i]];
        }else{
            document.getElementById(inputs[i]).removeAttribute('disabled');  
        }
    }; 
}
};

function addDateToFilters(inputId, propertie, filters){
    var _filters = this[filters];
    _filters[propertie] = {
        name: propertie,
        search: formatDate(document.getElementById(inputId).value)
    };
};

function addBetweenDateToFilters(inputId, propertie, filters){
    var _filters = this[filters];
    if(_filters[propertie] == undefined){
        var searchArray = [];
        if(inputId == 'dateBetweenInputA')
            searchArray[0] = (formatDate(document.getElementById(inputId).value));
        else 
            searchArray[1] = (formatDate(document.getElementById(inputId).value));
        _filters[propertie] = {
            name: propertie,
            search: searchArray
        };
    }else{
        var searchArray = _filters[propertie].search;
        if(inputId == 'dateBetweenInputA')
            searchArray[0] = (formatDate(document.getElementById(inputId).value));
        else 
            searchArray[1] = (formatDate(document.getElementById(inputId).value));
        _filters[propertie] = {
            name: propertie,
            search: searchArray
        };
    }
    
};

function verifyDate(filter,element){
    switch(filter.name){
        case 'dateBefore':
            if(filter.search > element.integerRegisterDate) return true;
        break;
        case 'dateAfter':
            if(filter.search < element.integerRegisterDate) return true;
        break;
        case 'dateBetween':
            if(filter.search[0] <= element.integerRegisterDate && element.integerRegisterDate <= filter.search[1]) return true;
        break;
    };
    return false;
};
