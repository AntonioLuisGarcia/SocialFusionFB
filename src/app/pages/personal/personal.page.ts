/// Angular
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

/// Services
import { AuthService } from 'src/app/core/services/auth.service';
import { LikeService } from 'src/app/core/services/api/strapi/like.service';
import { PostService } from 'src/app/core/services/api/strapi/post.service';
import { CommentService } from 'src/app/core/services/api/strapi/comment.service';
import { MediaService } from 'src/app/core/services/media.service';

/// Interfaces
import { Comment } from 'src/app/core/interfaces/comment';
import { PostExtended } from 'src/app/core/interfaces/post';
import { UserExtended } from 'src/app/core/interfaces/User';

/// Modal
import { CommentModalComponent } from '../../shared/components/comment-modal/comment-modal.component';
import { AddPostModalComponent } from 'src/app/shared/components/add-post-modal/add-post-modal.component';
import { ConfirmDeleteAccountComponent } from './confirm-delete-account/confirm-delete-account.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

/// Helpers
import { dataURLtoBlob } from 'src/app/core/helpers/blob';
import { map, switchMap } from 'rxjs';
import { PostFirebaseService } from 'src/app/core/services/api/firebase/post-firebase.service';
import { LikeFirebaseService } from 'src/app/core/services/api/firebase/like-firebase.service';
import { CommentFirebaseService } from 'src/app/core/services/api/firebase/comment-firebase.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.page.html',
  styleUrls: ['./personal.page.scss'],
})
export class PersonalPage implements OnInit {

  userPosts: PostExtended[] | any;
  actualUser: UserExtended | any;

  constructor(
    private authService:AuthService,
    private postService:PostFirebaseService,
    private likeService:LikeFirebaseService,
    private mediaService: MediaService,
    private commentService:CommentFirebaseService,
    private modalController:ModalController,
    private router:Router,
  ) { }

  ngOnInit() {
    // Nos suscribimos al usuario actual
    this.authService.me().subscribe(data => {      
      this.actualUser = data;
      if (this.actualUser.uuid) {
        this.postService.getPostsForUser(this.actualUser.uuid, this.actualUser.uuid).subscribe(userPosts => {
          this.userPosts = userPosts;
          console.log(this.userPosts);
        });
      }
    });
  }

    // Si se quiere borrar un post
    onDeletePost(uuid: string) {
      console.log(uuid);
      this.postService.deletePost(uuid).subscribe()
    }

    
  // Si se quiere editar un post llamamos al metodo openEditModal
  onEditPost(post: PostExtended) {
    this.openEditModal(post);
  }

  // Si se quiere editar un post, se abre el modal para cambiar los datos
  async openEditModal(post: PostExtended) {
    const modal = await this.modalController.create({
      component: AddPostModalComponent,
      componentProps: {
        existingPost: post
      }
    });
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
  
    if (data && data.status === 'ok') {
      const { description, image } = data.post;
      const currentImage = post.img;
  
      dataURLtoBlob(image, (blob: Blob) => {
        this.mediaService.upload(blob).pipe(
          switchMap((media: number[]) => {
            const imageUrl = media.length > 0 ? media[0] : null;
            const updatedData = {
              ...post,
              description,
              img: imageUrl || currentImage
            };
            return this.postService.updatePost(updatedData, this.actualUser.uuid);
          }),
          switchMap(() => this.postService.getOwnPost(this.actualUser.uuid))
        ).subscribe((updatedPosts) => {
          this.userPosts = updatedPosts;
        });
      });
    }  
  }
  
  // Si se quiere editar el perfil, se abre el modal para cambiar los datos
  async editProfile() {
    // Le pasamos la información del usuario al modal para que rellene los campos
    const modal = await this.modalController.create({
      component: EditProfileComponent,
      componentProps: {
        user: this.actualUser
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    // Si hay datos y se han confirmaso
    if (data && data.status === 'ok') {
      // Verifica si hay una imagen nueva o si la imagen se ha eliminado
      if (data.user.img && data.user.img !== this.actualUser.img) {
        // Si hay una imagen nueva y es diferente a la actual
        dataURLtoBlob(data.user.img, (blob: Blob) => {
          this.mediaService.upload(blob).subscribe((media: number[]) => {
            // Obtener detalles del usuario
            this.authService.me().subscribe(user => {
              const imageUrl = media.length > 0 ? media[0] : null;
              console.log('Nueva URL de imagen:', imageUrl);
              const userInfo: any = {
                image: imageUrl,
                name: data.user.name,
                username: data.user.username
              };
              // Actualiza la información del usuario con la nueva imagen
              this.updateUserProfile(user.uuid, userInfo);
            });
          });
        });
      } else if (!data.user.img) {
        // Si la imagen ha sido eliminada
        const userInfo: any = {
          image: null, // Establece la imagen en null para eliminarla
          name: data.user.name,
          username: data.user.username
        };
        // Actualiza la información del usuario sin la imagen
        this.updateUserProfile(this.actualUser.uuid, userInfo);
      } else {
        // Si la imagen no ha cambiado
        const userInfo: any = {
          name: data.user.name,
          username: data.user.username
        };
        // Actualiza solo el nombre y el nombre de usuario
        this.updateUserProfile(this.actualUser.uuid, userInfo);
      }
    }
  }

  // Actualiza el perfil del usuario
  updateUserProfile(userUuid: string, userInfo: any) {
    console.log(userInfo)
    this.authService.updateUser(userUuid, userInfo).subscribe({
      next: (updatedUser: UserExtended) => {
        // Manejo adecuado tras la actualización exitosa
        console.log('Perfil actualizado correctamente.');
      },
      error: (error) => {
        console.error('Error al actualizar el perfil', error);
      }
    });
  }

  // Si quiere borrar, mostraremos un modal de confirmación   
  async deleteAccount(){
    const modal = await this.modalController.create({
      component: ConfirmDeleteAccountComponent
    });
    await modal.present();
    // SI hay datos y se confirma, se elimina la cuenta
    const { data } = await modal.onWillDismiss();
    if (data && data.confirm) {
      // Borramos al usuario de la BBDD por su id
      this.authService.me().subscribe( data =>{
        this.authService.deleteUser(data.uuid).subscribe({
          next: (response) => {
            // Navegamos al login
            console.log('Cuenta eliminada correctamente.');
            this.router.navigate(['/login'])
          },
          error: (error) => {
            // Manejo de errores
            console.error('error al eliminar la cuenta', error);
          }
        });
      })   
    }else{
      console.log("No se ha encontrado el uuid")
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
          //this.postService.updatePostLike(postId,response.like)
          //this.postService.fetchAndEmitPosts(this.me.id)
        },
        error: (error) => {
          console.error('Error de like', error);
        }
      });
    })
  }


    /**
     * 

    // Nos suscribimos a los posts y los ordenamos por fecha
    this.postService.posts$.subscribe(posts => {
      if (this.actualUser) {
        this.userPosts = posts.filter((post: PostExtended) => post.user?.id === this.actualUser.id);
        this.userPosts.sort((a: PostExtended, b: PostExtended) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      }
    });
  }


  /*
  constructor(
    private authService:AuthService,
    private postService:PostService,
    private likeService:LikeService,
    private mediaService: MediaService,
    private commentService:CommentService,
    private modalController:ModalController,
    private router:Router,
  ) { }

  ngOnInit() {
    // Nos suscrbimos al usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.actualUser = user;
    });


    /**
     * this.authService.me().pipe(map(data =>{
        let uuid = data.uuid;
        
      }))
     

    // Nos suscribimos a los posts y los ordenamos por fecha
    this.postService.posts$.subscribe(posts => {
      if (this.actualUser) {
        this.userPosts = posts.filter((post: PostExtended) => post.user?.id === this.actualUser.id);
        this.userPosts.sort((a: PostExtended, b: PostExtended) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      }
    });
  }
  

  // Si se da like al post
  onLikePost(postId: number) {
    this.authService.me().subscribe((data) => {
      // Llamamos al servicio de likes
      this.likeService.onLike(postId, data.id).subscribe({
        next: (response) => {
          // Encuentra el post en la lista para actualizarlo
          const index = this.userPosts.findIndex((p: PostExtended) => p.id === postId);
          if (index !== -1) {
            // Cambia el estado del like al contrario
            const likedByUser = !this.userPosts[index].likedByUser;
            // Actualiza el post con el nuevo estado del like
            const updatedPost = {
              ...this.userPosts[index],
              likedByUser: likedByUser,
            };
            // Actualiza la lista de posts
            this.userPosts = [
              ...this.userPosts.slice(0, index),
              updatedPost,
              ...this.userPosts.slice(index + 1),
            ];
          }
        },
        error: (error) => {
          console.error('Error al cambiar el estado del like', error);
        }
      });
    });
  }
  
  // Si se comenta un post
  onCommentPost(comment:Comment){
    this.authService.me().subscribe((data) =>{
        comment.userId = data.id
        this.commentService.addComment(comment).subscribe()  
    })    
  }
  
  // Si se quiere ver los comentarios de un post
  async onShowComments(postId: number) {
    // Obtenemos los comentarios del post por su id y los mostramos en un modal
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

  // Si se quiere editar un post llamamos al metodo openEditModal
  onEditPost(post: PostExtended) {
    this.openEditModal(post);
  }
  
  // Si se quiere borrar un post
  onDeletePost(postId: number) {
    this.postService.deletePost(postId).subscribe( 
    )
  }

  // Si se quiere editar un post, se abre el modal para cambiar los datos
  async openEditModal(post: PostExtended) {
    // Le pasamso la información del post al modal para que rellene los campos
    const modal = await this.modalController.create({
      component: AddPostModalComponent,
      componentProps: {
        existingPost: post
      }
    });
    await modal.present();  
    const { data } = await modal.onDidDismiss();
    // Si hay datos y se han confirmado
    if (data && data.status === 'ok') {
      const { description, image } = data.post;
      const currentImage = post.img;
      //Pasamos la imagen a blob
      dataURLtoBlob(image, (blob: Blob) => {
        // Subimos el blob de la imagen y realizamos operaciones secuenciales
        this.mediaService.upload(blob).pipe(
          switchMap((media: number[]) => {
            // Obtenemos la URL de la imagen subida
            const imageUrl = media.length > 0 ? media[0] : null;
            // Creamos los datos actualizados del post
            const updatedData = {
              ...post,
              description,
              img: imageUrl || currentImage
            };
            // Actualizamos el post y luego obtenemos los posts actualizados por el usuario
            return this.postService.updatePost(updatedData, this.actualUser.id);
          }),
          switchMap(() => this.postService.getPostsByUserId(this.actualUser.id, this.actualUser.id))
        ).subscribe(updatedPosts => {
          //Actualizamos la lista de posts
          this.userPosts = updatedPosts;
        });
      });
    }  
  }

  // Si se quiere editar el perfil, se abre el modal para cambiar los datos
  async editProfile() {
    // Le pasamos la información del usuario al modal para que rellene los campos
    const modal = await this.modalController.create({
      component: EditProfileComponent,
      componentProps: {
        user: this.actualUser
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    // Si hay datos y se han confirmaso
    if (data && data.status === 'ok') {
      // Verifica si hay una imagen nueva o si la imagen se ha eliminado
      if (data.user.img && data.user.img !== this.actualUser.img) {
        // Si hay una imagen nueva y es diferente a la actual
        dataURLtoBlob(data.user.img, (blob: Blob) => {
          this.mediaService.upload(blob).subscribe((media: number[]) => {
            // Obtener detalles del usuario
            this.authService.me().subscribe(user => {
              const imageUrl = media.length > 0 ? media[0] : null;
              console.log('Nueva URL de imagen:', imageUrl);
              const userInfo: any = {
                image: imageUrl,
                name: data.user.name,
                username: data.user.username
              };
              // Actualiza la información del usuario con la nueva imagen
              this.updateUserProfile(user.id, userInfo);
            });
          });
        });
      } else if (!data.user.img) {
        // Si la imagen ha sido eliminada
        const userInfo: any = {
          image: null, // Establece la imagen en null para eliminarla
          name: data.user.name,
          username: data.user.username
        };
        // Actualiza la información del usuario sin la imagen
        this.updateUserProfile(this.actualUser.id, userInfo);
      } else {
        // Si la imagen no ha cambiado
        const userInfo: any = {
          name: data.user.name,
          username: data.user.username
        };
        // Actualiza solo el nombre y el nombre de usuario
        this.updateUserProfile(this.actualUser.id, userInfo);
      }
    }
  }

  // Actualiza el perfil del usuario
  updateUserProfile(userId: number, userInfo: any) {
    this.authService.updateUser(userId, userInfo).subscribe({
      next: (updatedUser: UserExtended) => {
        // Manejo adecuado tras la actualización exitosa
        console.log('Perfil actualizado correctamente.');
      },
      error: (error) => {
        console.error('Error al actualizar el perfil', error);
      }
    });
  }

  // Si quiere borrar, mostraremos un modal de confirmación   
  async deleteAccount(){
    const modal = await this.modalController.create({
      component: ConfirmDeleteAccountComponent
    });
    await modal.present();
    // SI hay datos y se confirma, se elimina la cuenta
    const { data } = await modal.onWillDismiss();
    if (data && data.confirm) {
      // Borramos al usuario de la BBDD por su id
      this.authService.me().subscribe( data =>{
        this.authService.deleteUser(data.id).subscribe({
          next: (response) => {
            // Navegamos al login
            console.log('Cuenta eliminada correctamente.');
            this.router.navigate(['/login'])
          },
          error: (error) => {
            // Manejo de errores
            console.error('error al eliminar la cuenta', error);
          }
        });
      })   
    }else{
      console.log("No")
    }
  }

  */
}