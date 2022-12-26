import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  usuario=''
  mensajeBienvenida= 'Bienvenido! Registrate o ingresá para hacer tus pedidos'
  isLoggedIn = false;

  constructor(private tokenStorage: TokenStorageService,) { }

  ngOnInit() {
    const usuarioLogeado = this.tokenStorage.getUser()
    this.isLoggedIn = !!this.tokenStorage.getToken();
    this.usuario = usuarioLogeado.username
    if(this.usuario){
      this.mensajeBienvenida=`Bienvenido ${this.usuario}.`
    }
  }
}
