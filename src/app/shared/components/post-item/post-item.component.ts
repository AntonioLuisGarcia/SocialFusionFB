/// Angular
import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

/// Interfaces
import { UserExtended } from 'src/app/core/interfaces/User';
import { PostExtended } from 'src/app/core/interfaces/post';
import { Comment } from 'src/app/core/interfaces/comment';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent  implements OnInit {

  //Esto lo uso para dejar el input vacio
  @ViewChild('commentInput') commentInput: ElementRef | undefined;

  @Input() showEditDeleteButtons: boolean = false; 

  @Input() post:PostExtended | null = null; //Uso el PostExtended para tener el id y poder usarlo en los eventos
  @Input() user:UserExtended | null = null; //Puedo usar solo user porque el username no se puede repetir, y con eso ya podria buscarlo

  @Output() onLikePost: EventEmitter<number> = new EventEmitter<number>();
  @Output() onCommentPost: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() onViewComments: EventEmitter<string> = new EventEmitter<string>();
  @Output() onEditPost: EventEmitter<PostExtended> = new EventEmitter<PostExtended>();
  @Output() onDeletePost: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {}

  //Si pulsan el like lanzamos el evento al padre
  like(event:any){
    if (this.post && this.post.id){
      this.onLikePost.emit(this.post.id)
    }  
    event.stopPropagation();
  }

  //Si quieren ver los comentarios, debemos abrir el modal
  viewComments(event:any) {
    if (this.post && this.post.uuid) { //Comprobamos que existen
      this.onViewComments.emit(this.post.uuid);
    }
    event.stopPropagation();
  }
  
  //Si comentamos lanzamos el evento al padre
  comment(event:any, comment:string){
    if(this.post && this.post.id){
      this.onCommentPost.emit({
        text: comment,
        postUuid: this.post.uuid,
        // Incluye cualquier otra propiedad necesaria
      });
      this.commentInput!.nativeElement.value = '';
    }
    event.stopPropagation();
  }

  editPost(event:any) {
    if(this.post && this.post.uuid){
      this.onEditPost.emit(this.post);
      console.log(this.post)
    }
    event.stopPropagation();
  }

  deletePost(event:any) {
    if(this.post && this.post.uuid){
      this.onDeletePost.emit(this.post.uuid);
    }
    event.stopPropagation();
  }

}
