class InputManager{

    static cleanValuesFromInputs(inputsArray){
        for(var input of inputsArray){
            if(input.type == 'input')
                input.value = document.getElementById(input.inputName).value = "";
            if(input.type == 'select')
                input.value = document.getElementById(input.inputName).innerText = "Seleccionar"
        };
        
        return inputsArray;
    };
    static fillValuesFromInputs(inputsArray){
        for(var input of inputsArray){
            if(input.type == 'input'){
                input.value = document.getElementById(input.inputName).value;}
            else{
                input.value = document.getElementById(input.inputName).innerText;}
        };

        return inputsArray;
    };
};