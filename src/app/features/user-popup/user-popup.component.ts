import { Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-user-popup',
    templateUrl: './user-popup.component.html',
    styleUrls: ['./user-popup.component.css'],
    standalone: true,
    imports: [ CommonModule ]
})
export class UserPopupComponent implements OnInit {

    @Output() cerrarPopUpOk = new EventEmitter<void>();
    @Output() cerrarPopUpCancel = new EventEmitter<void>();

   @Input() estadoPopup: String = 'CREAR';
   @Input() userId: number = 0;

    constructor() {

    }

    async ngOnInit() {
    }

    async onSave() {
        if (this.estadoPopup === 'CREAR') {

            console.log("Creando nuevo usuario...");
        } else if (this.estadoPopup === 'ACTUALIZAR'){

            console.log("Actualizando el usuario con id: ",this.userId)
        }
        this.cerrarPopUpOk.emit();
    }
    onCancel() {
        this.cerrarPopUpCancel.emit();

    }
}
