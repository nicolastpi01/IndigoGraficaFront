import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/objects/pedido';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { PedidoService } from '../pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {


  colorear :(descripcion: string) => string | undefined = colorearEstado
  loading: boolean = false
  pedidos: Pedido[] = []
  estadoBusqueda = "Pendiente Atencion"

  constructor(private service: PedidoService) { }

  ngOnInit() {
    this.getPedidos()
  }


  getPedidos(): void {
    this.service.getPedidos(this.estadoBusqueda)
    .subscribe(pedidos => this.pedidos = pedidos);
  }

  reservar (key: string): void {
    this.loading = true
    //this.loading = false
  }



}
