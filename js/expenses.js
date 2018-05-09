class Expenses{
    constructor(){
        this.id;
        this.vehicleId;
        this.path = "expenses";
        this.inputs = [
            {
             value:"", 
             inputName:'expensesTitle',
             type:'select'
            }
         ,
            {
             value:"", 
             inputName:'selectedVehicleExpense',
             type:'select'
            },
            {
             value:"", 
             inputName:'vehicleExpenseImport',
             type:'input'
            },
            {
             value:"", 
             inputName:'vehicleExpenseDetails', 
             type:'input'
            },
            {
                value:"", 
                inputName:'expenseTodayDate', 
                type:'input'
            },
            {
                value:"", 
                inputName:'expenseDate', 
                type:'input'
            }
     ];
    };

    createExpense(expense){
        expense.inputs = InputManager.fillValuesFromInputs(expense.inputs); 
        //using dates
        if(expense.inputs[5].value != "" && expense.inputs[5].value.length > 0){
            var promise = database.ref(expense.path + '/todos').push({
                vehicleName: expense.inputs[0].value,
                name: expense.inputs[1].value,
                vehicleId: expense.vehicleId,
                cost:  expense.inputs[2].value,
                details: expense.inputs[3].value,
                inDate: expense.inputs[4].value,
                outDate: expense.inputs[5].value,
                integerInDate: formatDate(expense.inputs[4].value),
                integerOutDate: formatDate(expense.inputs[5].value)
            }, function (error) {
                setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
                $('#message').modal('open').value = "";
            });

            promise.then(function (response) {
                database.ref(expense.path + '/todos/' + promise.key).update({
                    id: promise.key
                });
                database.ref(expense.path + '/' + expense.inputs[1].value.toLowerCase() + '/' + promise.key).set({
                    vehicleName: expense.inputs[0].value,
                    expenseId: promise.key,
                    vehicleId: expense.vehicleId,
                    name: expense.inputs[1].value,
                    cost:  expense.inputs[2].value,
                    details: expense.inputs[3].value,
                    inDate: expense.inputs[4].value,
                    outDate: expense.inputs[5].value,
                    integerInDate: formatDate(expense.inputs[4].value),
                    integerOutDate: formatDate(expense.inputs[5].value)
                });
                database.ref(expense.path + '/date/' +  getMonth(expense.inputs[4].value).toLowerCase() + '/' + expense.inputs[1].value.toLowerCase() + '/' + promise.key).set({
                    vehicleName: expense.inputs[0].value,
                    expenseId: promise.key,
                    vehicleId: expense.vehicleId,
                    name: expense.inputs[1].value,
                    cost:  expense.inputs[2].value,
                    details: expense.inputs[3].value,
                    inDate: expense.inputs[4].value,
                    outDate: expense.inputs[5].value,
                    integerInDate: formatDate(expense.inputs[4].value),
                    integerOutDate: formatDate(expense.inputs[5].value)
                });

                database.ref(expense.path + '/pending/' + '/' + promise.key).set({
                    vehicleName: expense.inputs[0].value,
                    expenseId: promise.key,
                    name: expense.inputs[1].value,
                    vehicleId: expense.vehicleId,
                    cost: expense.inputs[2].value,
                    details: expense.inputs[3].value,
                    inDate: expense.inputs[4].value,
                    outDate: expense.inputs[5].value,
                    integerInDate: formatDate(expense.inputs[4].value),
                    integerOutDate: formatDate(expense.inputs[5].value)
                });

                if(expense.inputs[1].value.toLowerCase() == 'reparacion'){
                    database.ref('vehicles/todos/' + expense.vehicleId).update({
                        status: 'reparacion',
                        details: expense.inputs[3].value,
                        inDate: expense.inputs[4].value,
                        cost:  expense.inputs[2].value,
                    outDate: expense.inputs[5].value,
                    integerInDate: formatDate(expense.inputs[4].value),
                    integerOutDate: formatDate(expense.inputs[5].value)
                    }); 
                    database.ref('vehicles/disponible/' + expense.vehicleId).update({
                        status: 'reparacion',
                        details: expense.inputs[3].value
                    }); 
                    database.ref('vehicles/disponible/' + expense.vehicleId).set(null); 
                    var vehicle = database.ref('vehicles/todos/' + expense.vehicleId);
                    var repVehicle = database.ref('vehicles/reparacion/' + expense.vehicleId);
                    vehicle.on('value',function(snapshot){
                        repVehicle.set(snapshot.val());
                    },function (error){
                        console.log("error",error);
                    });
                };
                expense.inputs = InputManager.cleanValuesFromInputs(expense.inputs);
                setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
                $('#message').modal('open').value = "";
                actionButton('vehiclesExpenses','hide','vehiclesQuery');
                vehiclesQuery('vehicles', vehiclesFields, 'vehiclesResultsTable', 'selectedDriverVehicleStatus', 'disponible');
            }, function (error) {
                setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
                $('#message').modal('open').value = "";
            })
        }else{//without dates
            var promise = database.ref(expense.path + '/todos/').push({
                vehicleName: expense.inputs[0].value,
                vehicleId: expense.vehicleId,
                name: expense.inputs[1].value,
                cost:  expense.inputs[2].value,
                details: expense.inputs[3].value,
                inDate: expense.inputs[4].value,
                integerInDate: formatDate(expense.inputs[4].value)
            }, function (error) {
                setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
                $('#message').modal('open').value = "";
            });

            promise.then(function (response) {
                
                database.ref(expense.path + '/todos/' + promise.key).update({
                    id: promise.key
                });
                database.ref(expense.path + '/' + expense.inputs[1].value.toLowerCase() + '/' + promise.key).set({
                    vehicleName: expense.inputs[0].value,
                    expenseId: promise.key,
                    name: expense.inputs[1].value,
                    cost: expense.inputs[2].value,
                    vehicleId: expense.vehicleId,
                    details: expense.inputs[3].value,
                    inDate: expense.inputs[4].value,
                    integerInDate: formatDate(expense.inputs[4].value)
                });

                database.ref(expense.path + '/date/' + getMonth(expense.inputs[4].value).toLowerCase() + '/' + expense.inputs[1].value.toLowerCase() + '/' + promise.key).set({
                    vehicleName: expense.inputs[0].value,
                    expenseId: promise.key,
                    name: expense.inputs[1].value,
                    cost: expense.inputs[2].value,
                    vehicleId: expense.vehicleId,
                    details: expense.inputs[3].value,
                    inDate: expense.inputs[4].value,
                    integerInDate: formatDate(expense.inputs[4].value)
                });

                expense.inputs = InputManager.cleanValuesFromInputs(expense.inputs);
                setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
                $('#message').modal('open').value = "";
                actionButton('vehiclesExpenses','hide','vehiclesQuery');
                vehiclesQuery('vehicles', vehiclesFields, 'vehiclesResultsTable', 'selectedDriverVehicleStatus', 'disponible');
            }, function (error) {
                setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
                $('#message').modal('open').value = "";
            })
        }
    };
    static repairingDone(vehicleId){
        var promise = database.ref('vehicles/todos/' + vehicleId).update({
            status: 'disponible'
        });
        var updatedVehicle = database.ref('vehicles/todos/' + vehicleId);
        var updateDisponible = database.ref('vehicles/disponible/' + vehicleId);

        updatedVehicle.on('value', function(snapshot){
            updateDisponible.set(snapshot.val());
            database.ref('expenses/reparaciones terminadas/' + vehicleId + '/' + setCurrentDate()).set(
                snapshot.val()
            );
        },function(error){
            console.log("can't repairing done",error);
        });

        

        promise.then(function (response) {
            setModal('Registro Exitoso', 'El registro de la reparación se llevó a cabo correctamente.');
            $('#message').modal('open').value = "";
            actionButton('vehiclesExpenses','hide','vehiclesQuery');
            vehiclesQuery('vehicles', vehiclesFields, 'vehiclesResultsTable', 'selectedDriverVehicleStatus', 'disponible');
        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        })

        database.ref('vehicles/reparacion/' + vehicleId).set(null);
    };
};