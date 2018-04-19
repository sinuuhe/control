class InputManager{

    static cleanValuesFromInputs(inputsArray){
        for(var input of inputsArray){
            if(input.type == 'input')
                input.value = document.getElementById(input.inputName).value = "";
            else if(input.type == 'select')
                input.value = document.getElementById(input.inputName).innerText = "Seleccionar"
            else 
                document.getElementById(input.inputName).checked = false;
        };
        
        return inputsArray;
    };
    static fillValuesFromInputs(inputsArray){
        for(var input of inputsArray){
            if(input.type == 'input'){
                input.value = document.getElementById(input.inputName).value;}
            else if(input.type == 'select'){
                input.value = document.getElementById(input.inputName).innerText;}
        };

        return inputsArray;
    };
};