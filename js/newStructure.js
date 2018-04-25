var properties = {
    id: "activesMainMenu",
    classes:"container",
    htmlElement: "h1",
    value:" ",
    events:" ",
    type:" ",
    innerElements : [
        
            
                {
                    htmlElement: "h1",
                    classes: "center-align",
                    value: "Menú Activos",
                    events:" ",
                    innerElements :"",
                    id:" ",
                    type:" "
                },
                {
                    classes: "row",
                    value:" ",
                    events:" ",
                    htmlElement:"div",
                    id:" ",
                    type:" ",
                    innerElements : [
                        {
                            htmlElement: "a",
                            classes: "col s4 offset-s1 waves-effect waves-light btn-large  red darken-4",
                            value: "Nuevo Resguardo",
                            type:" ",
                            id:" ",
                            innerElements:" ",
                            events:
                                {
                                    name: "onclick",
                                    method: "actionButton('activesMainMenu','hide','newActive');"
                                }
                        },
                        {
                            htmlElement: "a",
                            classes: "col s4 offset-s1 waves-effect waves-light btn-large red darken-4",
                            value: "Nuevo Trabajador",
                            type:" ",
                            id:" ",
                            innerElements:" ",
                            events:
                                {
                                    name: "onclick",
                                    method: "actionButton('activesMainMenu','hide','newEmploye');"
                                }
                        }
                    ]
                },
                {
                    htmlElement:"div",
                    value:" ",
                    events:" ",
                    id:" ",
                    classes: "row",
                    type:" ",
                    innerElements :
                        [
                            {
                                htmlElement: "a",
                                classes: "col s5 offset-s3 waves-effect waves-light btn-large red darken-4",
                                value: "Consultas",
                                type:" ",
                                id:" ",
                                innerElements:" ",
                                events:
                                    {
                                        name: "onclick",
                                        method: "actionButton('activesMainMenu','hide','query');"
                                    }
                            }
                        ]
                }
        
    ]
};