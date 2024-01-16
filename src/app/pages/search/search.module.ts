import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserItemComponent } from './user-item/user-item.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  imports: [
    SharedModule,
    SearchPageRoutingModule,
  ],
  declarations: [
    SearchPage,
    UserItemComponent,
    UserListComponent,
  ]
})
export class SearchPageModule {}
