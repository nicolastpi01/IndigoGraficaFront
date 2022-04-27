import { Component, OnInit } from '@angular/core';
import { PendienteAtencion } from 'src/app/objects/estado';
import { Pedido } from 'src/app/objects/pedido';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})

export class PedidosComponent implements OnInit {

  colorear :(descripcion: string) => string = colorearEstado
  loading: boolean = false
  pedidos: Pedido[]
  estadoBusqueda = "Pendiente Atencion"

  constructor(private service: UploadFileService) { }

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
