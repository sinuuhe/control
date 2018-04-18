class Vehicle {
    constructor(){
        this.path = "vehicles";
        this.inputs = [
            {
             value:"", 
             inputName:'vehicleBrand',
             type:'input'
            }
         ,
            {
             value:"", 
             inputName:'vehicleModel',
             type:'input'
            },
            {
             value:"", 
             inputName:'vehicleYear',
             type:'input'
            },
            {
             value:"", 
             inputName:'selectedVehicleEngine', 
             type:'select'
            }
     ];
    };

    delete(vehicle){
        var promise = database.ref(vehicle.path + '/baja/' + vehicle);
        promise.then(function(response){
            database.ref(vehicle.path + '/todos/' + vehicle.id).update({
                status: 'baja'
            });
            database.ref(vehicle.path + '/disponible/' + vehicle.id).set(null);
            setModal('Baja Exitosa', 'El vehículo se dio de baja correctamente.');
            $('#message').modal('open').value = "";
        })
    }
    register(vehicle){
        vehicle.inputs = InputManager.fillValuesFromInputs(vehicle.inputs); 
        var promise = database.ref(vehicle.path + '/todos').push({
            brand: vehicle.inputs[0].value,
            model: vehicle.inputs[1].value,
            year: vehicle.inputs[2].value,
            engineType: vehicle.inputs[3].value,
            status: 'Disponible'
        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        });

    
        promise.then(function (response) {
            database.ref(vehicle.path + '/todos/' + promise.key).update({
                id: promise.key
            });
            database.ref(vehicle.path + '/disponible/' + promise.key).set({
                id: promise.key,
                brand: vehicle.inputs[0].value,
                model: vehicle.inputs[1].value,
                year: vehicle.inputs[2].value,
                engineType: vehicle.inputs[3].value,
                status: 'Disponible'
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