import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostItemComponent } from '../../shared/components/post-item/post-item.component';
import { PostListComponent } from '../../shared/components/post-list/post-list.component';
import { AddPostModalComponent } from '../../shared/components/add-post-modal/add-post-modal.component';
import { CommentItemComponent } from '../../shared/components/comment-item/comment-item.component';
import { CommentModalComponent } from '../../shared/components/comment-modal/comment-modal.component';


@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage,
    AddPostModalComponent,
  ],
  exports:[
    HomePage,
    AddPostModalComponent,
    CommentItemComponent,
    CommentModalComponent
  ]
})
export class HomePageModule {}
