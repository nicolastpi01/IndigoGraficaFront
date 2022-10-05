import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { RESERVADO } from 'src/app/utils/const/constantes';
import { toLocalDateString } from 'src/app/utils/functions/functions';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  pageIndex: number = 1; 
  total: number = 0;
  currentPedido: any;
  pedidos: any[] = [];

  loading: boolean = false;


  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString;
  colorear :(descripcion: string) => string | undefined = colorearEstado
  AccionText: String = "Editar"

  constructor(private _router: Router, private service: PedidoService) { }

  ngOnInit(): void {
    this.getPedidos()
  }

  getPedidos(): void {
    this.loading = true
    this.service.getPedidos('Pendiente atencion')
    .subscribe(pedidos => {
       this.pedidos = pedidos
       this.total = pedidos.length
       this.loading = false
       if(pedidos.length > 0) this.currentPedido = pedidos[0]; 
    });
  }

  onClickAccion (pedido: Pedido): void {
    this._router.navigateByUrl('/nuevo' + `/${pedido.id}`)
  }

  eliminar ():void {

  }

  indexChange($event: any){
    let newIndex = parseInt($event);
    this.pageIndex = newIndex;
    let newPedido = this.pedidos[newIndex-1];
    if(newPedido) this.currentPedido = newPedido;
  }

}
