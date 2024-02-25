/// Angular
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

/// Interfaces
import { PostExtended } from 'src/app/core/interfaces/post';

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.component.html',
  styleUrls: ['./add-post-modal.component.scss'],
})
export class AddPostModalComponent  implements OnInit {

  postForm: FormGroup;
  @Input() existingPost: PostExtended | null = null;


  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
  ) {
    this.postForm = this.formBuilder.group({
      description: ['', Validators.required],
      image: [''],
    });
  }

  // Método para cerrar el modal
  dismissModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
    if (this.postForm.valid) {
      const post = {
        id: this.existingPost?.id || null, //si lo usamos para editar tendra id, si es para crear un post se lo asignaremos luego
        image: this.postForm.get('image')?.value || null, // Si la imagen es nula, asignamos null
        description: this.postForm.get('description')?.value
      };
  
      // Se cierra el modal y devolvemos el mensaje de 'ok' y el post
      this.modalController.dismiss({ post: post, status: 'ok' });
    }
  }
  
  ngOnInit() {
    if (this.existingPost) {
      this.postForm.patchValue({
        description: this.existingPost.description,
        image: this.existingPost.img.url_small 
      });
    }
  }

}
