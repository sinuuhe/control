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
var cu;
var selectedEmploye = { name: "", id: "" };
var selectedBuilding = { name: "", id: "" };
var selectedRoom = { name: "", id: "" };
var selectedDepartment = { name: "", id: "" };
var activesFilters = {};
var employeFilters = {};
var useDate;
var firstFilter = "";
var secondFilter = "";
var secondSearch = "";
var temporalList = [];
var selectedActive = {};
var currentQueryResult = undefined;
var tmpActiveList = {};
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

var activeFieldsTmp = [
    {
        propertie: 'name',
        title: 'Nombre'
    },
    {
        propertie: 'model',
        title: 'Modelo'
    },
    {
        propertie: 'brand',
        title: 'Marca'
    },
    {
        propertie: 'quantity',
        title: 'Cantidad'
    },
];

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
    $('.tabs').tabs();
    $("#newActiveForm").submit(function(e) {
        if(e.result){
            e.preventDefault(); // prevent page refresh
            registerActive();
        }
    });
    document.getElementById('loading').classList.add('hide');
    document.getElementById('ready').classList.remove('hide');
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    setModal('AVISO PARA EL GRADUADO! 😎', "Al momento: \n -La búsqueda de activos ya está(Parece, fala que encuentres errores 😛)\n-Se agregó ubicación de Resguardo personal\n-Se agregó ubicación 'otro'\n-Se agregó 'Recepción' a Nogales\n-Salida local y foranea en vehículos\n-Observacionas al salir y volver en salidas\n-Detalles de qué empleado está usando el vehículo\n-ReguardoTemporal\n-Primer Borrador de los pendientes\n\nVienen más cosas lol 💋 (Me avisas si hay que quitar este aviso!!)");
    //$('#message').modal('open').value = "";
    loadEmployees('employe', 'employeeList');
    loadEmployeesFilter('employe', 'activeKeeperFilterSelect');
    loadBuildings('buildingList', 'roomsList', 'selectedRoom', 'selectedBuilding', 'O');
    loadBuildings('buildingListEmploye', 'roomsListEmploye', 'selectedRoomEmploye', 'selectedBuildingEmploye');
    loadRooms('A', 'roomsList');
    loadRooms('A', 'roomsListEmploye');
    loadDepartments('employeDepartmentList', 'selectedDepartment');
    setCurrentDate('registerDate');
    checkPending();
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

            //if (s.val().type == "NORMAL" && window.location.pathname != "Users/sinuhe/Documents/controlActivos/indexn.html") window.location.pathname = "Users/sinuhe/Documents/controlActivos/indexn.html";
            //if (s.val().type == "ADMINISTRADOR" && window.location.pathname != "Users/sinuhe/Documents/controlActivos/index.html") window.location.pathname = "Users/sinuhe/Documents/controlActivos/index.html";
            this.cu = s.val();
        })
        buildMenu(properties, 'toCreate');
    };
});

function finishTemporalKeeper(tmpKeeperName, tmpReceptorName, tableId) {
    var tmpKeeperName = document.getElementById('tmpKeeperName').value;
    var tmpReceptorName = document.getElementById('tmpReceptorName').value;

    for (active of this.temporalList) {
        active.status = 'TEMPORAL';
    }
    var promise = database.ref('actives/temporalKeeper').push({
        integerOutDate: getCurrentDate(),
        integerReturnDate: formatDate(document.getElementById('tmpReturnDate').value),
        actives: this.tmpActiveList
    });

    promise.then(function (response) {
        setModal('Resguardo Temporal Exitoso', 'El resguardo temporal se llevó a cabo correctamente.');
        $('#message').modal('open').value = "";
        makePDFTmpKeeper(tmpKeeperName, tmpReceptorName, tableId);
        updateActiveStatus(0);
        actionButton('newTemporalKeeper', 'hide', 'activesMainMenu')
    }, function (error) {
        setModal('ERROR Resguardo Temporal', 'Hubo un problema, inténtelo de nuevo, por favor.');
        $('#message').modal('open').value = "";
    })

}

function updateActiveStatus(index) {
    if (index < this.temporalList.length) {
        var prom = database.ref('actives/all/' + this.temporalList[index].id).update({
            status: 'TEMPORAL'
        });
        prom.then(function (r) {
            updateActiveStatus(index + 1);
        }, function (e) { });
    } else moveActiveStatus(0);
};
function moveActiveStatus(index) {
    console.log('index on moveAcibe: ' + index)
    if (index < this.temporalList.length) {
        var prom = database.ref('actives/status/TEMPORAL/' + this.temporalList[index].id).set(
            this.temporalList[index]
        );
        prom.then(function (r) {
            return database.ref('actives/status/ACTIVO/' + this.temporalList[index].id).set(null)
        }, function (e) { })
            .then(function (r) {
                return database.ref('actives/brand/' + this.temporalList[index].brand + '/' + this.temporalList[index].id).update({
                    status: 'TEMPORAL'
                })
            })
            .then(function (r) {
                return database.ref('actives/category/' + this.temporalList[index].category + '/' + this.temporalList[index].id).update({
                    status: 'TEMPORAL'
                })
            })
            .then(function (r) {
                return database.ref('actives/keeper/' + this.temporalList[index].keeperId + '/' + this.temporalList[index].id).update({
                    status: 'TEMPORAL'
                })
            })
            .then(function (r) {
                return database.ref('actives/model/' + this.temporalList[index].model + '/' + this.temporalList[index].id).update({
                    status: 'TEMPORAL'
                })
            })
            .then(function (r) {
                return database.ref('actives/name/' + this.temporalList[index].name + '/' + this.temporalList[index].id).update({
                    status: 'TEMPORAL'
                })
            })
            .then(function () {
                moveActiveStatus(index + 1);
            })
    } else return;
};

function makePDFTmpKeeper(tmpKeeperName, tmpReceptorName, tableId) {
    var date = new Date();

    jsPDF.autoTableSetDefaults({ headerStyles: { fillColor: [140, 33, 10] } });
    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(10);
    doc.text("Solicitó: " + tmpKeeperName, 320, 40);
    doc.text("Entregó: " + this.cu.userName + ' ' + this.cu.lastname, 320, 55);
    doc.text("Recibe: " + tmpReceptorName, 320, 70);
    doc.text("Fecha de entrega: " + date.toLocaleDateString('es-MX'), 320, 85);
    doc.text("Fecha tentativa de devolución: " + document.getElementById('tmpReturnDate').value, 320, 100);
    var res = doc.autoTableHtmlToJson(document.getElementById(tableId));
    var cols = [res.columns[0], res.columns[1], res.columns[2], res.columns[3]];
    console.log('this are the col: ' + res.columns);
    var mulconImage = 'data:image/jpeg;base64,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zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvrTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzoNTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzx724OPzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyv32oMMDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz332gAMNzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxb3334OosPTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzy/33334ACIPfzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyV333334AAIsvTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzhT333334AABM4tDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzgb3333334AAAABZvTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyf33333334AAAAAAP7Tzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyz333333334AAAAAAALrzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvT33333334AAAAAAAOnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxv3333334AAAAAJr3zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxPX3334AAAZrzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzP334AM33zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyz7sz7zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzzzTzz3zzzzzzHzzzzzzzvPPzzzzzjf/HTzzzTzzzzzzzzzzzxLTzzzyvXzyrzzxb3z7zzzzx/Z8/fbDzyfI99arzzwrzzzwP/AM88888WT8884Wf88q888W98+8888j2c888sf8jyc888Na889S088D/888888+G088j2b88q888W98+8888w88888888y088888W98r2a88D/wDPPPPOKi9/PHiOvPKvPPFvfPvPPOKvPPPPPPOCvPPPPPP9/KwH0/A//PPPPKR/JvK57JvPKvPPHvfPvPPOIPPPPPPPLAPPPPPPJ1/KwEz9w/8Azzzzy9/wvNZzzLzzrzzxZTz7zzzyrHzzzzzTxZ/zzzzhbzysABNuL/zzzzw9XywTfzzZywbjzh7zzrzzzSy7nTzx4PyzZfzzDIfzysAAAD3/AM8888b088/U887c8M6qWl88yyyy08MeWCa3888s+iCW1888vDDDDC/888888888888888888888888888888888888888888888887288888888886xz88x5x88+88843899+8/x888++8+49886x+8++867x8828888889E9887fM9+80+98a28s+d8+d989oU8B+Pf8Adsc898N+618sW98888rc8885388e8X518u798988vm881sc82888qc888898y8428rr988888G5b8t50Zc8V+Q81yX88888j+8M8d8c0738P1z8418J05d8ls+888888dc888N8888888sd8888888888d888Nc888tc88888tc88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888/8QAKhEBAAIBAwIFBAMBAQAAAAAAAQARECAhMUFRMFBhobFxwdHwQIGRkGD/2gAIAQIRAT8Q/wCUAR82fNAw+Zhl82Ky1tKb+Ymj4nB3pQ6Pl4aficPjsi1893lpq+JzQiydR/h5l8ToS9mbng6nlQa/idW45OpE6Pk4eB8TrDo/lEVFPl3xPgWzjule6fJB8H4nwDbKIJvvXya9fxOoWyibIX6xyy/Kb0/E6AFqibEbe/SIWr8tvPxOEC2bDvfaP2/MbiCz2Zsm57Ru3+P/AD1aKzXgVKla6lSv4RxqI5dBHwAly5cuc6Aly5cuVodJHWR1OXQR1kXUuCLpGOULkYmgjrZzoMOXQR/gGsjj3M3Ab9fzEyR1sI54w5dBHW+C6yOPc4uVbdfSJgjqI45wRx0y6CP8cjj3OEEpj9Ye0SEdRHBGcZOMugjrI+AR8H3OXAbMoLw8QjqI6HJorPHgE5laAjnmVoCLn3OhrjfOodA6Bji5c2ly83Lly9FzabSyXpubTaXF0cSAz9A/ifsH8T9g/ifsH8S0t3TZ/EefMAB2s6i/DqzbO8h/c3k7d8p0LnSsv6ykFZoDvh8cPGKkzhVPTHUvPTP9iodWAhbPrLg2Zr+4uMQ5Yz5jCtFsKbQfVg9iz0zTm2d5D+5vJ274QB1jvmMVothKlC7vE2J275QLNnHD1y0hbRKjncsVW2Gr3XRwwnrOwg59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';
    var header = function (data) {
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.setFontStyle('bold');
        doc.addImage(mulconImage, 'JPEG', data.settings.margin.left, 5, 100, 100);
        doc.text("RESGUARDO TEMPORAL MULCON Construcciones Especializadas S.A. de C.V.", 220, 20);
    };

    var options = {
        theme: 'grid',
        addPageContent: header,
        margin: {
            top: 100
        },
        startY: 115
    };

    doc.autoTable(cols, res.data, options);
    let finalY = doc.autoTable.previous.finalY;
    //signature on full same page
    if(finalY > 485 && finalY < 590){
        console.log('1 ' + finalY)
        doc.text("Entrega: " + this.cu.userName + ' ' + this.cu.lastname,100,500)
        doc.text("Recibe: " + tmpReceptorName,600,500);
        doc.text("_________________________",100,545);
        doc.text("_________________________",600,545);
    }
    //signature on almost empty same page
    if(finalY < 485){
        console.log('2 ' + finalY)
        doc.text("Entrega: " + this.cu.userName + ' ' + this.cu.lastname,100,500)
        doc.text("Recibe: " + tmpReceptorName,600,500);
        doc.text("_________________________",100,545);
        doc.text("_________________________",600,545);
    }
    //signatures on new Page
    if(finalY > 591){
        console.log('3 ' + finalY)
        doc.addPage();
        doc.text("Entrega: " + this.cu.userName + ' ' + this.cu.lastname,100,115)
        doc.text("Recibe: " + tmpReceptorName,600,115);
        doc.text("_________________________",100,185);
        doc.text("_________________________",600,185);
    }
     
    doc.save("PrestamoTemporal_" + tmpKeeperName + '_' + date.toLocaleDateString() + ".pdf");
};
function logout() {
    firebase.auth().signOut();
};

function actionButton(elementtoHide, classToSet, elementToShow) {
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
    if (document.getElementById('selectedBuilding').innerText != 'OTRO')
        var location = document.getElementById('selectedBuilding').innerText + ', ' + document.getElementById('selectedRoom').innerText;
    else
        var location = document.getElementById('otherBuildingInputField').value
    if (document.getElementById('selectedBuilding').innerText == 'RESGUARDO PERSONAL') {
        var location = document.getElementById('selectedBuilding').innerText;
    }
    if (document.getElementById('maintenanceDate').value != undefined && document.getElementById('maintenanceDate').value.length > 2) {
        var maintenanceDate = document.getElementById('maintenanceDate').value;
        var integerMaintenanceDate = formatDate(maintenanceDate);
    }
    else {
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
    if (document.getElementById('warantyDate').value != undefined && document.getElementById('warantyDate').value.length > 2)
        var warantyDate = document.getElementById('warantyDate').value;
    else
        var warantyDate = "NA";
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
    promise.then(function (response) {
        database.ref('actives/all/' + promise.key).update({
            id: promise.key
        });

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
        document.getElementById('otherBuildingInputField').value = "";
        document.getElementById('otherBuildingInput').classList.add('hide');
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
            option.setAttribute("onclick", "selectEmployeChange('" + element.name + " " + element.lastname + "','" + element.id + "');");
            option.href = "#!";
            employeList.appendChild(option);
        }
    });
};

function loadEmployeesFilterSecond(path, comboBoxId) {
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
function printReport(HTMLElementId, nextHTMLElement) {
    loadDepartmentsPrinting(HTMLElementId, nextHTMLElement)
}
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
function loadBuildings(elementId, nextElementId, selectedRoomInput, selectedBuildingInput, otherFlah) {
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
        if (otherFlah != undefined && otherFlah == 'O') {
            var listItem = document.createElement('li');
            var option = document.createElement('a');
            option.value = "Otro"
            option.text = "Otro"
            option.setAttribute("onclick", "showOther('otherBuildingInput');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            buildingList.appendChild(listItem);
        }
    });
};

function showOther(otherBuildingInput) {
    document.getElementById(otherBuildingInput).classList.remove('hide');
    document.getElementById('normalBuilding').classList.add('hide');
    document.getElementById('selectedBuilding').innerText = 'OTRO';
}
function showOtherTemporal(otherBuildingInput) {
    document.getElementById(otherBuildingInput).classList.remove('hide');
    document.getElementById('selectedTemporalKeeper').innerText = 'OTRO';
}
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

function selectEmployeChange(employeName, employeId) {
    document.getElementById('newKeeper').innerText = "Nuevo Responsable: " + employeName;
    this.selectedEmploye.id = employeId;
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
    document.getElementById('otherBuildingInput').classList.add('hide');
    document.getElementById('normalBuilding').classList.remove('hide');
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

function loadDepartmentsPrinting(HTMLElementId, nextHTMLElement) {
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
            option.setAttribute("onclick", "selectDepartmentPrint('" + element.name + "','" + nextHTMLElement + "');");
            option.href = "#!";
            option.id = element.id
            listItem.appendChild(option)
            departmentList.appendChild(listItem);
        }
    });
}
function selectDepartmentPrint(name, elementId) {
    document.getElementById(elementId).innerText = name;
}
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
                    tableBody += "<td><a class='waves-effect waves-light btn lime darken-4 '  onclick='finishTrip(&quot;" + element.id + "&quot;);'>Terminar salida/Detalles</a>  </td>";
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
                            tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                            if (element.quantity != 1) tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                            else
                                tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                        }
                        if (element.status.toLowerCase() == 'reparacion') {
                            tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn yellow modal-trigger' href='#modalInfo' onclick = 'viewStatus( &quot;modalInfoContent&quot;,&quot;" + element.id + "&quot;,&quot;actives/status/REPARACION&quot;);'>Ver Detalle</a>  </td>";
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
                            if (element.quantity != 1) tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                            else
                                tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                        }
                        if (element.status.toLowerCase() == 'reparacion') {

                            tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                            tableBody += "<td><a class='waves-effect waves-light btn yellow modal-trigger' href='#modalInfo' onclick = 'viewStatus( &quot;modalInfoContent&quot;,&quot;" + element.id + "&quot;,&quot;actives/status/REPARACION&quot;);'>Ver Detalle</a>  </td>";
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
                        if (element.quantity != 1) tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                        else
                            tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                    }
                    if (element.status.toLowerCase() == 'reparacion') {
                        tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn yellow modal-trigger' href='#modalInfo' onclick = 'viewStatus( &quot;modalInfoContent&quot;,&quot;" + element.id + "&quot;,&quot;actives/status/REPARACION&quot;);'>Ver Detalle</a>  </td>";
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
    this.secondSearch = name;
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

    var currentActiveValue = "";
    var currentActive = database.ref('actives/all/' + active);
    currentActive.on('value', function (s) {
        currentActiveValue = s.val();
        database.ref('actives/status/REPARACION/' + active).set(s.val());
    })
    var repairingBeginingDate = document.getElementById(repairingBeginingDateInputId).value;
    var repairingFinishDate = document.getElementById(repairingFinishDateInputId).value;
    var repairingCost = document.getElementById(repairingCostInputId).value;
    var repairingPlace = document.getElementById(repairingPlaceInputId).value;
    var promise = database.ref('actives/status/REPARACION/' + active).update({
        status: 'REPARACION'
    });

    promise.then(function (response) {
        setModal('Registro Exitoso', 'El activo se ha enviado a reparar.');
        $('#message').modal('open').value = "";
        document.getElementById(repairingBeginingDateInputId).value = "";
        document.getElementById(repairingFinishDateInputId).value = "";
        document.getElementById(repairingCostInputId).value = "";
        document.getElementById(repairingPlaceInputId).value = "";
        database.ref('actives/status/ACTIVO/' + active).set(null);
        database.ref('actives/brand/' + currentActiveValue.brand + '/' + currentActiveValue.id).update({
            status: 'REPARACION'
        });
        database.ref('actives/all/' + currentActiveValue.id).update({
            status: 'REPARACION'
        });
        database.ref('actives/category/' + currentActiveValue.category + '/' + currentActiveValue.id).update({
            status: 'REPARACION'
        });
        database.ref('actives/keeper/' + currentActiveValue.keeperId + '/' + currentActiveValue.id).update({
            status: 'REPARACION'
        });
        database.ref('actives/model/' + currentActiveValue.model + '/' + currentActiveValue.id).update({
            status: 'REPARACION'
        });
        database.ref('actives/name/' + currentActiveValue.name + '/' + currentActiveValue.id).update({
            status: 'REPARACION'
        });
        database.ref('actives/status/REPARACION/' + active).update({
            repairingBeginingDate: repairingBeginingDate,
            integerRepairingBeginingDate: formatDate(repairingBeginingDate),
            repairingFinishDate: repairingFinishDate,
            integerRepairingFinishDate: formatDate(repairingFinishDate),
            cost: repairingCost,
            place: repairingPlace
        })
        simpleSearch('firstActiveFilter', 'secondActiveFilter', 'resultsTable');
        actionButton('repairing', 'hide', 'query');
    });
};

function deleteElement(id, path, fields, currentQuantity, newQuantity) {
    var promise;
    var prevActive = database.ref(path + '/' + id);
    var newQuantity = document.getElementById(newQuantity).value;
    if (newQuantity > currentQuantity) {
        setModal('Error', 'Ha intentado dar de baja un número de piezas mayor al existente');
        $('#message').modal('open').value = "";
    }
    if (newQuantity < currentQuantity) {//normal
        promise = database.ref(path + '/' + id).update({
            quantity: (currentQuantity - newQuantity)
        });
        database.ref('actives/status/ACTIVO/' + id).update({
            quantity: (currentQuantity - newQuantity)
        })
    };
    if (newQuantity == currentQuantity) {//delete
        promise = database.ref(path + '/' + id).update({
            status: 'BAJA',
            quantity: 0
        });
        database.ref('actives/status/ACTIVO/' + id).set(null);
        var newActive = database.ref('actives/status/BAJA/' + id);
        prevActive.on('value', function (s) {
            newActive.set(s.val());
            database.ref('actives/all/' + id).update({
                status: 'BAJA'
            });
            database.ref('actives/brand/' + prevActive.brand + '/' + prevActive.id).update({
                status: 'BAJA'
            });
            database.ref('actives/categoty/' + prevActive.categoty + '/' + prevActive.id).update({
                status: 'BAJA'
            });
            database.ref('actives/keeper/' + prevActive.keeperId + '/' + prevActive.id).update({
                status: 'BAJA'
            });
            database.ref('actives/model/' + prevActive.model + '/' + prevActive.id).update({
                status: 'BAJA'
            });
            database.ref('actives/name/' + prevActive.name + '/' + prevActive.id).update({
                status: 'BAJA'
            });
        })
    };
    if (promise != undefined) {
        promise.then(function (response) {
            //query(path, this[fields], 'resultsTable');
            simpleSearch('firstActiveFilter', 'secondActiveFilter', 'resultsTable');
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
    var promise = database.ref('actives/all' + '/' + activeId + '/status').set('ACTIVO');
    var repairedActive = database.ref('actives/all/' + activeId).on('value', function (s) {
        var currActive = s.val();
        database.ref('actives/brand' + '/' + currActive.brand + '/' + currActive.id + '/status').set('ACTIVO');
        database.ref('actives/category' + '/' + currActive.category + '/' + currActive.id + '/status').set('ACTIVO');
        database.ref('actives/keeper' + '/' + currActive.keeperId + '/' + currActive.id + '/status').set('ACTIVO');
        database.ref('actives/model' + '/' + currActive.model + '/' + currActive.id + '/status').set('ACTIVO');
        database.ref('actives/name' + '/' + currActive.name + '/' + currActive.id + '/status').set('ACTIVO');
        database.ref('actives/status/REPARACION' + '/' + currActive.id).set(null);
        database.ref('actives/status' + '/ACTIVO/' + currActive.id).set(currActive);
    });
    promise.then(function (response) {
        simpleSearch('firstActiveFilter', 'secondActiveFilter', 'resultsTable');
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
    var active = database.ref('actives/all/' + activeId);
    keeperName = keeperName.slice(18, keeperName.length);
    var promise = database.ref('actives/all' + '/' + activeId).update({
        keeperName: keeperName,
        keeperId: this.selectedEmploye.id
    });
    active.on('value', function (s) {
        var _active = s.val();
        database.ref('actives/brand/' + _active.brand + '/' + activeId).update({
            keeperName: keeperName,
            keeperId: this.selectedEmploye.id
        });
        database.ref('actives/category/' + _active.category + '/' + activeId).update({
            keeperName: keeperName,
            keeperId: this.selectedEmploye.id
        });
        database.ref('actives/keeper/' + _active.keeperId + '/' + activeId).update({
            keeperName: keeperName,
            keeperId: this.selectedEmploye.id
        });
        database.ref('actives/model/' + _active.model + '/' + activeId).update({
            keeperName: keeperName,
            keeperId: this.selectedEmploye.id
        });
        database.ref('actives/name/' + _active.name + '/' + activeId).update({
            keeperName: keeperName,
            keeperId: this.selectedEmploye.id
        });
        database.ref('actives/status/ACTIVO/' + activeId).update({
            keeperName: keeperName,
            keeperId: this.selectedEmploye.id
        });
    });
    promise.then(function (response) {
        simpleSearch('firstActiveFilter', 'secondActiveFilter', 'resultsTable');
        setModal('Cambio de responsable exitoso', 'El activo ha cambiado de responsable.');
        database.ref('actives/status/ACTIVO' + '/' + activeId).update({
            keeperName: keeperName,
            keeperId: this.selectedEmploye.id
        });
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

function makePDF(department, name) {
    var date = new Date();

    jsPDF.autoTableSetDefaults({ headerStyles: { fillColor: [140, 33, 10] } });
    var doc = new jsPDF('l', 'pt', 'legal');

    var res = doc.autoTableHtmlToJson(document.getElementById("resultsTable"));
    var cols = [res.columns[0], res.columns[1], res.columns[2], res.columns[3], res.columns[4], res.columns[5]];
    var mulconImage = 'data:image/jpeg;base64,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zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvrTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzoNTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzx724OPzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyv32oMMDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz332gAMNzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxb3334OosPTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzy/33334ACIPfzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyV333334AAIsvTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzhT333334AABM4tDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzgb3333334AAAABZvTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyf33333334AAAAAAP7Tzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyz333333334AAAAAAALrzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvT33333334AAAAAAAOnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxv3333334AAAAAJr3zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxPX3334AAAZrzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzP334AM33zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyz7sz7zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzzzTzz3zzzzzzHzzzzzzzvPPzzzzzjf/HTzzzTzzzzzzzzzzzxLTzzzyvXzyrzzxb3z7zzzzx/Z8/fbDzyfI99arzzwrzzzwP/AM88888WT8884Wf88q888W98+8888j2c888sf8jyc888Na889S088D/888888+G088j2b88q888W98+8888w88888888y088888W98r2a88D/wDPPPPOKi9/PHiOvPKvPPFvfPvPPOKvPPPPPPOCvPPPPPP9/KwH0/A//PPPPKR/JvK57JvPKvPPHvfPvPPOIPPPPPPPLAPPPPPPJ1/KwEz9w/8Azzzzy9/wvNZzzLzzrzzxZTz7zzzyrHzzzzzTxZ/zzzzhbzysABNuL/zzzzw9XywTfzzZywbjzh7zzrzzzSy7nTzx4PyzZfzzDIfzysAAAD3/AM8888b088/U887c8M6qWl88yyyy08MeWCa3888s+iCW1888vDDDDC/888888888888888888888888888888888888888888888887288888888886xz88x5x88+88843899+8/x888++8+49886x+8++867x8828888889E9887fM9+80+98a28s+d8+d989oU8B+Pf8Adsc898N+618sW98888rc8885388e8X518u798988vm881sc82888qc888898y8428rr988888G5b8t50Zc8V+Q81yX88888j+8M8d8c0738P1z8418J05d8ls+888888dc888N8888888sd8888888888d888Nc888tc88888tc88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888/8QAKhEBAAIBAwIFBAMBAQAAAAAAAQARECAhMUFRMFBhobFxwdHwQIGRkGD/2gAIAQIRAT8Q/wCUAR82fNAw+Zhl82Ky1tKb+Ymj4nB3pQ6Pl4aficPjsi1893lpq+JzQiydR/h5l8ToS9mbng6nlQa/idW45OpE6Pk4eB8TrDo/lEVFPl3xPgWzjule6fJB8H4nwDbKIJvvXya9fxOoWyibIX6xyy/Kb0/E6AFqibEbe/SIWr8tvPxOEC2bDvfaP2/MbiCz2Zsm57Ru3+P/AD1aKzXgVKla6lSv4RxqI5dBHwAly5cuc6Aly5cuVodJHWR1OXQR1kXUuCLpGOULkYmgjrZzoMOXQR/gGsjj3M3Ab9fzEyR1sI54w5dBHW+C6yOPc4uVbdfSJgjqI45wRx0y6CP8cjj3OEEpj9Ye0SEdRHBGcZOMugjrI+AR8H3OXAbMoLw8QjqI6HJorPHgE5laAjnmVoCLn3OhrjfOodA6Bji5c2ly83Lly9FzabSyXpubTaXF0cSAz9A/ifsH8T9g/ifsH8S0t3TZ/EefMAB2s6i/DqzbO8h/c3k7d8p0LnSsv6ykFZoDvh8cPGKkzhVPTHUvPTP9iodWAhbPrLg2Zr+4uMQ5Yz5jCtFsKbQfVg9iz0zTm2d5D+5vJ274QB1jvmMVothKlC7vE2J275QLNnHD1y0hbRKjncsVW2Gr3XRwwnrOwg59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';
    var header = function (data) {
        doc.setFontSize(10);
        doc.text("Nombre: " + name, 370, 40);
        doc.text("Departamento: " + department, 370, 55);
        doc.text("Elaboró: " + this.cu.userName + ' ' + this.cu.lastname, 370, 70);
        doc.text("Fecha: " + date.toLocaleDateString('es-MX'), 370, 85);
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.setFontStyle('bold');
        doc.addImage(mulconImage, 'JPEG', data.settings.margin.left, 5, 100, 90);
        doc.text("Inventarios MULCON Construcciones Especializadas S.A. de C.V.", 300, 20);
        
    };

    var options = {
        theme: 'grid',
        addPageContent: header,
        margin: {
            top: 100
        },
        startY: 105
    };
    doc.setFontSize(10);
    doc.autoTable(cols, res.data, options);
    let finalY = doc.autoTable.previous.finalY;
    
    if(finalY > 485){
        //doc.text("Entrega ")
    }
    doc.save("reporte" + date.toLocaleDateString() + ".pdf");
};
function selectCategory(categoryName, nextHTMLElement) {
    document.getElementById(nextHTMLElement).innerText = categoryName;
    this.secondSearch = categoryName.toUpperCase();
    this.secondFilter = 'category';
};

function selectTripType(categoryName, nextHTMLElement) {
    document.getElementById(nextHTMLElement).innerText = categoryName;
    this.secondSearch = categoryName.toUpperCase();
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

function getCurrentDate() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth(); //January is 0!
    var year = today.getFullYear();
    var date = formatDateToSpanish(day, month, year);
    return formatDate(date)
}


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
            document.getElementById('finishTripTitle').innerHTML = "<div class='row center-align'><div class='col s8 offset-s2'><div class='card blue-grey darken-1'><div class='card-content white-text'><span class='card-title'>Detalles de Salida</span><h6>Vehiculo: " + objectTrip.vehicle + "</h6><h6>Fecha salida: " + objectTrip.date + "</h6><h6>Motivo salida: " + objectTrip.issue + "</h6><h6>Tipo de Salida: " + objectTrip.tripType + "</h6><h6>Conductor: " + objectTrip.driver + "</h6><br></div></div></div></div>";
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
                    tableBody += "<td><a class='waves-effect waves-light btn lime darken-4 '  onclick='finishTrip(&quot;" + element.id + "&quot;);'>Terminar salida/Detalles</a>  </td>";
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
    var doc = new jsPDF('l', 'pt', 'legal');

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

function buildMenu(properties, htmlId) {
    var toSet = document.getElementById(htmlId);
    var body = document.createElement(properties.htmlElement);
    body.className = properties.classes;
    body.textContent = properties.value;
    body.id = properties.id;
    body.type = properties.type;
    body.setAttribute(properties.events.name, properties.events.method);
    if (properties.innerElements != ' ') menuBuilder(properties.innerElements, body);

    toSet.appendChild(body);
};

function menuBuilder(propertie, incoming) {
    for (element of propertie) {
        var newElement = document.createElement(element.htmlElement);
        newElement.className = element.classes;
        newElement.textContent = element.value;
        newElement.id = element.id;
        newElement.type = element.type;
        if (element.events != ' ')
            newElement.setAttribute(element.events.name, element.events.method);
        if (element.innerElements != ' ') {
            menuBuilder(element.innerElements, newElement);
        }
        incoming.appendChild(newElement);
    }
};


function queryTest(filters) {
    if (filters != undefined) {
        var _filters = Object.values(filters);
        var x = database.ref('actives');
        for (filter of _filters) {

            x = x.orderByChild(filter.propertie);
            x = x.equalTo(filter.search);
        }
        x.on('value', function (snapshot) {
        });
    }
};

function selectNormalFilter(comboId, filter, selectedValue, filterName, inputId) {
    document.getElementById(comboId).innerText = selectedValue;
    this[filterName].name = filter;
    document.getElementById(inputId).classList.remove('hide')
    document.getElementById('keeperFirstFilter').classList.add('hide');
    document.getElementById('statusFirstFilter').classList.add('hide');
    document.getElementById('categoryFirstFilter').classList.add('hide');
    document.getElementById('dateInputsFirstFilter').classList.add('hide');
}
function selectNormalFilterSecond(comboId, filter, selectedValue, filterName, inputId) {
    document.getElementById(comboId).innerText = selectedValue;
    this[filterName] = filter;
    document.getElementById(inputId).classList.remove('hide')
    document.getElementById('keeperSecondFilter').classList.add('hide');
    document.getElementById('statusSecondFilter').classList.add('hide');
    document.getElementById('categorySecondFilter').classList.add('hide');
}
function removeFilter(secondFilter, secondActiveFilterInput) {
    this[secondFilter] = "";
    document.getElementById(secondActiveFilterInput).value = "";
    document.getElementById(secondActiveFilterInput).classList.add('hide');
    document.getElementById('secondActiveFilter').innerText = "SELECCIONAR";
}

function firstFilterKeeper(keeperFirstFilter, activeFilterKeeperList, comboId, selectedFilter) {
    document.getElementById(keeperFirstFilter).classList.remove('hide');
    loadEmployeesFirstFilter('employe', activeFilterKeeperList, 'firstFilterSelectedKeeper');
    document.getElementById(comboId).innerText = selectedFilter;
    document.getElementById('firstActiveFilterInput').classList.add('hide');
    document.getElementById('statusFirstFilter').classList.add('hide');
    document.getElementById('categoryFirstFilter').classList.add('hide');
    document.getElementById('dateInputsFirstFilter').classList.add('hide');
};
function secondFilterKeeper(keeperFirstFilter, activeFilterKeeperList, comboId, selectedFilter) {
    document.getElementById(keeperFirstFilter).classList.remove('hide');
    loadEmployeesFirstFilter('employe', activeFilterKeeperList, 'secondFilterSelectedKeeper');
    document.getElementById(comboId).innerText = selectedFilter;
    document.getElementById('secondActiveFilterInput').classList.add('hide');
    document.getElementById('statusSecondFilter').classList.add('hide');
    document.getElementById('categorySecondFilter').classList.add('hide');
};
function selectEmployeFirstFilter(comboId, employeName, employeId, hiddenElementId) {
    document.getElementById(comboId).innerText = employeName;
    document.getElementById(hiddenElementId).innerText = employeId;
    this.selectedEmploye.id = employeId;
    this.secondSearch = employeId;
    this.secondFilter = 'keeperId';
};

function loadEmployeesFirstFilter(path, comboBoxId, comboId) {
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
            option.setAttribute("onclick", "selectEmployeFirstFilter('" + comboId + "','" + element.name + " " + element.lastname + "','" + element.id + "','firstFilterKeeperId');");
            option.href = "#!";
            item.appendChild(option)
            employeList.appendChild(item);
        }
    });
};

function selectFirstFilterStatus(comboId, statusToSet) {
    document.getElementById(comboId).innerText = statusToSet
    this.secondFilter = 'status';
    this.secondSearch = statusToSet.toUpperCase();
}

function useStatusFirstFilter(elementId, value, comboId) {
    document.getElementById('categoryFirstFilter').classList.add('hide');
    document.getElementById('firstActiveFilterInput').classList.add('hide');
    document.getElementById('keeperFirstFilter').classList.add('hide');
    document.getElementById('statusFirstFilter').classList.add('hide');
    document.getElementById('dateInputsFirstFilter').classList.add('hide');
    document.getElementById(elementId).classList.remove('hide');
    document.getElementById(comboId).innerText = value;

};

function useStatusSecondFilter(elementId, value, comboId) {
    document.getElementById('categorySecondFilter').classList.add('hide');
    document.getElementById('secondActiveFilterInput').classList.add('hide');
    document.getElementById('keeperSecondFilter').classList.add('hide');
    document.getElementById('statusSecondFilter').classList.add('hide');
    document.getElementById(elementId).classList.remove('hide');
    document.getElementById(comboId).innerText = value;
    this.secondFilter = 'category';

};

function useDateFirstFilter(datesId) {
    document.getElementById('categoryFirstFilter').classList.add('hide');
    document.getElementById(datesId).classList.remove('hide');
    document.getElementById('firstActiveFilterInput').classList.add('hide');
    document.getElementById('keeperFirstFilter').classList.add('hide');
    document.getElementById('firstActiveFilter').innerText = "Fechas";
};
function useDateSecondFilter(datesId) {
    document.getElementById('categorySecondFilter').classList.add('hide');
    document.getElementById(datesId).classList.remove('hide');
    document.getElementById('secondActiveFilterInput').classList.add('hide');
    document.getElementById('keeperSecondFilter').classList.add('hide');
    document.getElementById('secondActiveFilter').innerText = "Fechas";
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

function simpleSearch(firstActiveFilter, secondActiveFilter, tableId) {
    if (document.getElementById(firstActiveFilter).innerText == document.getElementById(secondActiveFilter).innerText) {
        setModal('Error de búsqueda', 'Eligió el mismo filtro.\n No se puede elegir el mismo filtro (arriba y abajo) al realizar la búsqueda');
        $('#message').modal('open').value = "";
    } else {
        //with one filter
        var filter = document.getElementById(firstActiveFilter).innerText.toLowerCase();
        switch (filter) {
            case ('nombre del activo'):
                var path = 'name';
                var search = document.getElementById('firstActiveFilterInput').value.toUpperCase();
                var ref = database.ref('actives/' + path + '/' + search);
                if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                    var secondSearch = this.secondSearch;
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var filterArray = Object.values(snapshot.val());
                            var filteredResults = [];
                            for (var element of filterArray) {
                                if (element[this.secondFilter] == secondSearch)
                                    filteredResults.push(element);
                            }
                            buildTable(filteredResults, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    })
                } else {
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var resultasArray = Object.values(snapshot.val())
                            buildTable(resultasArray, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    });
                }
                break;
            case ('nombre del responsable'):
                var path = 'keeper';
                var search = this.selectedEmploye.id;
                var ref = database.ref('actives/' + path + '/' + search);
                if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                    var secondSearch = this.secondSearch.toUpperCase();
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var filterArray = Object.values(snapshot.val());
                            var filteredResults = [];
                            for (var element of filterArray) {
                                if (element[this.secondFilter] == secondSearch)
                                    filteredResults.push(element);
                            }
                            buildTable(filteredResults, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    })
                } else {
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var resultasArray = Object.values(snapshot.val())
                            buildTable(resultasArray, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    });
                }
                break;
            case ('marca del activo'):
                var path = 'brand';
                var search = document.getElementById('firstActiveFilterInput').value.toUpperCase();
                var ref = database.ref('actives/' + path + '/' + search);
                if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                    var secondSearch = this.secondSearch.toUpperCase();
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var filterArray = Object.values(snapshot.val());
                            var filteredResults = [];
                            for (var element of filterArray) {
                                if (element[this.secondFilter] == secondSearch)
                                    filteredResults.push(element);
                            }
                            buildTable(filteredResults, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    })
                } else {
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var resultasArray = Object.values(snapshot.val())
                            buildTable(resultasArray, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    });
                }
                break;
            case ('modelo del activo'):
                var path = 'model';
                var search = document.getElementById('firstActiveFilterInput').value.toUpperCase();
                var ref = database.ref('actives/' + path + '/' + search);
                if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                    var secondSearch = this.secondSearch.toUpperCase();
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var filterArray = Object.values(snapshot.val());
                            var filteredResults = [];
                            for (var element of filterArray) {
                                if (element[this.secondFilter] == secondSearch)
                                    filteredResults.push(element);
                            }
                            buildTable(filteredResults, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    })
                } else {
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var resultasArray = Object.values(snapshot.val())
                            buildTable(resultasArray, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    });
                }
                break;
            case ('estado del activo'):
                var path = 'status';
                var search = document.getElementById('selectedStatusFirstFilterList').innerText.toUpperCase();
                var ref = database.ref('actives/' + path + '/' + search);
                if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                    var secondSearch = this.secondSearch.toUpperCase();
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var filterArray = Object.values(snapshot.val());
                            var filteredResults = [];
                            for (var element of filterArray) {
                                if (element[this.secondFilter] == secondSearch)
                                    filteredResults.push(element);
                            }
                            buildTable(filteredResults, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    })
                } else {
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var resultasArray = Object.values(snapshot.val())
                            buildTable(resultasArray, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    });
                }
                break;
            case ('categoría del activo'):
                var path = 'category';
                var search = document.getElementById('selectedCategoryFirstFilterList').innerText.toUpperCase();
                var ref = database.ref('actives/' + path + '/' + search);
                if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                    var secondSearch = this.secondSearch.toUpperCase();
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var filterArray = Object.values(snapshot.val());
                            var filteredResults = [];
                            for (var element of filterArray) {
                                if (element[this.secondFilter] == secondSearch)
                                    filteredResults.push(element);
                            }
                            buildTable(filteredResults, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    })
                } else {
                    ref.on('value', function (snapshot) {
                        if (snapshot.val() != null) {
                            var resultasArray = Object.values(snapshot.val())
                            buildTable(resultasArray, tableId, this.activeFields);
                        } else buildTable(snapshot.val(), tableId, this.activeFields);
                    });
                }
                break;
            case ('fechas'):
                var path = 'date';

                if (document.getElementById('dateBeforeFirst').checked) {
                    var date = document.getElementById('dateBeforeInputFirst').value;
                    var integerDate = formatDate(date);
                    var ref = database.ref('actives/all');
                    var resArray = null;
                    ref.orderByChild('integerRegisterDate').endAt(integerDate).on('value', function (snapshot) {
                        if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                            var secondSearch = this.secondSearch.toUpperCase();
                        } else {
                            if (snapshot.val() == null) buildTable(null, tableId, this.activeFields);
                            else {
                                resArray = Object.values(snapshot.val())
                                buildTable(resArray, tableId, this.activeFields);
                            }
                        }
                    });

                }
                if (document.getElementById('dateAfterFirst').checked) {
                    var date = document.getElementById('dateAfterInputFirst').value;
                    var integerDate = formatDate(date);
                    var ref = database.ref('actives/all');
                    var resArray = null;
                    ref.orderByChild('integerRegisterDate').startAt(integerDate).on('value', function (snapshot) {
                        if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                            var secondSearch = this.secondSearch.toUpperCase();
                        } else {
                            if (snapshot.val() == null) buildTable(null, tableId, this.activeFields);
                            else {
                                resArray = Object.values(snapshot.val())
                                buildTable(resArray, tableId, this.activeFields);
                            }
                        }
                    });
                }
                if (document.getElementById('dateBetweenFirst').checked) {
                    var dateA = formatDate(document.getElementById('dateBetweenInputAFirst').value);
                    var dateB = formatDate(document.getElementById('dateBetweenInputBFirst').value);
                    var ref = database.ref('actives/all');
                    var resArray;
                    ref.orderByChild('integerRegisterDate').startAt(dateA).endAt(dateB).on('value', function (snapshot) {
                        if (document.getElementById(secondActiveFilter).innerText != "SELECCIONAR") {
                            var secondSearch = this.secondSearch.toUpperCase();
                        } else {
                            if (snapshot.val() == null) buildTable(null, tableId, this.activeFields);
                            else {
                                resArray = Object.values(snapshot.val())
                                buildTable(resArray, tableId, this.activeFields);
                            }
                        }
                    });
                }
        }
    }
    document.getElementById('firstActiveFilterInput').value = "";
    document.getElementById('secondActiveFilterInput').value = "";
};

function newTemporalKeeperSearch(temporalActiveInput) {
    var search = document.getElementById(temporalActiveInput).value.toUpperCase();
    var activesArray = Object.values(this.currentQueryResult);
    var filteredResults = [];
    //filtering
    if (search != undefined) {
        console.log(search)
        for (var active of activesArray) {
            if (active.name == search) {
                filteredResults.push(active);
            }
        }
        buildTableTmp(filteredResults, 'newTemporalKeeperResultsTable', this.activeFieldsTmp, true);
    } else buildTableTmp(activesArray, 'newTemporalKeeperResultsTable', this.activeFieldsTmp, true);
}
function newTemporalKeeper(elementtoHide, classToSet, elementToShow) {
    document.getElementById(elementtoHide).classList.add(classToSet);
    document.getElementById(elementToShow).classList.remove(classToSet);
    var actives = database.ref('actives/status/ACTIVO');
    actives.on('value', function (s) {
        this.currentQueryResult = s.val();
    })
}
function buildTableTmp(resObject, tableId, fieldsArray, added) {
    var printBtn = document.getElementById('printReport');
    printBtn.classList.remove('hide');
    var table = document.getElementById(tableId);
    table.innerHTML = "";
    var tableHead, tableBody;
    tableHead = "<thead><tr>"
    tableBody = "<tbody>"
    if (resObject == null) {
        table.innerHTML = "<h3>No se encontraron resultados</h3>";
    }
    else {
        if (resObject.length > 0) {
            //without filters
            for (var field of fieldsArray) {
                tableHead += "<th>" + field.title + "</th>";
            };
            tableHead += "</tr></thead>"
            for (var element of resObject) {
                tableBody += '<tr>';
                for (var field of fieldsArray) {
                    if (element[field.propertie] == undefined) {
                        tableBody += "<td>NA</td>"
                    } else {
                        tableBody += "<td>" + element[field.propertie] + "</td>";
                    }
                };
                if (element.buildingWorkPlace == undefined) {
                    if (added)
                        tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#confirmTmpModal' onclick='selectTempActive(&quot;" + element.id + "&quot;)'>Agregar</a>  </td>";
                    else
                        tableBody += "<td><a class='waves-effect waves-light btn red' onclick='unSelectTempActive(&quot;" + element.id + "&quot;)'>Quitar</a>  </td>";

                }
                tableBody += '</tr>';
            }
            tableBody += "</tbody>";
            table.innerHTML += tableHead + tableBody;

        } else {
            if (this.temporalList.length == 0)
                table.innerHTML = "<h3>Vacío</h3>";
            else
                table.innerHTML = "<h3>No se encontraron resultasdfsgfdos</h3>";
        }
    }
};
function unSelectTempActive(activeId) {
    if (this.currentQueryResult[activeId] != undefined) {
        var prevQ = this.currentQueryResult[activeId].quantity;
        var newQ = this.tmpActiveList[activeId].quantity;
        this.currentQueryResult[activeId].quantity = Number(prevQ) + Number(newQ);
    }
    else
        this.currentQueryResult[activeId] = this.tmpActiveList[activeId];

    delete this.tmpActiveList[activeId];
    this.temporalList = Object.values(this.tmpActiveList);
    newTemporalKeeperSearch('temporalActiveInput')
    buildTableTmp(this.temporalList, 'selectedTemporalResultsTable', this.activeFieldsTmp, false);
}
function selectTempActive(activeId) {
    this.selectedActive = this.currentQueryResult[activeId]
    document.getElementById('confirmTmpModalModalContent').innerHTML = "";
    var text = "Nombre: " + this.selectedActive.name + '\nMarca: ' + this.selectedActive.brand + '\nCantidad disponible: ' + this.selectedActive.quantity;
    var li = document.createElement('li');
    li.className = 'collection-item';
    li.innerText = text;
    document.getElementById('confirmTmpModalModalContent').appendChild(li);
    document.getElementById('confirmTmpModalButton').setAttribute("onclick", "confirmTempKeeper('" + this.selectedActive.id + "');");
    document.getElementById('activeQuantityTmp').setAttribute('max', this.selectedActive.quantity);
}
function confirmTempKeeper(activeId) {
    var auxActive = Object.assign({}, this.selectedActive);
    if (document.getElementById('activeQuantityTmp').value > auxActive.quantity) {
        setModal('Cantidad incorrecta', 'No se puede prestar una cantidad mayor de la disponible.');
        $('#message').modal('open').value = "";
    } else {
        if (document.getElementById('activeQuantityTmp').value == auxActive.quantity) {
            console.log('GUAL')
            delete this.currentQueryResult[auxActive.id];
            this.temporalList.push(auxActive);
            this.tmpActiveList[auxActive.id] = auxActive;
        } else {
            if (document.getElementById('activeQuantityTmp').value < this.selectedActive.quantity) {
                var prevQ = this.currentQueryResult[auxActive.id].quantity;
                var newQ = document.getElementById('activeQuantityTmp').value;
                auxActive.quantity = document.getElementById('activeQuantityTmp').value;
                //temporalList is array
                this.temporalList.push(auxActive);
                //tmpActiveList is obect
                this.tmpActiveList[auxActive.id] = auxActive;

                this.currentQueryResult[auxActive.id].quantity = (prevQ - newQ);
            }
        }


        newTemporalKeeperSearch('temporalActiveInput')
        buildTableTmp(this.temporalList, 'selectedTemporalResultsTable', this.activeFieldsTmp, false);
    }
}
function buildTable(resObject, tableId, fieldsArray) {
    var printBtn = document.getElementById('printReport');
    printBtn.classList.remove('hide');
    var table = document.getElementById(tableId);
    table.innerHTML = "";
    var tableHead, tableBody;
    tableHead = "<thead><tr>"
    tableBody = "<tbody>"
    if (resObject == null) table.innerHTML = "<h3>No se encontraron resultados</h3>";
    else {
        if (resObject.length > 0) {
            //without filters
            for (var field of fieldsArray) {
                tableHead += "<th>" + field.title + "</th>";
            };
            tableHead += "</tr></thead>"
            for (var element of resObject) {
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
                        tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                        if (element.quantity != 1) tableBody += "<td><a class='waves-effect waves-light btn green' disabled>Reparar</a>  </td>";
                        else
                            tableBody += "<td><a class='waves-effect waves-light btn green' onclick = 'repairActive( &quot;" + element.id + "&quot;,&quot;repairing&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Reparar</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn orange' onclick = 'temporalKeeper( &quot;" + element.id + "&quot;,&quot;temporalKeeper&quot;);'>P.Temp</a>  </td>";
                    }
                    if (element.status.toLowerCase() == 'reparacion') {
                        tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#changeKeeper' onclick = 'changeKeeper( &quot;changeKeeperModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives&quot;);'>Responsable</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn red modal-trigger' href='#unsubscribe' onclick = 'confirmUnsubscribing( &quot;" + element.id + "&quot;,&quot;unsubscribeModalMessage&quot;,&quot;actives/all&quot;,&quot;activeFields&quot;);'>Baja</a>  </td>";
                        tableBody += "<td><a class='waves-effect waves-light btn yellow modal-trigger' href='#modalInfo' onclick = 'viewStatus( &quot;modalInfoContent&quot;,&quot;" + element.id + "&quot;,&quot;actives/status/REPARACION&quot;);'>Ver Detalle</a>  </td>";
                    }
                    if (element.status.toLowerCase() == 'temporal') {
                        tableBody += "<td><a class='waves-effect waves-light btn blue modal-trigger' href='#finishTemporal' onclick = 'finishTemporal( &quot;finishTemporalModalContent&quot;,&quot;" + element.id + "&quot;,&quot;actives/status/TEMPORAL&quot;);'>Detalle Resguardo Temporal</a></td>";
                    }
                }
                tableBody += '</tr>';
            }
            tableBody += "</tbody>";
            table.innerHTML += tableHead + tableBody;

        } else {
            table.innerHTML = "<h3>No se encontraron resultados</h3>";
        }
    }
};

function fillSecondFilter(inputId) {
    this.secondSearch = document.getElementById(inputId).value.toUpperCase();
};
function temporalKeeper(activeId, elementId) {
    var currActive = database.ref('actives/all/' + activeId);
    currActive.on('value', function (s) {
        _currActive = s.val();
        this.currentQueryResult = _currActive;
        document.getElementById('temporalContent').innerHTML = "<h5>Activo elegido:</h5><h4>Nombre:  " + _currActive.name + "</h4><h4>Marca:  " + _currActive.brand + "</h4><h4>Modelo: " + _currActive.model + "</h4>";
    });
    loadEmployeesTemporal('employe', 'selectedTemporalKeeperList');
    actionButton('query', 'hide', elementId)
};

function loadEmployeesTemporal(path, comboBoxId) {
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
            option.setAttribute("onclick", "selectTemporalEmploye('" + element.name + " " + element.lastname + "','" + element.id + "');");
            option.href = "#!";
            item.appendChild(option)
            employeList.appendChild(item);
        }
        var item = document.createElement('li');
        var option = document.createElement('a');
        option.value = 'OTRO'
        option.text = 'OTRO'
        option.setAttribute("onclick", "showOtherTemporal('otherTemporalKeeper');");
        option.href = "#!";
        item.appendChild(option)
        employeList.appendChild(item);
    });
};

function selectTemporalEmploye(employeName, employeId) {
    document.getElementById('selectedTemporalKeeper').innerText = employeName;
    this.selectedEmploye.name = employeName;
    this.selectedEmploye.id = employeId;
    document.getElementById('otherTemporalKeeper').classList.add('hide');
};
function confirmTemporal() {
    if (document.getElementById('selectedTemporalKeeper').innerText == 'OTRO') {
        var keeperName = document.getElementById('otherTemporalKeeperInput').value;
        var keeperId = 'OTRO';
    } else {
        var keeperName = this.selectedEmploye.name;
        var keeperId = this.selectedEmploye.id;
    }
    var location = document.getElementById('temporalLocation').value;
    var backDate = document.getElementById('temporalDate').value;
    var integerBackDate = formatDate(backDate);
    var extraInfo = document.getElementById('temporalExtraInfo').value;

    var promise = database.ref('actives/status/TEMPORAL/' + this.currentQueryResult.id).set(this.currentQueryResult);
    promise.then(function (response) {
        var keeperName = document.getElementById('otherTemporalKeeperInput').value = "";
        var location = document.getElementById('temporalLocation').value = "";
        var backDate = document.getElementById('temporalDate').value = "";
        var extraInfo = document.getElementById('temporalExtraInfo').value = "";
        setModal('Resguardo Temporal Exitoso', 'El activo se registró correctamente.');
        $('#message').modal('open').value = "";
        database.ref('actives/status/TEMPORAL/' + this.currentQueryResult.id).update({
            keeperName: keeperName,
            keeperId: keeperId,
            location: location,
            backDate: backDate,
            integerBackDate: integerBackDate,
            extraInfo: extraInfo,
            status: 'TEMPORAL'
        });
        database.ref('actives/status/ACTIVO/' + this.currentQueryResult.id).set(null);
        database.ref('actives/brand/' + this.currentQueryResult.brand + '/' + this.currentQueryResult.id).update({
            status: 'TEMPORAL'
        });
        database.ref('actives/all/' + this.currentQueryResult.id).update({
            status: 'TEMPORAL'
        });
        database.ref('actives/category/' + this.currentQueryResult.category + '/' + this.currentQueryResult.id).update({
            status: 'TEMPORAL'
        });
        database.ref('actives/keeper/' + this.currentQueryResult.keeperId + '/' + this.currentQueryResult.id).update({
            status: 'TEMPORAL'
        });
        database.ref('actives/model/' + this.currentQueryResult.model + '/' + this.currentQueryResult.id).update({
            status: 'TEMPORAL'
        });
        database.ref('actives/name/' + this.currentQueryResult.name + '/' + this.currentQueryResult.id).update({
            status: 'TEMPORAL'
        });
    }, function (error) { })

    var date = new Date();

    jsPDF.autoTableSetDefaults({ headerStyles: { fillColor: [62, 39, 35] } });
    var doc = new jsPDF('l', 'pt');

    var header = function (data) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
        doc.text("Resguardo Temporal " + date.toLocaleDateString(), data.settings.margin.left, 20);
    };

    doc.text(50, 50, "Fecha: " + date.toLocaleDateString());
    doc.text(50, 100, "Solicita: " + document.getElementById('temporalRequester').value)
    doc.text(50, 150, "Entrega: " + document.getElementById('temporalDeliver').value)
    doc.text(50, 200, "Recibe: " + document.getElementById('temporalGetter').value)
    doc.text(50, 250, "CECO: " + document.getElementById('temporalCeco').value)
    doc.text(50, 420, "_______________")
    doc.text(50, 450, "Firma Entrega ")
    doc.text(300, 420, "_______________")
    doc.text(300, 450, "Firma Recibido ")
    doc.save("resguardoTemporal" + date.toLocaleDateString() + ".pdf");
};

function checkPending() {
    var query = database.ref('expenses/pending');
    var resArray;
    query.on('value', function (s) {
        var result = s.val();
        resArray = Object.values(result);
        var filteredResult = {
            comming: [],
            expired: []
        };
        var date = new Date();
        verifyFiveteen = date.setDate((date.getDate() + 15));
        verifyThirty = date.setDate((date.getDate() + 30));
        for (var element of resArray) {
            if (element.integerOutDate > verifyFiveteen || element.integerOutDate > verifyThirty) {
                filteredResult.comming.push(element);
            }
            if (element.integerOutDate <= verifyFiveteen || element.integerOutDate <= verifyThirty) {
                filteredResult.expired.push(element);
            }
        }
        if (filteredResult.comming.length > 0 || filteredResult.expired.length > 0) {
            $('#modalInfoPending').modal('open').value = "";
            document.getElementById('pendingTab').classList.add('red');
            document.getElementById('pendingTab').classList.add('darken-4');
            var list = document.getElementById('pendingList');
            for (var element of filteredResult.comming) {
                var item = document.createElement('li');
                var div = document.createElement('div');
                div.className = 'collapsible-header';
                div.innerText = element.vehicleName;
                var span = document.createElement('span');
                span.className = "badge red darken-4 white-text";
                span.innerText = element.outDate;
                var innerDiv = document.createElement('div');
                innerDiv.className = 'collapsible-body'
                var p = document.createElement('p');
                p.innerText = "Vehículo: " + element.vehicleName + '\nFecha de entrada: ' + element.inDate + '\nFecha Salida/Entrega: ' + element.outDate + '\nCosto: $' + element.cost + '\nDetalles: ' + element.details;
                innerDiv.appendChild(p);
                div.appendChild(span);
                item.appendChild(innerDiv);
                item.appendChild(div);
                list.appendChild(item);
            }
            for (var element of filteredResult.expired) {
                var item = document.createElement('li');
                var div = document.createElement('div');
                div.className = 'collapsible-header';
                div.innerText = element.vehicleName;
                var span = document.createElement('span');
                span.className = "badge red darken-4 white-text";
                span.innerText = element.outDate;
                var innerDiv = document.createElement('div');
                innerDiv.className = 'collapsible-body'
                var p = document.createElement('p');
                p.innerText = "Vehículo: " + element.vehicleName + '\nFecha de entrada: ' + element.inDate + '\nFecha Salida/Entrega: ' + element.outDate + '\nCosto: $' + element.cost + '\nDetalles: ' + element.details;
                innerDiv.appendChild(p);
                div.appendChild(span);
                item.appendChild(innerDiv);
                item.appendChild(div);
                list.appendChild(item);
            }
        }
    })
}

function confirmPrinting(departmentId, name) {
    var department = document.getElementById(departmentId).innerText;
    var name = document.getElementById(name).value;
    makePDF(department, name);
}

function finishTemporal(finishTemporalModalContent, activeId, path) {
    var active = database.ref(path + '/' + activeId);
    active.on('value', function (s) {

    })
}

