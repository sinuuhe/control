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
                if(document.getElementById(input.inputName).value != undefined)
                input.value = document.getElementById(input.inputName).value;
                else
                input.value = "No proporcionado";
            }
            else if(input.type == 'select'){
                if(document.getElementById(input.inputName).innerText != undefined)
                input.value = document.getElementById(input.inputName).innerText;
                else
                input.value = "No proporcionado"
            }
        };

        return inputsArray;
    };
};