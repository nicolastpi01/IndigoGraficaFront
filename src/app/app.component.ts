import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from './services/pedido.service';
import { TokenStorageService } from './services/token-storage.service';
import { CLEAR, DANGER, FINALIZADOS, NONE, PENDIENTEATENCION, RESERVADO, RETORNADOS, REVISION, WARNING } from './utils/const/constantes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  isCollapsed = false;
  cantidadPendienteAtencion : number = 0;
  cantidadReservados: number = 0;
  cantidadFinalizados: number = 0;
  cantidadEnRevision: number = 0;
  cantidadRetornados: number = 0;
  mostrarOpcionesCliente = false;
  mostrarOpcionesEncargado = false;
  private roles: string[] = [];
  username: string = '';
  title = 'indigo'
  pendienteAtencion = PENDIENTEATENCION;
  reservado = RESERVADO;

  isVisible = false;
  isVisibleLogin = false;
  isVisibleRegistrar = false;

  @HostBinding('class.is-open')
  isOpen = false;

  resume: {[key: string]: number} | undefined;
  
  constructor(private service: PedidoService, private _router: Router,private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.mostrarOpcionesCliente = this.roles.includes('ROLE_USER');
      this.mostrarOpcionesEncargado = this.roles.includes('ROLE_ENCARGADO');

      console.log("EJECUTE ON INIT")
      this.findResume();
      this.username = user.username;
      this.service.change.subscribe((isOpen: any) => {
        //this.isOpen = isOpen;
        console.log("IS OPEN :", isOpen)
        this.findResume();
      });
    }
    //this.buscarTodos()
    
    this.title = 'indigo';
  }

  determiteBadgeColor = (state?: string) :string =>  {
    let cantidad = 0;
    if(state && this.resume) {
      cantidad += this.resume[state]
    } 
      if(cantidad === 0) {
        return NONE
      }
      else {
        if(cantidad <= 50) {
          return CLEAR;
        }
        else {
          if(cantidad <= 99) {
            return WARNING;
          }
          else {
            return DANGER;
          }
        }
      }
  };

  amountByState = (state: string) :number => {
    let amount: number = 0;
    if(this.resume) {
      amount += this.resume[state]
    }
    return amount;
  };

  amountToShowInCart = () :number => {
    let amount: number = 0;
    if(this.resume) {
      amount += this.resume[PENDIENTEATENCION]
      amount += this.resume['reservado']
    }
    return amount;
  };
  
  findResume = () :void => {
    let token :string = this.tokenStorageService.getToken()
    this.service.getResume(token)
    .subscribe(resume => this.resume = resume);
  };

  buscarTodos = () :void => {
    this.cantidadPedidos()
    this.buscarPedidosReservados()
    this.buscarPedidosFinalizados()
    this.buscarPedidosEnRevision()
    this.buscarPedidosRetornados()
  };

  cantidadPedidos () {
    this.service.getPedidos(PENDIENTEATENCION)
    .subscribe(pedidos => this.cantidadPendienteAtencion = pedidos.length);
  };

  buscarPedidosReservados () {
    this.service.getPedidos(RESERVADO)
    .subscribe(pedidos => this.cantidadReservados = pedidos.length);
  };

  buscarPedidosFinalizados () {
    this.service.getPedidos(FINALIZADOS)
    .subscribe(pedidos => this.cantidadFinalizados = pedidos.length);
  };

  buscarPedidosEnRevision () {
    this.service.getPedidos(REVISION)
    .subscribe(pedidos => this.cantidadEnRevision = pedidos.length);
  };
  
  buscarPedidosRetornados() {
    this.service.getPedidos(RETORNADOS)
    .subscribe(pedidos => this.cantidadRetornados = pedidos.length);
  }
  
  onClickCart = () => {
    this._router.navigateByUrl('/carrito')
  }

  showModal(): void {
    this.isVisibleLogin = true;
  }

  // modal login
  showModalLogin(): void {
    this.isVisibleLogin = true;
  }

  handleOkLogin(): void {
    this.isVisibleLogin = false;
  }

  handleCancelLogin(): void {
    this.isVisibleLogin = false;
  }

  showModalRegistrar(): void {
    this.isVisibleRegistrar = true;
  }

  handleOkRegistrar(): void {
    this.isVisibleRegistrar = false;
  }

  handleCancelRegistrar(): void {
    this.isVisibleRegistrar = false;
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
