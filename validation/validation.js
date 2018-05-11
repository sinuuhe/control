$(function(){
    $.validator.addMethod('selectedCombo',function(element){
        if(element.innerText != "SELECCIONAR") return true;
    },"Debe elegir una opción");
    jQuery.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || value == value.match(/^[a-zA-Z]+$/);
      }, "Solo se aceptan letras");
    $.validator.addMethod('optionalCombo',function(element){
        if(element.innerText != "SELECCIONAR" && element.className == "input-field col s12") return true;
    },"Debe elegir una opción");
    $('#newActiveForm').validate({
        errorElement:"span",
        errorClass:"red-text",
        rules:{
            name:{
                required: true,
                lettersonly: true
            },
            registerDate:{
                required: true
            },
            serialNumber:{
                required: true
            },
            activeQuantity:{
                required: true,
                digits: true
            },
            selectedActiveCategory:{
                selectedCombo:true
            },
            brand:{
                required: true
            },
            model:{
                required: true
            },
            selectedBuilding:{
                selectedCombo: true
            },
            selectedRoom:{
                selectedCombo: true
            },
            otherBuildingInputField:{
                optionalCombo:true
            },
            selectedEmployee:{
                selectedCombo: true
            }
        },
        messages:{
            name:{
                required:'Este campo es requerido',
                lettersonly:"Se aceptan únicamente LETRAS"
            },
            registerDate:{
                required:'Este campo es requerido'
            },
            serialNumber:{
                required:'Este campo es requerido'
            },
            activeQuantity:{
                required:'Este campo es requerido',
                digits: 'Solo se aceptan números'
            },
            selectedActiveCategory:{
                selectedCombo:'Debe elegir una opción'
            },
            brand:{
                required:'Este campo es requerido'
            },
            model:{
                required:'Este campo es requerido'
            },
            selectedBuilding:{
                selectedCombo: "Debe elegir una opción"
            },
            selectedRoom:{
                selectedCombo: "Debe elegir una opción"
            },
            otherBuildingInputField:{
                optionalCombo:"Debe elegir una opción"
            },
            selectedEmployee:{
                selectedCombo: "Debe elegir una opción"
            }
        }
    });
})




