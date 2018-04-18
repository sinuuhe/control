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
                inputName:'expenseDateCheck', 
                type:'checkbox'
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
        if(expense.inputs[6].value != ""){
            console.log('on te input ' + expense.inputs[6])
            var promise = database.ref(expense.path + '/todos').push({
                expense: expense.inputs[0].value,
                expenseId: expense.id,
                name: expense.inputs[1].value,
                cost: expense.inputs[2].value,
                details: expense.inputs[3].value,
                inDate: expense.inputs[5].value,
                outDate: expense.inputs[6].value,
                integerInDate: formatDate(expense.inputs[5].value),
                integerOutDate: formatDate(expense.inputs[6].value)
            }, function (error) {
                setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
                $('#message').modal('open').value = "";
            });

            promise.then(function (response) {
                database.ref(expense.path + '/todos/' + promise.key).update({
                    id: promise.key
                });
                database.ref(expense.path + '/' + expense.inputs[1] + '/' + promise.key).set({
                    expense: expense.inputs[0].value,
                    expenseId: promise.key,
                    name: expense.inputs[1].value,
                    cost: expense.inputs[2].value,
                    details: expense.inputs[3].value,
                    inDate: expense.inputs[5].value,
                    outDate: expense.inputs[6].value,
                    integerInDate: formatDate(expense.inputs[5].value),
                    integerOutDate: formatDate(expense.inputs[6].value)
                });

                database.ref(expense.path + '/pending/' + '/' + formatDate(expense.inputs[6].value) + '/' + promise.key).set({
                    expense: expense.inputs[0].value,
                    expenseId: promise.key,
                    name: expense.inputs[1].value,
                    cost: expense.inputs[2].value,
                    details: expense.inputs[3].value,
                    inDate: expense.inputs[5].value,
                    outDate: expense.inputs[6].value,
                    integerInDate: formatDate(expense.inputs[5].value),
                    integerOutDate: formatDate(expense.inputs[6].value)
                });
                expense.inputs = InputManager.cleanValuesFromInputs(expense.inputs);
                setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
                $('#message').modal('open').value = "";
            }, function (error) {
                setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
                $('#message').modal('open').value = "";
            })
        }else{//without dates
            console.log('before')
            var promise = database.ref(expense.path + '/todos/').push({
                expense: expense.inputs[0].value,
                vehicleId: expense.vehicleId,
                name: expense.inputs[1].value,
                cost: expense.inputs[2].value,
                details: expense.inputs[3].value,
                inDate: expense.inputs[5].value,
                integerInDate: formatDate(expense.inputs[5].value)
            }, function (error) {
                setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
                $('#message').modal('open').value = "";
            });

            promise.then(function (response) {
                
                database.ref(expense.path + '/todos/' + promise.key).update({
                    id: promise.key
                });
                database.ref(expense.path + '/' + expense.inputs[1].value + '/' + promise.key).set({
                    expense: expense.inputs[0].value,
                    expenseId: promise.key,
                    name: expense.inputs[1].value,
                    cost: expense.inputs[2].value,
                    details: expense.inputs[3].value,
                    inDate: expense.inputs[5].value,
                    integerInDate: formatDate(expense.inputs[5].value)
                });
                expense.inputs = InputManager.cleanValuesFromInputs(expense.inputs);
                setModal('Registro Exitoso', 'El registro se llevó a cabo correctamente.');
                $('#message').modal('open').value = "";
            }, function (error) {
                setModal('Error al registrar', 'No se pudo llevar a cabo el registro. Por favor inténtelo de nuevo.');
                $('#message').modal('open').value = "";
            })
        }

        

    
        
    };
};