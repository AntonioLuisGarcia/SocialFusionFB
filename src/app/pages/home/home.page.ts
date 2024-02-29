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
import { AuthStrapiService } from 'src/app/core/services/api/strapi/auth-strapi.service';
import { CommentFirebaseService } from 'src/app/core/services/api/firebase/comment-firebase.service';
import { LikeFirebaseService } from 'src/app/core/services/api/firebase/like-firebase.service';

import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(
    private postService: PostFirebaseService,
    private authService: AuthService,
    public modalController: ModalController,
    private mediaService: MediaService,
    private commentService: CommentFirebaseService,
    private likeService: LikeFirebaseService
  ){

  }

  posts: PostExtended[] | any;
  post: PostExtended | any;

  // Al iniciar la página, obtenemos el usuario actual y sus posts
  ngOnInit() {
    this.postService.getAllPostWithLikes().subscribe((data =>{
      console.log(data)
      this.posts = data;
    }))
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
      if(data.post.image){
        dataURLtoBlob(data.post.image, (blob:Blob)=>{
          this.mediaService.upload(blob).subscribe((media:number[])=>{
            // Obtener detalles del usuario
      this.authService.me().subscribe(
        user => {
          //Cogemos la url de la imagen
          const imageUrl = media.length > 0 ? media[0] : null;
          // Creamos el nuevo post
          const newPost: any = {
            img: imageUrl,
            description: data.post.description,
            user: {
              uuid: user.uuid,
              name: user.name,
              username: user.username,
              //Completar si es necesario
            }
          };
        this.postService.createPost(newPost).subscribe({
          next: () => {
            this.postService.getAllPostWithLikes().subscribe(posts => {
              // Actualiza la lista de posts
              this.posts = posts;
            });
            console.log("Creado:",newPost)
          },
          error: (error) => {
            console.error('Error al crear el post', error);
          }
        });
      });
        })
      })
    }else{
      this.authService.me().subscribe(
        user => {
          // Creamos el nuevo post
          const newPost: any = {
            img: null,
            description: data.post.description,
            user: {
              uuid: user.uuid,
              name: user.name,
              username: user.username,
              //Completar si es necesario
            }
          };
        this.postService.createPost(newPost).subscribe({
          next: () => {
            this.postService.getAllPostWithLikes().subscribe(posts => {
              // Actualiza la lista de posts
              this.posts = posts;
            });
            console.log("Creado:",newPost)
          },
          error: (error) => {
            console.error('Error al crear el post', error);
          }
        });
      });
    }
    }
  }

    // Cuando se hace click en el botón de comentar, llamamos al servicio de comentarios, para crearlo
    onCommentPost(comment:Comment){
      console.log(comment)
      this.authService.me().subscribe((data) =>{
          comment.user = data
          this.commentService.createComment(comment).subscribe()  
      })    
    }

      // Al hacer click en el botón de mostrar comentarios, llamamos al servicio de comentarios, para obtenerlos
  async onShowComments(postUuid: string) {
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

    // Al hacer click en el botón de like, llamamos al servicio de likes, para crearlo o cambiar el estado
    onLikePost(postUuid:string){
      this.authService.me().subscribe((data) =>{
        this.likeService.onLike(postUuid, data.uuid).subscribe({
          next: (response) => {
            console.log("Like hecho: " + response)
            this.postService.getAllPostWithLikes().subscribe(posts => {
              // Actualiza la lista de posts
              this.posts = posts;
            });
          },
          error: (error) => {
            console.error('Error de like', error);
          }
        });
      })
    }

    imageElement: string | undefined;
    
async takePicture () {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  var imageUrl = image.webPath;

  // Can be set to the src of an image now
  this.imageElement = imageUrl;
};
}
