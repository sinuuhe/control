class Vehicle {
    constructor() {
        this.id;
        this.path = "vehicles";
        this.inputs = [
            {
                value: "",
                inputName: 'vehicleBrand',
                type: 'input'
            }
            ,
            {
                value: "",
                inputName: 'vehicleModel',
                type: 'input'
            },
            {
                value: "",
                inputName: 'vehicleYear',
                type: 'input'
            },
            {
                value: "",
                inputName: 'selectedVehicleEngine',
                type: 'select'
            },
            {
                value: "",
                inputName: 'vehicleKm',
                type: 'input'
            }
        ];
    };

    static delete(vehicle, tableId, filter, search) {

        var promise = database.ref(vehicle.path + '/todos/' + vehicle.id).update({
            status: 'BAJA'
        });
        promise.then(function (response) {
            setModal('Baja Exitosa', 'El vehículo se dio de baja correctamente.');
            $('#message').modal('open').value = "";
            vehiclesQuery(vehicle.path, vehiclesFields, tableId, filter, search)
        })
    }
    register(vehicle) {
        vehicle.inputs = InputManager.fillValuesFromInputs(vehicle.inputs);
        var promise = database.ref(vehicle.path + '/todos').push({
            brand: vehicle.inputs[0].value.toUpperCase(),
            model: vehicle.inputs[1].value.toUpperCase(),
            year: vehicle.inputs[2].value,
            engineType: vehicle.inputs[3].value.toUpperCase(),
            km:vehicle.inputs[4].value,
            status: 'DISPONIBLE'
        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        });


        promise.then(function (response) {
            database.ref(vehicle.path + '/todos/' + promise.key).update({
                id: promise.key
            });

            vehicle.inputs = InputManager.cleanValuesFromInputs(vehicle.inputs);
            setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
            $('#message').modal('open').value = "";
        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        })
    };
};