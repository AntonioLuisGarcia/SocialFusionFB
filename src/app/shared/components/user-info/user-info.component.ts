/// Angular
import { Component, Input, OnInit } from '@angular/core';

/// Interfaces
import { UserBasicInfo } from 'src/app/core/interfaces/User';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent  implements OnInit {

  @Input() user: any | undefined;

  constructor() { }

  ngOnInit() {
    console.log(this.user)
  }

}
