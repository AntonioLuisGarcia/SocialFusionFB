/// Angular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/// Interface
import { UserCredentials } from 'src/app/core/interfaces/UserCredentials';

/// Validators
import { PasswordValidation } from 'src/app/core/validators/password';
import { usernameValidators } from 'src/app/core/validators/username';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent  implements OnInit {

  @Input('username') set username(value: string){
    this.form?.controls['username'].setValue(value);
  }

  @Output() onsubmit = new EventEmitter<UserCredentials>();

  form: FormGroup | null = null;
  constructor(
    private formBuilder:FormBuilder
  ) { 
    // Los validadores del formulario
    this.form = this.formBuilder.group({
      username:['', [Validators.required, usernameValidators.noSpacesInName()]],
      password:['', [Validators.required, usernameValidators.noSpacesInName(), PasswordValidation.passwordProto()]]
    });
  }

  ngOnInit() {}

  // Al enviar el formulario, emitimos los datos y borramos la contraseña
  onSubmit(){
    this.onsubmit.emit(this.form?.value);
    this.form?.controls['password'].setValue('');
  }

  hasError(control:string, error:string):boolean{
    let errors = this.form?.controls[control].errors;
    console.log("Tiene espacios")
    return errors!=null && error in errors;
  }
}
