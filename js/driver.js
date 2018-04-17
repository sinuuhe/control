class Driver {
    constructor() {
        this.path = "drivers";
        this.inputs = [
            {
                value: "",
                inputName: 'driverName',
                type: 'input'
            }
            ,
            {
                value: "",
                inputName: 'driverLastname',
                type: 'input'
            },
            {
                value: "",
                inputName: 'driverPhone',
                type: 'input'
            },
            {
                value: "",
                inputName: 'selectedDriverDepartment',
                type: 'select'
            },
            {
                value: "",
                inputName: 'driverStreet',
                type: 'input'
            },
            {
                value: "",
                inputName: 'driverNumber',
                type: 'input'
            },
            {
                value: "",
                inputName: 'driverSettlement',
                type: 'input'
            },
            {
                value: "",
                inputName: 'driverState',
                type: 'input'
            },
            {
                value: "",
                inputName: 'driverLicenseExpirationDate',
                type: 'input'
            },
            {
                value: "",
                inputName: 'driverCity',
                type: 'input'
            },
        ];
    };

    register(driver){
        driver.inputs = InputManager.fillValuesFromInputs(driver.inputs); 
        var promise = database.ref(driver.path + '/').push({
            name: driver.inputs[0].value,
            lastname: driver.inputs[1].value,
            phone: driver.inputs[2].value,
            department: driver.inputs[3].value,
            street: driver.inputs[4].value,
            number: driver.inputs[5].value,
            settlement: driver.inputs[6].value,
            state: driver.inputs[7].value,
            licenseExpire: driver.inputs[8].value,
            integerLicenseExpire: formatDate(driver.inputs[8].value),
            city: driver.inputs[9].value,
            status: 'Activo'
        });
    
        promise.then(function (response) {
            InputManager.cleanValuesFromInputs(driver.inputs);
            database.ref(driver.path + '/' + promise.key).update({
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








