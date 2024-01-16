import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '../core/translate/translate';
import { FormatDatePipe } from './pipe/format-date.pipe';
import { ImageSelectableComponent } from './components/image-selectable/image-selectable.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { CommentItemComponent } from './components/comment-item/comment-item.component';
import { CommentModalComponent } from './components/comment-modal/comment-modal.component';
import { HeaderComponent } from './components/header/header.component';



@NgModule({
  declarations: [
    PostItemComponent,
    PostListComponent,
    ImageSelectableComponent,
    UserInfoComponent,
    FormatDatePipe,
    CommentItemComponent,
    CommentModalComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
  ],
  exports:[
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImageSelectableComponent,
    PostItemComponent,
    PostListComponent,
    UserInfoComponent,
    FormatDatePipe,
    CommentItemComponent,
    CommentModalComponent,
    HeaderComponent,
  ]
})
export class SharedModule { }
