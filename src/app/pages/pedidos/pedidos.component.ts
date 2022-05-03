import { Component, OnInit } from '@angular/core';
import { Pedido } from 'src/app/objects/pedido';
import { Usuario } from 'src/app/objects/usuario';
import { PENDIENTEATENCION } from 'src/app/utils/const/constantes';
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
  
  constructor(private service: PedidoService) { }

  ngOnInit() {
    this.getPedidos()
  }

  getPedidos(): void {
    this.service.getPedidos(PENDIENTEATENCION)
    .subscribe(pedidos => this.pedidos = pedidos);
  }

  reservar (pedido: Pedido): void {
    this.loading = true
    this.service.reservar(pedido)
    .subscribe((response) => {
       //console.log("Response: ", response)
       this.getPedidos()
       this.loading = false 
    })
  }



}
