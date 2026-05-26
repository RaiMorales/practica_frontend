import { Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { CommonModule} from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from 'src/app/core/services/user.service';
import { Genero } from 'src/app/core/models/genero.model';
import { PuestoDeTrabajo } from 'src/app/core/models/puestodetrabajo.model';
import { Direccion } from 'src/app/core/models/direccion.model';
import { Usuario } from 'src/app/core/models/user.model';

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.css'],
    standalone: true,
    imports: [ CommonModule, FormsModule ]
})

export class UserPopupComponent implements OnInit {
    
    @Output() cerrarPopUpOk = new EventEmitter<void>();
    @Output() cerrarPopUpCancel = new EventEmitter<void>();

    @Input() estadoPopup: String = 'CREAR';
    @Input() userId: number = 0;
    
    fechaHoraCreacion: string = '';
    generos: Genero[] = [];
    puestos: PuestoDeTrabajo[] = [];
    selectedDirPrincipalId: number = 0;
    selectedDirId: number = 0;
    direccionesBorradasIds: number[] = [];
    direccionesBorrar: Direccion[] = [];
    
    usuarioNuevo: Usuario = {} as Usuario;
    usuarioEditable: Usuario = {} as Usuario;
    
    usuarioActivo: Usuario = {} as Usuario; 
    idFilaEditable: number = 0;            
    mensajeDeError: string = '';

    constructor(private userService: UserService) {}

    async ngOnInit() {

        const nickUsuario = localStorage.getItem('nickUsuario') || '';
        const contrasena = localStorage.getItem('contrasena') || '';
        if (this.estadoPopup === 'BORRAR') {

            this.direccionesBorrar = await this.userService.obtenerDireccionesPorUsuarioId(nickUsuario, contrasena, this.userId);
        } else {

            this.generos = await this.userService.obtenerGeneros(nickUsuario, contrasena);
            this.puestos = await this.userService.obtenerPuestosDeTrabajo(nickUsuario, contrasena);
            if (this.estadoPopup === 'CREAR') {

                this.usuarioNuevo.fechaHoraCreacion = new Date();
                this.usuarioNuevo.esAdmin = false;
                this.usuarioNuevo.direcciones = [];
                this.usuarioNuevo.genero = { id: 1, nombre: '' };
                this.usuarioNuevo.puestoTrabajo = { id: 1, nombre: '' };
                this.usuarioActivo = this.usuarioNuevo;
            } else {

                this.usuarioEditable = await this.userService.obtenerUsuarioPorId(nickUsuario, contrasena, this.userId);
                this.usuarioEditable.direcciones = await this.userService.obtenerDireccionesPorUsuarioId(nickUsuario, contrasena, this.userId);
                const dirPrincipal = this.usuarioEditable.direcciones.find(g => g.direccionPrincipal === true);
                if (dirPrincipal) {

                    this.selectedDirPrincipalId = dirPrincipal.id;
                }
                this.usuarioActivo = this.usuarioEditable;
            }
        }
    }

    crearDireccion() {

        if (!this.usuarioActivo.direcciones) {

            this.usuarioActivo.direcciones = [];
        }
        const idTemporal = Date.now(); // ID único local temporal
        this.usuarioActivo.direcciones.push({

            id: idTemporal,
            nombreCalle: '',
            numeroCalle: undefined as any,
            usuario: this.usuarioActivo,
            direccionPrincipal: false
        });
        this.selectedDirId = idTemporal;
        this.idFilaEditable = idTemporal;
    }

    editarDireccion() {

        if (!this.selectedDirId) {

            alert("Por favor, seleccione una fila de la tabla para editarla.");
            return;
        }
        this.idFilaEditable = this.selectedDirId;
    }

    borrarDireccion() {

        if (!this.selectedDirId) {

            alert("Por favor, seleccione una dirección de la tabla para borrarla.");
            return;
        }
        if (this.selectedDirId < 1000000000000) { // Nos indica que es una direccion que ya existía en la base de datos

            this.direccionesBorradasIds.push(this.selectedDirId);
        }
        this.usuarioActivo.direcciones = this.usuarioActivo.direcciones.filter(
            dir => dir.id !== this.selectedDirId
        );
        if (this.selectedDirPrincipalId === this.selectedDirId) {

            this.selectedDirPrincipalId = 0;
        }
        // Limpiamos estados
        this.selectedDirId = 0;
        this.idFilaEditable = 0;
    }

    async onSave() {

        const nickUsuario = localStorage.getItem('nickUsuario') || '';
        const contrasena = localStorage.getItem('contrasena') || '';
        if (!this.isFormularioValido()) {

            this.mensajeDeError = "Por favor, rellene todos los campos requeridos y no deje calles sin nombre.";
            return;
        }
        this.mensajeDeError = '';
        const genSel = this.generos.find(g => g.id === Number(this.usuarioActivo.genero?.id || this.usuarioActivo.genero));
        if (genSel && this.usuarioActivo.genero) this.usuarioActivo.genero = { id: genSel.id, nombre: genSel.nombre };
        const ptoSel = this.puestos.find(p => p.id === Number(this.usuarioActivo.puestoTrabajo?.id || this.usuarioActivo.puestoTrabajo));
        if (ptoSel && this.usuarioActivo.puestoTrabajo) this.usuarioActivo.puestoTrabajo = { id: ptoSel.id, nombre: ptoSel.nombre };
        if (this.usuarioActivo.genero) this.usuarioActivo.genero.id = Number(this.usuarioActivo.genero.id);
        if (this.usuarioActivo.puestoTrabajo) this.usuarioActivo.puestoTrabajo.id = Number(this.usuarioActivo.puestoTrabajo.id);
        const { direcciones, ...usuarioBack } = this.usuarioActivo;
        let usuarioGuardadoBackend: any;
        if (this.estadoPopup === 'CREAR') {

            const ahora = new Date();
            usuarioBack.fechaHoraCreacion = new Date(ahora.getTime() - (ahora.getTimezoneOffset() * 60 * 1000));
            usuarioGuardadoBackend = await this.userService.guardarUsuario(nickUsuario, contrasena, usuarioBack);
            if (this.usuarioActivo.direcciones) {

                const direccionesPayload = this.usuarioActivo.direcciones.map(dir => {
                    return {
                    
                        nombreCalle: dir.nombreCalle,
                        numeroCalle: dir.numeroCalle ? Number(dir.numeroCalle) : null,
                        direccionPrincipal: dir.id === Number(this.selectedDirPrincipalId),
                        usuario: usuarioGuardadoBackend
                    };
                });

                try {

                    const promesas = direccionesPayload.map(dir => 
                        this.userService.crearDireccion(nickUsuario, contrasena, dir)
                    );
                    await Promise.all(promesas);
                } catch (error) {

                    console.error("Error guardando direcciones: ", error);
                }
            }
        } else {

            console.log("Actualizando el usuario con id: ", this.userId);
            usuarioGuardadoBackend = await this.userService.actualizarUsuario(nickUsuario, contrasena, this.userId, usuarioBack);
            if (this.direccionesBorradasIds.length > 0) {

                try {

                    const promesasBorrado = this.direccionesBorradasIds.map(idDir => 
                        this.userService.eliminarDireccion(nickUsuario, contrasena, idDir)
                    );
                    await Promise.all(promesasBorrado);
                    console.log("¡Todas las direcciones marcadas para borrado se han eliminado correctamente!");
                } catch (error) {

                    console.error("Error eliminando direcciones: ", error);
                }
            }
            if (this.usuarioActivo.direcciones) {

                let direccionesNuevas = this.usuarioActivo.direcciones.filter(dir => String(dir.id).length > 10);
                const direccionesNuevasPayload = direccionesNuevas.map(dir => {
                    
                    return {

                        nombreCalle: dir.nombreCalle,
                        numeroCalle: dir.numeroCalle ? Number(dir.numeroCalle) : null,
                        direccionPrincipal: dir.id === Number(this.selectedDirPrincipalId),
                        usuario: usuarioGuardadoBackend
                    };
                });
                try {

                    const promesasNuevas = direccionesNuevasPayload.map(dir => 
                        this.userService.crearDireccion(nickUsuario, contrasena, dir)
                    );
                    await Promise.all(promesasNuevas);
                } catch (error) {

                    console.error("Error guardando direcciones nuevas: ", error);
                }
                let direccionesExistentes = this.usuarioActivo.direcciones.filter(dir => String(dir.id).length <= 10);
                const direccionesExistentesPayload = direccionesExistentes.map(dir => {

                    return {

                        id: dir.id,
                        nombreCalle: dir.nombreCalle,
                        numeroCalle: dir.numeroCalle ? Number(dir.numeroCalle) : null,
                        direccionPrincipal: dir.id === Number(this.selectedDirPrincipalId),
                        usuario: usuarioGuardadoBackend
                    };
                });
                try {

                    const promesasExistentes = direccionesExistentesPayload.map(dir => 
                        this.userService.actualizarDireccion(nickUsuario, contrasena, dir.id, dir)
                    );
                    await Promise.all(promesasExistentes);
                } catch (error) {

                    console.error("Error guardando direcciones existentes: ", error);
                }
            }
        }
        this.cerrarPopUpOk.emit();
    }

    onCancel() {

        this.cerrarPopUpCancel.emit();
    }
    
    isFormularioValido(): boolean {

        const user = this.usuarioActivo; // Validamos dinámicamente el activo
        if (!user.nickUsuario || user.nickUsuario.trim() === '') return false;
        if (!user.contrasena || user.contrasena.trim() === '') return false;
        if (!user.nombre || user.nombre.trim() === '') return false;
        if (!user.primerApellido || user.primerApellido.trim() === '') return false;
        if (!user.fechaNacimiento) return false;
        if (user.direcciones) {

            for (const dir of user.direcciones) {

                if (!dir.nombreCalle || dir.nombreCalle.trim() === '' || dir.nombreCalle === '(calle vacía)') return false;
            }
        }
        return true;
    }

    async onDelete () {

        const nickUsuario = localStorage.getItem('nickUsuario') || '';
        const contrasena = localStorage.getItem('contrasena') || '';
        console.log("Id del usuario a borrar: ", this.userId);
        console.log("Direcciones a borrar: ", this.direccionesBorrar);
        if(this.direccionesBorrar.length > 0) {
            try {

                const promesasExistentes = this.direccionesBorrar.map(dir => 
                    
                    this.userService.eliminarDireccion(nickUsuario, contrasena, dir.id)
                );
                await Promise.all(promesasExistentes);
            } catch (error) {

                console.error("Error guardando direcciones existentes: ", error);
            }
        }
        await this.userService.eliminarUsuario(nickUsuario, contrasena, this.userId);
        this.userId = 0;
        this.cerrarPopUpOk.emit();
    }
}


