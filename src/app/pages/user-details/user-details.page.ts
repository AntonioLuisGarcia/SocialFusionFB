/// Angular
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

/// Services
import { AuthService } from 'src/app/core/services/auth.service';
import { LikeService } from 'src/app/core/services/api/strapi/like.service';
import { PostService } from 'src/app/core/services/api/strapi/post.service';
import { CommentService } from 'src/app/core/services/api/strapi/comment.service';

/// Components
import { CommentModalComponent } from 'src/app/shared/components/comment-modal/comment-modal.component';

/// Interfaces
import { Comment } from 'src/app/core/interfaces/comment';
import { PostFirebaseService } from 'src/app/core/services/api/firebase/post-firebase.service';
import { CommentFirebaseService } from 'src/app/core/services/api/firebase/comment-firebase.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  user: any;
  posts: any;

  constructor(
    private postService:PostFirebaseService,
    private authService:AuthService,
    private likeService: LikeService,
    private commentService: CommentFirebaseService,
    private modalController:ModalController,
  ) { }

  // Al iniciar la página, obtenemos el usuario de la página anterior y sus posts
  ngOnInit() {
    // Obtenemos el usuario de la página anterior, mediante el historial de navegación
    this.user = history.state.user;
    this.authService.me().subscribe(data => {
      this.postService.posts$.subscribe(posts => {
        this.posts = posts;
      });
      // Cogemos los post de ese usuario y los likes del usuario actual, y los ordenamos por fecha
      /*this.postService.getPostsByUserId(data.id, this.user.id).subscribe(posts => {
        this.posts = posts.sort((a, b) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      });*/
    });  
  }

  // En caso de dar like a algun post 
  onLikePost(postId: number) {
    this.authService.me().subscribe((data) => {
      this.likeService.onLike(postId, data.id).subscribe({
        next: (response) => {/*
          // Actualizar el estado del like en el servicio
          this.postService.updatePostLike(postId, response.like);
          
          // actualizamos los cambios
          this.postService.getPostsByUserId(data.id, this.user.id).subscribe(
            updatedPosts => {
              this.posts = updatedPosts;
            }
          );
        },
        error: (error) => {
          console.error('Error al cambiar el estado del like', error);
        */}
      })
    });
  }
  
  // Si se comenta un post
  onCommentPost(comment:Comment){
    this.authService.me().subscribe((data) =>{
      // Con el mensaje y el id del usuario, creamos el comentario, junto con el id del post
        comment.userId = data.id
        this.commentService.createComment(comment).subscribe()  
    })    
  }
  
  // Mostramos los comentarios de un post
  async onShowComments(postUuid: string) {
    // Obtenemos los comentarios del post por su id y los mostramos en un modal
    this.commentService.getCommentForPost(postUuid).subscribe(async (comments) => {
      const modal = await this.modalController.create({
        component: CommentModalComponent,
        componentProps: {
          'postUuid': postUuid,
          'comments': comments // Pasamos los comentarios como propiedad al modal
        }
      });
      await modal.present();
    });
  }
}
