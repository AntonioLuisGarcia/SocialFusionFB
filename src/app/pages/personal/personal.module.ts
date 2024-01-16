import { NgModule } from '@angular/core';

import { PersonalPageRoutingModule } from './personal-routing.module';

import { PersonalPage } from './personal.page';

import { ConfirmDeleteAccountComponent } from './confirm-delete-account/confirm-delete-account.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    PersonalPageRoutingModule
  ],
  declarations: [
    PersonalPage,
    ConfirmDeleteAccountComponent,
    EditProfileComponent,
  ]
})
export class PersonalPageModule {}
