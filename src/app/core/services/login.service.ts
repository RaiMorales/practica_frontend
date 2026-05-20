import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import to from "./utils.service";
import ConstUrls from 'src/app/shared/contants/const-urls';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  paramNickUsuario: string = ConstUrls.NICK_USUARIO_PARAM;
  paramContrasena: string = ConstUrls.PASS_USUARIO_PARAM;
  apiUrl: string = ConstUrls.API_URL;

  constructor(private http: HttpClient) {}

  async iniciarSesion(nickUsuario: string, contrasena: string) {
    let params = new HttpParams()
      .set(this.paramNickUsuario, nickUsuario)
      .set(this.paramContrasena, contrasena);
    return await to(
        this.http
            .get<Boolean>(`${this.apiUrl}/login`,
                {
                  params: params
                }
            )
            .toPromise()
    )
  }

}
