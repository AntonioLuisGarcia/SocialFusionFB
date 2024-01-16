// Angular
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export class PasswordValidation {
    
    // Prototipo de una contraseña segura
    public static passwordProto(controlName:string=''): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let password = '';
            if(control instanceof FormControl)
                password = control?.value;
            else
                password = control.get(controlName)?.value;
            if(password && !password.match(/^(?=.*\d)(?=.*[a-zá-ú\u00f1ä-ü])(?=.*[A-ZÁ-Ú\u00d1Ä-Ü])[0-9a-zá-úä-üA-ZÁ-ÚÄ-Ü \u00d1$-/@:-?{-~!"^_`\[\]]{8,}$/)){
                return { 'passwordProto': true};
            }
            else{
                return null;
            }  
        }
    }

    // En caso de hacer el register verificamos si la contraseña y  la confirmación son iguales
    public static passwordMatch(passwordControlName:string, confirmControlName:string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const password = formGroup.get(passwordControlName)?.value;
        const confirmPassword = formGroup.get(confirmControlName)?.value;

        if (password !== confirmPassword) {
            formGroup.get(confirmControlName)?.setErrors({ passwordMatch: true });
            return { passwordMatch: true }; 
        } else {
            
            formGroup.get(confirmControlName)?.setErrors(null);
        }

        return null;
        };
    }
}