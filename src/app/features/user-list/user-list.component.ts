import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Router} from "@angular/router";
import { UserPopupComponent } from '../user-popup/user-popup.component';
import { UserService } from 'src/app/core/services/user.service';
import { Usuario } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [ CommonModule, UserPopupComponent ]
})
export class UserListComponent implements OnInit {
  @Output() cerrarPopUpOk = new EventEmitter<void>();
  @Output() cerrarPopUpCancel = new EventEmitter<void>();

  modoPopup: String = 'CLOSED';
  estadoPopup: String = 'CREAR';
  usuarios: Usuario[] = [];
  selectedUserId: number = 0;

  constructor(private router: Router, private userService: UserService) {

    this.userService = userService;
  }

   async ngOnInit() {

      this.usuarios = await this.userService.obtenerUsuarios();
      console.log("Usuarios feched: ",this.usuarios);
      this.selectedUserId = this.usuarios[0]?.id || 0;
  }

  onCerrarPopUpOk() {
    this.modoPopup = 'CLOSED';
  }

  onCerrarPopUpCancel() {
    this.modoPopup = 'CLOSED';
  }
  
  launchPopup() {
    
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

  // @TODO: Implementar propiedades, atributos, métodos... necesarios para el funcionamiento del listado de usuarios

}
