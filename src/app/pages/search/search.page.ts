/// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

/// Rxjs
import { debounceTime } from 'rxjs';

/// Service
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchControl = new FormControl();
  filteredUsers = [];
  searched = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Al iniciar la página, nos suscribimos a los cambios del input de búsqueda
  // Añadimos un retraso de 500 milisegundos para no hacer demasiadas peticiones
  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500)) // 500 milisegundos de retraso
      .subscribe(value => {
        this.searchUsers(value); // Método para buscar usuarios
      });
  }
  
  // Método para buscar usuarios
  searchUsers(query: string) {
    // Verificamos que se haya introducido algo
    if(query) {
      // Variable para mostrar el mensaje de que no se han encontrado resultados, en caso de que sea así
      this.searched = true;
      this.authService.searchUser(query).subscribe(results => {
        this.filteredUsers = results;
      });
    } else {
      this.searched = false;
    }
  }

  // Cuando se hace click en un usuario, se navega a la página de detalles de ese usuario
  userClicked(userId: number) {
    // Obtenemos el usuario por su id
    this.authService.getUser(userId).subscribe( data =>{
      // Guardamos el usuario en la página 
      let navigationExtras: NavigationExtras = {
        state: {
          user: data
        }
      };
      // Navegamos a la página de detalles de usuario
      this.router.navigate(['user-details'], navigationExtras);
    })
  }

}
