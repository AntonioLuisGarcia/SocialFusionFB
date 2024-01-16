// Angular
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class usernameValidators{

    // Metodo que valida que el username no tenga espacios
    public static noSpacesInName():ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null =>{
            const value = control.value;
            // Si tiene espacios no valida el formulario
            if (typeof value === 'string' && value.includes(' ')) {
                return { 'noSpacesAllowed': true };
            }
            return null;
        };
    }
}