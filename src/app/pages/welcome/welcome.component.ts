import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  usuario=''
  roles=''
  mensajeBienvenida= 'Bienvenido! Registrate o ingresá para hacer tus pedidos'

  constructor(private tokenStorage: TokenStorageService,) { }

  ngOnInit() {
    const usuarioLogeado = this.tokenStorage.getUser()
    this.usuario = usuarioLogeado.username
    this.roles = usuarioLogeado.roles.join(", ").replace('ROLE_',' ')
    if(this.usuario){
      this.mensajeBienvenida=`Bienvenido ${this.usuario}. Roles: ${this.roles}`
    }
  }
}
