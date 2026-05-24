import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Usuario } from '../models/user.model';
import { Direccion } from '../models/direccion.model';
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

  async obtenerUsuarioPorId(id: number) {
    return await to(
        this.http
            .get<Usuario>('/assets/mocks/user.json')
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

}
