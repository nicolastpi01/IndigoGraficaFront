import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from './services/pedido.service';
import { TokenStorageService } from './services/token-storage.service';
import { CLEAR, DANGER, FINALIZADOS, PENDIENTEATENCION, RESERVADO, RETORNADOS, REVISION, WARNING } from './utils/const/constantes';

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

  isVisible = false;
  isVisibleLogin = false;
  isVisibleRegistrar = false;

  @HostBinding('class.is-open')
  isOpen = false;
  
  constructor(private service: PedidoService, private _router: Router,private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.mostrarOpcionesCliente = this.roles.includes('ROLE_USER');
      this.mostrarOpcionesEncargado = this.roles.includes('ROLE_ENCARGADO');

      this.username = user.username;
    }
    this.buscarTodos()
    this.service.change.subscribe((isOpen: any) => {
      this.isOpen = isOpen;
      this.buscarTodos()
    });
    this.title = 'indigo';
  }

  determiteBadgeColor = () :string =>  {
    let cantidad = this.cantidadPendienteAtencion;
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
  
  onClickCarrito = () => {
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
