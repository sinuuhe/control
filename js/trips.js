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
                type: 'input'
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

        var promise = database.ref(trip.path + '/en curso/' + trip.vehicleId).set({
            vehicleId: trip.vehicleId,
            vehicle: trip.inputs[0].value,
            issue: trip.inputs[1].value,
            date: trip.inputs[2].value,
            driver: trip.inputs[3].value,
            initialKm: trip.inputs[4].value,
            tripType: trip.inputs[5].value,
            tripOutInfo: trip.inputs[6].value,
            id: trip.vehicleId
        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        });

        var prom = database.ref(trip.path + '/todos/' + trip.vehicleId).push({
            vehicleId: trip.vehicleId,
            vehicle: trip.inputs[0].value,
            issue: trip.inputs[1].value,
            date: trip.inputs[2].value,
            driver: trip.inputs[3].value,
            initialKm: trip.inputs[4].value,
            tripType: trip.inputs[5].value,
            tripOutInfo: trip.inputs[6].value,
            status: "en curso"
        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        });
        prom.then(function (response) {
            database.ref(trip.path + '/todos/' + trip.vehicleId + '/' + prom.key).update({
                id: prom.key
            });

            database.ref(trip.path + '/en curso/' + trip.vehicleId + '/').update({
                tripId: prom.key
            });

            database.ref('vehicles/todos/' + trip.vehicleId).update({
                status: "en uso"
            });
            database.ref('vehicles/disponible/' + trip.vehicleId).set(null);

            var usedVehicle = database.ref('vehicles/todos/' + trip.vehicleId);
            usedVehicle.on('value', function (snapshot) {
                database.ref('vehicles/en uso/' + trip.vehicleId).set(snapshot.val());
            }, {});

            trip.inputs = InputManager.cleanValuesFromInputs(trip.inputs);
            setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
            $('#message').modal('open').value = "";
            actionButton('newTrip', 'hide', 'vehiclesQuery');
            vehiclesQuery('vehicles', vehiclesFields, 'vehiclesResultsTable', 'selectedDriverVehicleStatus', 'disponible');
        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        })
    };

    static finisTrip(vehicleId, tripId) {
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
        database.ref('salidas/en curso/' + vehicleId).set(null);
        inputs = InputManager.fillValuesFromInputs(inputs);
        database.ref('salidas/todos/' + vehicleId + '/' + tripId).update({
            status: 'terminado',
            finalKm: inputs[0].value,
            voucherNumber: inputs[1].value,
            litres: inputs[2].value,
            amount: inputs[3].value,
            tripInInfo: inputs[4].value
        });
        var trip = database.ref('salidas/todos/' + vehicleId + '/' + tripId);
        var updatedTrip = database.ref('salidas/terminadas/' + vehicleId + '/' + tripId);

        trip.on('value', function (snapshot) {
            updatedTrip.set(snapshot.val());
            var _trip = snapshot.val();
            database.ref('expenses/date/' + getMonth(_trip.date).toLowerCase() + '/combustible/' + tripId).set({
                cost: _trip.amount,
                details: 'Compra de Combustible',
                expenseId: tripId,
                inDate: _trip.date,
                integerInDate: formatDate(_trip.date),
                name: 'combustible',
                vehicleId: vehicleId,
                vehicleName: _trip.vehicle
            })

        })
        database.ref('vehicles/todos/' + vehicleId).update({
            status: "disponible"
        });
        database.ref('vehicles/en uso/' + vehicleId).set(null);
        var vehicle = database.ref('vehicles/todos/' + vehicleId);
        var updatedVehicle = database.ref('vehicles/disponible/' + vehicleId);

        vehicle.on('value', function (snapshot) {
            updatedVehicle.set(snapshot.val());
            inputs = InputManager.cleanValuesFromInputs(inputs);
            setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
            $('#message').modal('open').value = "";
            actionButton('finishTrip', 'hide', 'vehiclesQuery');
            vehiclesQuery('vehicles', vehiclesFields, 'vehiclesResultsTable', 'selectedDriverVehicleStatus', 'disponible');
        });







    };
}