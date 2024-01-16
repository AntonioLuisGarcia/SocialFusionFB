import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-delete-account',
  templateUrl: './confirm-delete-account.component.html',
  styleUrls: ['./confirm-delete-account.component.scss'],
})
export class ConfirmDeleteAccountComponent  implements OnInit {

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  
  constructor(
    private modalController: ModalController
  ) { }
  
  confirmDelete() {
    this.confirm.emit();
    this.modalController.dismiss({ confirm: true });
  }

  cancelDelete() {
    this.cancel.emit();
    this.modalController.dismiss({ confirm: false });
  }

  ngOnInit() {}

}
