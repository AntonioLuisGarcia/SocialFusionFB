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
import { LikeFirebaseService } from 'src/app/core/services/api/firebase/like-firebase.service';

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
    private likeService: LikeFirebaseService,
    private commentService: CommentFirebaseService,
    private modalController:ModalController,
  ) { }

  // Al iniciar la página, obtenemos el usuario de la página anterior y sus posts
  ngOnInit() {
    // Obtenemos el usuario de la página anterior, mediante el historial de navegación
    this.user = history.state.user;

    this.authService.me().subscribe(data => {      
      if (data.uuid) {
        this.postService.getPostsForUser(this.user.uuid, data.uuid).subscribe(userPosts => {
          this.posts = userPosts;
          console.log(userPosts);
        });
      }
    });
  }

  // En caso de dar like a algun post 
  onLikePost(postUuid: string) {
    this.authService.me().subscribe((data) => {
      this.likeService.onLike(postUuid, data.uuid).subscribe({
        next: (response) => {
          this.authService.me().subscribe(data => {      
            if (data.uuid) {
              this.postService.getPostsForUser(this.user.uuid, data.uuid).subscribe(userPosts => {
                this.posts = userPosts;
                console.log(userPosts);
              });
            }
          });
        }
      })
    });
  }
  
  // Si se comenta un post
  onCommentPost(comment:Comment){
    this.authService.me().subscribe((data) =>{
      // Con el mensaje y el uuid del usuario, creamos el comentario, junto con el uuid del post
        comment.user = data
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
