import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Router} from "@angular/router";
import { UserPopupComponent } from '../user-popup/user-popup.component';
import { UserService } from 'src/app/core/services/user.service';
import { Usuario } from 'src/app/core/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [ CommonModule, UserPopupComponent, FormsModule ]
})
export class UserListComponent implements OnInit {
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  modoPopup: string = 'CLOSED';
  estadoPopup: string = 'CREAR';
  usuarios: Usuario[] = [];
  selectedUserId: number = 0;
  direccionPrincipal: string = '-';

  constructor(private router: Router, private userService: UserService) {

    this.userService = userService;
  }

   async ngOnInit() {

    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';

    this.usuarios = await this.userService.obtenerUsuarios(nickUsuario, contrasena);
    console.log("Usuarios feched: ",this.usuarios);
    if(this.usuarios && this.usuarios.length > 0) {

      this.selectedUserId = this.usuarios[0].id;
    }
    await this.cargarDirecciones(nickUsuario, contrasena);
  }

  async onCerrarPopUpOk() {
    this.modoPopup = 'CLOSED';
    const nickUsuario = localStorage.getItem('nickUsuario') || '';
    const contrasena = localStorage.getItem('contrasena') || '';
    this.usuarios = await this.userService.obtenerUsuarios(nickUsuario,contrasena);
    if(this.usuarios && this.usuarios.length > 0) {

      this.selectedUserId = this.usuarios[0].id;
    }
    await this.cargarDirecciones(nickUsuario, contrasena);
  }

  onCerrarPopUpCancel() {
    this.modoPopup = 'CLOSED';
  }
  
  launchPopupBorrar() {
    
    this.estadoPopup = 'BORRAR';
    this.modoPopup = 'LAUNCH';
  }

  launchPopupCrear() {
    
    this.estadoPopup = 'CREAR';
    this.modoPopup = 'LAUNCH';
  }

  launchPopupActualizar() {
    
    this.estadoPopup = 'ACTUALIZAR';
    this.modoPopup = 'LAUNCH';
  }

  calcularEdad(fechaNacimiento: string): number {

    const hoy = new Date();
    const fechaNaci = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNaci.getFullYear();
    return edad;

  }

  async cargarDirecciones(nickUsuario: string, contrasena: string) {

    for (let usuario of this.usuarios) {

      const direcciones = await this.userService.obtenerDireccionesPorUsuarioId(nickUsuario, contrasena, usuario.id);
      usuario.direcciones = direcciones;
      console.log(usuario.direcciones);
    }
  }

  obtenerDireccionPrincipal(usuario: Usuario): string {
    
    if (!usuario || !usuario.direcciones) {
      
      return '-';
    }
    const dirPrincipal = usuario.direcciones.find(d => d.direccionPrincipal === true);
    return dirPrincipal ? dirPrincipal.nombreCalle + ', ' + dirPrincipal.numeroCalle: '-';
  } 

  calcularExtraAdress(usuario: Usuario): number {

    if (!usuario || !usuario.direcciones) {

      return 0;
    } else {

      let extraAdress = 0;
      for (let direccion of usuario.direcciones) {

        if(!direccion.direccionPrincipal) {

          extraAdress += 1;
        }
      }
      return extraAdress;
    }
  }

  logOut() {

    this.router.navigate(['/login']);
  }
}
