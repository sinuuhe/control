class Trips {
    constructor() {
        this.vehicleId;
        this.path = "salidas";
        this.inputs = [
            {
                value: "",
                inputName: 'tripTitle',
                type: 'select'
            },
            {
                value: "",
                inputName: 'selectedVehicleTrip',
                type: 'select'
            },
            {
                value: "",
                inputName: 'tripDate',
                type: 'input'
            },
            {
                value: "",
                inputName: 'vehicleDriver',
                type: 'select'
            },
            {
                value: "",
                inputName: 'initialKm',
                type: 'select'
            },
            {
                value: "",
                inputName: 'selectedTripType',
                type: 'select'
            },
            {
                value: "",
                inputName: 'tripOutInfo',
                type: 'input'
            }
        ];
    };

    newTrip(trip) {
        trip.inputs = InputManager.fillValuesFromInputs(trip.inputs);

        var promise = database.ref(trip.path + '/todos/').push({
            vehicleId: trip.vehicleId,
            vehicle: trip.inputs[0].value,
            issue: trip.inputs[1].value,
            date: trip.inputs[2].value,
            driver: trip.inputs[3].value,
            initialKm: trip.inputs[4].value,
            tripType: trip.inputs[5].value,
            tripOutInfo: trip.inputs[6].value,
            status:"current",
            driverId: document.getElementById('driverTripId').innerText

        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        });

        promise.then(function(){
            database.ref(trip.path + '/todos/' + promise.key).update({
                id: promise.key
            })
            database.ref('vehicles/todos/' + trip.vehicleId).update({
                status: "EN USO"
            });
            trip.inputs = InputManager.cleanValuesFromInputs(trip.inputs);
            setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
            $('#message').modal('open').value = "";
            actionButton('newTrip', 'hide', 'vehiclesQuery');
            vehiclesQuery('vehicles', vehiclesFields, 'vehiclesResultsTable', 'selectedDriverVehicleStatus', 'disponible');
        })
    };

    static finisTrip(vehicleId, tripId, initialKm) {
        var inputs = [
            {
                value: "",
                inputName: 'finalKm',
                type: 'input'
            },
            {
                value: "",
                inputName: 'voucherNumber',
                type: 'input'
            },
            {
                value: "",
                inputName: 'litres',
                type: 'input'
            },
            {
                value: "",
                inputName: 'amount',
                type: 'input'
            },
            {
                value: "",
                inputName: 'tripInInfo',
                type: 'input'
            }
        ];

        inputs = InputManager.fillValuesFromInputs(inputs);
        console.log(initialKm)
        var promise = database.ref('salidas/todos/' + tripId).update({
            status: 'done',
            finalKm: inputs[0].value,
            voucherNumber: inputs[1].value,
            litres: inputs[2].value,
            amount: inputs[3].value,
            tripInInfo: inputs[4].value,
            totalKm:(Number(inputs[0].value) - Number(initialKm)),
            consumption: ((Number(inputs[0].value) - Number(initialKm)) / Number(inputs[2].value))
        });
        

        promise.then(function(){
            var _trip = database.ref('salidas/todos/' + tripId).on('value',function(snap){
                var tr = snap.val();
                database.ref('expenses/' + tripId).set({
                    cost: tr.amount,
                    details: 'Compra de Combustible',
                    expenseId: tripId,
                    inDate: tr.date,
                    integerInDate: formatDate(tr.date),
                    name: 'combustible',
                    vehicleId: vehicleId,
                    vehicleName: tr.vehicle
                })
    
                database.ref('vehicles/todos/' + vehicleId).update({
                    status: "DISPONIBLE",
                    km:(Number(inputs[0].value) + Number(initialKm))
                });
            })
            
            inputs = InputManager.cleanValuesFromInputs(inputs);
            setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
            $('#message').modal('open').value = "";
            actionButton('finishTrip', 'hide', 'vehiclesQuery');
            vehiclesQuery('vehicles', vehiclesFields, 'vehiclesResultsTable', 'selectedDriverVehicleStatus', 'disponible');
        })
    };
}