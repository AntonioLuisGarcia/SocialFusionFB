import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserBasicInfo } from 'src/app/core/interfaces/User';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent  implements OnInit {

  @Input() user: UserBasicInfo | any;
  profileForm: FormGroup | any; // lo hago asi porque si lo inicializo en el constructor el user no se habrá cargado

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    // Mueve la inicialización del formulario aquí
    this.profileForm = this.formBuilder.group({
      username: [this.user?.username, Validators.required],
      name: [this.user?.name, Validators.required],
      img: [this.user?.img]
      // Agrega aquí otros campos que necesites
    });
  }

  // Método para cerrar el modal y enviar los datos actualizados
  saveProfile() {
    if (this.profileForm.valid) {
      // Emite el evento con los datos actualizados
      this.modalController.dismiss({ user: this.profileForm.value, status: 'ok' });
    }
  }

  // Método para cerrar el modal sin hacer cambios
  dismissModal() {
    this.modalController.dismiss();
  }

}
