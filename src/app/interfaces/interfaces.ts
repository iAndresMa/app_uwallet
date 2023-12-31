export interface menuPrincipal {
    icon        : string,
    name        : string,
    redirectTo  : string
}

export interface userUniminuto{
    id                 : string,
    Cn                 : string,
    DeparmetNumber     : string,
    Descripcion        : string,
    DisplayName        : string,
    EmployeType        : string,
    FirstName          : string,
    GidNumber          : string,
    HomeDirectory      : string,
    HomePhone          : string,
    L                  : string,
    LastName           : string,
    Mail               : string,
    Pager              : string,
    Sn                 : string,
    St                 : string,
    Street             : string,
    TelephoneNumber    : string,
    Title              : string,
    Uid                : string,
    UidNumber          : string,
    useraccountcontrol : string
}

export interface fotografia{
    resp            : string,
    base            : string,
    fotografia      : string
}

export interface bytte{
    qrData          :string,
    imagenBase64    : string
}

export interface cupoUsuario{
    documento       : string,
    lugar           : string,
    cupo            : string,
    dia             : string,
    jornada         : string,
    message         : string
}

export interface rectoria{
    rectorias       : rectoriaDatos
}

interface rectoriaDatos{
    id              : string,
    cod             : string,
    nombre          : string
}

export interface sede{
    sede            : sedeDatos
}

interface sedeDatos{
    id              : string,
    nombre          : string
}

export interface cupoBici{
    respuesta       : string
}

export interface solicitudBici{
    "1"             : datosSolicitud
}

interface datosSolicitud{
    "response_code" : string,
    "message"       : string
}

export interface eventos{
    "0"        : eventoGeneal
}

interface eventoGeneal{
    idplan:             string,
    idinstancia:        string,
    actividad:          string,
    rectoria:           string,
    sede:               string,
    modalidad:          string,
    estudiante:         string,
    famservidoradm:     string,
    estudianteconve:    string,
    padreestudiante:    string,
    egresado:           string,
    servidoradm:        string,
    profesor:           string,
    famprofesor:        string,
    hijoservidoradm:    string,
    fechaactividad:     string,
    invitado:           string,
    famestudiante:      string,
    visitante:          string,
    hijoestudiante:     string,
    hijoprofesor:       string
}

export interface evento{
    "0"        : eventoUnico
}

interface eventoUnico{
    idejeactividad      :  string,
    nmproyecto          : string,
    codproyecto         : string,
    nmactividad         : string,
    codactividad        : string,
    categoria           : string,
    fechaactividad      : string,
    horaactividad       : string,
    finicioins          : string,
    ffinins             : string,
    objetivo            : string,
    tpresovir           : string,
    inscripcionprev     : string,
    encuesta            : string,
    lugarcanal          : string,
    respoblacion        : string,
    respresupuesto      : string,
    estudiante          : string,
    metaes              : string,
    profesor            : string,
    metapr              : string,
    servidoradm         : string,
    metasa              : string,
    egresado            : string,
    metaeg              : string,
    estudianteconve     : string,
    metaec              : string,
    hijoestudiante      : string,
    metahes             : string,
    hijoprofesor        : string,
    metahpr             : string,
    hijoservidoradm     : string,
    metahsa             : string,
    famestudiante       : string,
    metafes             : string,
    famprofesor         : string,
    metafpr             : string,
    famservidoradm      : string,
    metafsa             : string,
    padreestudiante     : string,
    metapes             : string,
    invitado            : string,
    metainv             : string,
    visitante           : string,
    metavis             : string,
    totalpmeta          : string,
    idinstancia         : string
}

export interface eventosUwallet{
    "0"        : eventosUsuario
}

interface eventosUsuario{
    resp        : string,
    evento      : string,
    nombre      : string,
    idRecord    : string
}

export interface eventoInsrito{
    resp            : string,
    evento          : string,
    nombre          : string,
    idRecord        : string,
    qr              : string
}

export interface RespEvento{
    resp        : boolean,
    msg         : string
}

export interface validarAdmin{
    resp        : boolean,
    correo      : string,
    sistema     : string
}