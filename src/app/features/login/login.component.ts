import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ FormsModule]
})
export class LoginComponent {

  loginService: LoginService;
  nickUsuario: string = '';
  contrasena: string = '';
  errorLogin: boolean = false;
  
  constructor(private router: Router, loginService: LoginService) {
    this.loginService = loginService;
  }

  async login () {
    console.log('Login button clicked');
    this.errorLogin = false;
    let result = await this.loginService.iniciarSesion(this.nickUsuario, this.contrasena);
    console.log('Resultado recibido del servicio: ',result)
    if (result === true) {
      console.log("Login satisfactorio, navegando a usuarios");
      localStorage.setItem('nickUsuario', this.nickUsuario);
      localStorage.setItem('contrasena', this.contrasena);
      this.router.navigate(['/usuarios']);
    } else {

      console.log("Error en el login.");
      this.errorLogin = true;
    }
  }
}
