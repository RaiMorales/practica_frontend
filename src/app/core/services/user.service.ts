import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Usuario } from '../models/user.model';
import { Direccion } from '../models/direccion.model';
import { Genero } from '../models/genero.model';
import to from "./utils.service";
import ConstUrls from 'src/app/shared/contants/const-urls';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string = ConstUrls.API_URL;
  paramNickUsuario: string = ConstUrls.NICK_USUARIO_PARAM;
  paramContrasena: string = ConstUrls.PASS_USUARIO_PARAM;

  constructor(private http: HttpClient) {}

  async obtenerUsuarioPorId(nickUsuario: string, contrasena: string, id: number) {
    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(
        this.http
            .get<Usuario>(`${this.apiUrl}/usuario/${id}`,
              {
                params: params
              }
            )
            .toPromise()
    )
  }

  async obtenerUsuarios(nickUsuario: string, contrasena: string) {
    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(
        this.http
            .get<Usuario[]>(`${this.apiUrl}/usuario`,
              {
                params: params
              }
            )
            .toPromise()
    )
  }

  async obtenerDireccionesPorUsuarioId(nickUsuario: string, contrasena: string, id: number) {
    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(
      this.http
        .get<Direccion[]>(`${this.apiUrl}/usuario/${id}/direcciones`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async obtenerGeneros(nickUsuario: string, contrasena: string) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .get<Genero[]>(`${this.apiUrl}/genero`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async obtenerPuestosDeTrabajo(nickUsuario: string, contrasena: string) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .get<Genero[]>(`${this.apiUrl}/puesto-de-trabajo`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async obtenerDirecciones(nickUsuario: string, contrasena: string) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .get<Direccion[]>(`${this.apiUrl}/direcciones`,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async guardarUsuario(nickUsuario: string, contrasena: string, usuario: object) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .post<Usuario>(`${this.apiUrl}/usuario`,
          usuario,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async crearDireccion(nickUsuario: string, contrasena: string, direccion: object) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .post<Direccion>(`${this.apiUrl}/direccion`,
          direccion,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async actualizarUsuario(nickUsuario: string, contrasena: string, id: number, usuario: object) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .put<Usuario>(`${this.apiUrl}/usuario/${id}`,
          usuario,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async actualizarDireccion(nickUsuario: string, contrasena: string, id: number, direccion: object) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .put<Direccion>(`${this.apiUrl}/direccion/${id}`,
          direccion,
          {
            params: params
          }
        )
        .toPromise()
    )
  }

  async eliminarDireccion(nickUsuario: string, contrasena: string, id: number) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .delete(`${this.apiUrl}/direccion/${id}`,
          {
            params: params
          }
        )
        .toPromise()
      )
  }

  async eliminarUsuario(nickUsuario: string, contrasena: string, id: number) {

    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(

      this.http
        .delete(`${this.apiUrl}/usuario/${id}`,
          {
            params: params
          }
        )
        .toPromise()
      )
  }

}
