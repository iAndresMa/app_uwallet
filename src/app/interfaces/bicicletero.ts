export interface RespBicicletero {
  resp: boolean;
  msg: string;
}

export interface RectoriaBicicletero {
  idrectoria: string;
  nombrerectoria: string;
}

export interface SedeBicicletero {
  idsede: string;
  nombresede: string;
}

export interface AsignacionBicicletero {
  jornada: string;
  nombredia: string;
  nombresede: string;
  nombrelugar: string;
  codigolugar: string;
  estadoasignacion: string;
  detalleasignacion: string;
}

export interface RectoriasBicicletero extends RespBicicletero {
  rectorias: RectoriaBicicletero[];
}

export interface SedesBicicletero extends RespBicicletero {
  sedes: SedeBicicletero[];
}

export interface AsignacionesBicicletero extends RespBicicletero {
  asignaciones: AsignacionBicicletero[];
}

export interface SolicitudBicicletero extends RespBicicletero {
  idsolicitud: number;
}

export interface SolicitudBicicleteroBody {
  fn: 'solicitud';
  documento: string;
  correo: string;
  nombre: string;
  apellido?: string;
  cn?: string;
  rol: string;
  idsede: string;
}
