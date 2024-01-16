/// Angular
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/// Interfaces
import { UserRegister } from 'src/app/core/interfaces/UserRegister';

/// Validators
import { PasswordValidation } from 'src/app/core/validators/password';
import { usernameValidators } from 'src/app/core/validators/username';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss'],
})
export class CreateAccountFormComponent  implements OnInit {
  
  @Output() onsubmit = new EventEmitter<UserRegister>();
  
  ngOnInit() {}

  form:FormGroup | null = null;
  constructor(private formBuilder:FormBuilder) {
    this.form  = formBuilder.group({
      name:["",[Validators.required]],
      username:["",[Validators.required, usernameValidators.noSpacesInName()]],
      email:["",[Validators.required, Validators.email]],
      password:["",[Validators.required, Validators.minLength(8), PasswordValidation.passwordProto(), usernameValidators.noSpacesInName()]],
      passwordRepeat: ['', Validators.required]
    }, { 
      validator: PasswordValidation.passwordMatch('password', 'passwordRepeat') // Aplica aquí el validador
    });
  }

  onSubmit(){
    this.onsubmit.emit(this.form?.value);
  }
}
