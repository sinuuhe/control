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

    register(vehicle){
        vehicle.inputs = InputManager.fillValuesFromInputs(vehicle.inputs); 
        var promise = database.ref(vehicle.path + '/').push({
            brand: vehicle.inputs[0].value,
            model: vehicle.inputs[1].value,
            year: vehicle.inputs[2].value,
            engineType: vehicle.inputs[3].value,
            status: 'Activo'
        });
    
        promise.then(function (response) {
            vehicle.inputs = InputManager.cleanValuesFromInputs(vehicle.inputs);
            database.ref(vehicle.path + '/' + promise.key).update({
                id: promise.key
            });
            setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
            $('#message').modal('open').value = "";
        }, function (error) {
            setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
            $('#message').modal('open').value = "";
        })
    };
};