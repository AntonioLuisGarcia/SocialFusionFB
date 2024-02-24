import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/core/interfaces/User';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {
  
  @Input() users: User[] | undefined;
  @Output() onClickUser = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  // Cuando se hace click en un usuario, se emite el evento con el id del usuario hacia el padre
  userClicked(userUuid: string) {
    this.onClickUser.emit(userUuid);
  }
}
