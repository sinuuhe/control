var properties = {
    id: "activesMainMenu",
    classes:"container",
    htmlElement: "h1",
    value:" ",
    events:" ",
    type:" ",
    permission:"NORMAL",
    innerElements : [
        
            
                {
                    htmlElement: "h1",
                    classes: "center-align",
                    value: "Menú Activos",
                    events:" ",
                    innerElements :"",
                    id:" ",
                    permission:"NORMAL",
                    type:" "
                },
                {
                    classes: "row",
                    value:" ",
                    events:" ",
                    htmlElement:"div",
                    id:" ",
                    type:" ",
                    permission:"NORMAL",
                    innerElements : [
                        {
                            htmlElement: "a",
                            classes: "col s4 offset-s1 waves-effect waves-light btn-large z-depth-5 red darken-4",
                            value: "Nuevo Resguardo",
                            type:" ",
                            id:"scale-demo",
                            innerElements:" ",
                            permission:"ADMINISTRADOR",
                            events:
                                {
                                    name: "onclick",
                                    method: "actionButton('activesMainMenu','hide','newActive');"
                                }
                        },
                        {
                            htmlElement: "a",
                            classes: "col s4 offset-s1 waves-effect waves-light btn-large z-depth-5 red darken-4",
                            value: "Nuevo Trabajador",
                            type:" ",
                            id:" ",
                            innerElements:" ",
                            permission:"ADMINISTRADOR",
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
                    permission:"NORMAL",
                    innerElements :
                        [
                            {
                                htmlElement: "a",
                                classes: "col s4 offset-s1 waves-effect waves-light  z-depth-5 btn-large red darken-4",
                                value: "Nuevo Resguardo Temporal",
                                type:" ",
                                id:" ",
                                permission:"NORMAL",
                                innerElements:" ",
                                events:
                                    {
                                        name: "onclick",
                                        method: "newTemporalKeeper('activesMainMenu','hide','newTemporalKeeper');"
                                    }
                            },
                            {
                                htmlElement: "a",
                                classes: "col s4 offset-s1 waves-effect waves-light  z-depth-5 btn-large red darken-4",
                                value: "Consultas activos",
                                type:" ",
                                id:" ",
                                permission:"NORMAL",
                                innerElements:" ",
                                events:
                                    {
                                        name: "onclick",
                                        method: "actionButton('activesMainMenu','hide','query');"
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
                    permission:"NORMAL",
                    innerElements :
                        [
                            {
                                htmlElement: "a",
                                classes: "col s5 offset-s3 waves-effect waves-light  z-depth-5 btn-large red darken-4",
                                value: "Consultar Resguardos Temporales",
                                type:" ",
                                id:" ",
                                permission:"NORMAL",
                                innerElements:" ",
                                events:
                                    {
                                        name: "onclick",
                                        method: "temporalKeeperQuery('activesMainMenu','hide','temporalKeeperQuery');"
                                    }
                            }
                        ]
                }
        
    ]
};