import {Genero} from "./genero.model";
import {PuestoDeTrabajo} from "./puestodetrabajo.model";
import {Direccion} from "./direccion.model";

export interface Usuario {
  id: number;
  nickUsuario: string;
  nombre: string;
  contrasena: string;
  fechaHoraCreacion: Date;
  genero: Genero;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: Date;
  horaDesayuno: string;
  puestoTrabajo: PuestoDeTrabajo;
  esAdmin: boolean;
  direcciones: Direccion[];
}

export const usuarioInicial: Usuario = {
  id: null,
  nickUsuario: null,
  nombre: null,
  contrasena: null,
  fechaHoraCreacion: new Date(),
  genero: {
    id: null,
    nombre: null
  },
  primerApellido: null,
  segundoApellido: null,
  fechaNacimiento: null,
  horaDesayuno: null,
  puestoTrabajo: {
    id: null,
    nombre: null
  },
  esAdmin: false,
  direcciones: null
};
