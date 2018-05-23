$(function(){
    jQuery.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/);
      }, "Solo se aceptan letras");
      jQuery.validator.addMethod("onlyNumbers", function(value, element) {
        return this.optional(element) || value == value.match(/^[0-9]+$/);
      }, "Solo se aceptan números");
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
                onlyNumbers:true
            },
            selectedActiveCategory:{
                required: true
            },
            selectedBuilding:{
                required: true
            },
            selectedRoom:{
                required: true
            },
            otherBuildingInputField:{
                required:true
            },
            selectedEmployee:{
                required: true
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
                required:'Este campo es requerido'
            },
            selectedActiveCategory:{
                required: 'Este campo es requerido'
            },
            selectedBuilding:{
                required: 'Este campo es requerido'
            },
            selectedRoom:{
                required: 'Este campo es requerido'
            },
            otherBuildingInputField:{
                required: 'Este campo es requerido'
            },
            selectedEmployee:{
                required: 'Este campo es requerido'
            }
        }
    });
})




