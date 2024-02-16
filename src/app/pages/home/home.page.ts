/// Angular
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

/// Services
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/core/services/api/strapi/post.service';
import { LikeService } from 'src/app/core/services/api/strapi/like.service';
import { CommentService } from 'src/app/core/services/api/strapi/comment.service';
import { MediaService } from 'src/app/core/services/media.service';

/// Interfaces
import { PostExtended } from 'src/app/core/interfaces/post';
import { UserExtended } from 'src/app/core/interfaces/User';
import { Comment } from 'src/app/core/interfaces/comment';

/// Modals
import { AddPostModalComponent } from '../../shared/components/add-post-modal/add-post-modal.component';
import { CommentModalComponent } from '../../shared/components/comment-modal/comment-modal.component';

/// Helpers
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { PostFirebaseService } from 'src/app/core/services/api/firebase/post-firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(
    private postService: PostFirebaseService,
  ){

  }

  posts: PostExtended[] | any;
  post: PostExtended | any;

  // Al iniciar la página, obtenemos el usuario actual y sus posts
  async ngOnInit() {
      // Ahora que tenemos `this.me`, podemos obtener los posts y ordenarlos por fecha
        this.posts = await this.postService.getAllPost();
        console.log(this.post)
        //this.postService.fetchAndEmitPosts(data.id);
  }

  /*
  constructor(
    private auth:AuthService,
    private postService:PostService,
    private likeService:LikeService,
    private commentService:CommentService,
    private mediaService: MediaService,
    public modalController: ModalController,
    ) {}
  
  posts: PostExtended[] | any;
  me: UserExtended | any;
  
  
  // Al iniciar la página, obtenemos el usuario actual y sus posts
  ngOnInit() {
    this.auth.me().subscribe((data) => {
      this.me = data;
      // Ahora que tenemos `this.me`, podemos obtener los posts y ordenarlos por fecha
      if (this.me && this.me.id) {
        this.postService.posts$.subscribe((posts) => {
          this.posts = posts.sort((a, b) => {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });
        });
        this.postService.fetchAndEmitPosts(data.id);
      }
    });
  }

  // Al hacer click en el botón de like, llamamos al servicio de likes, para crearlo o cambiar el estado
  onLikePost(postId:number){
    this.auth.me().subscribe((data) =>{
      this.likeService.onLike(postId, data.id).subscribe({
        next: (response) => {
          this.postService.updatePostLike(postId,response.like)
          this.postService.fetchAndEmitPosts(this.me.id)
        },
        error: (error) => {
          console.error('Error de like', error);
        }
      });
    })
  }
  
  // Cuando se hace click en el botón de comentar, llamamos al servicio de comentarios, para crearlo
  onCommentPost(comment:Comment){
    this.auth.me().subscribe((data) =>{
        comment.userId = data.id
        this.commentService.addComment(comment).subscribe()  
    })    
  }
  
  // Al hacer click en el botón de mostrar comentarios, llamamos al servicio de comentarios, para obtenerlos
  async onShowComments(postId: number) {
    this.commentService.getCommentForPots(postId).subscribe(async (comments) => {
      const modal = await this.modalController.create({
        component: CommentModalComponent,
        componentProps: {
          'postId': postId,
          'comments': comments // Pasamos los comentarios como propiedad al modal
        }
      });
      await modal.present();
    });
  }
  
  // Al hacer click en el botón de añadir post, llamamos al modal de añadir post
  async presentAddPostModal() {
    const modal = await this.modalController.create({
      component: AddPostModalComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.status === 'ok') {
      // Convertir la imagen a blob
      dataURLtoBlob(data.post.image, (blob:Blob)=>{
        this.mediaService.upload(blob).subscribe((media:number[])=>{
      // Obtener detalles del usuario
      this.auth.me().subscribe(
        user => {
          //Cogemos la url de la imagen
          const imageUrl = media.length > 0 ? media[0] : null;
          // Creamos el nuevo post
          const newPost: any = {
            img: imageUrl,
            description: data.post.description,
            userId: user.id
          };
        this.postService.postPost(newPost).subscribe({
          next: () => {
            this.postService.fetchAndEmitPosts(this.me.id);
          },
          error: (error) => {
            console.error('Error al crear el post', error);
          }
        });
      });
        })
      })
    }
  }
*/
}
