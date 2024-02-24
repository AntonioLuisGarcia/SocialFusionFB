import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent  implements OnInit {

  @Input() user: any;
  @Output() onClickUser = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  // Cuando se hace click en un usuario, se emite el evento con el id del usuario hacia el padre
  userClicked() {
    this.onClickUser.emit(this.user.uuid);
  }
}
