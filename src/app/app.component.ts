import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from './services/pedido.service';
import { CLEAR, DANGER, FINALIZADOS, PENDIENTEATENCION, RESERVADO, RETORNADOS, REVISION, WARNING } from './utils/const/constantes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  cantidadPendienteAtencion : number = 0;
  cantidadReservados: number = 0;
  cantidadFinalizados: number = 0;
  cantidadEnRevision: number = 0;
  cantidadRetornados: number = 0;
  title = 'indigo'

  @HostBinding('class.is-open')
  isOpen = false;
  
  constructor(private service: PedidoService, private _router: Router) {}

  ngOnInit() {
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
}
