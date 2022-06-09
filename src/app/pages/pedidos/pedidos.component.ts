import { Component, HostBinding, OnInit } from '@angular/core';
import { Pedido } from 'src/app/interface/pedido';
import { PENDIENTEATENCION } from 'src/app/utils/const/constantes';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { PedidoService } from '../../services/pedido.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Color } from 'src/app/interface/color';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  colorear :(descripcion: string) => string | undefined = colorearEstado
  loading: boolean = false
  pedidos: any[] = []
  AccionText: String = "Reservar"

  @HostBinding('class.is-open')
  isOpen = false;
  
  constructor(private service: PedidoService,  private msg: NzMessageService) { }

  ngOnInit() {
    this.getPedidos()
    this.service.change.subscribe((isOpen: any) => {
      this.isOpen = isOpen;
      this.getPedidos()
    });
    
    
  }

  getPedidos(): void {
    this.service.getPedidos(PENDIENTEATENCION)
    .subscribe(pedidos => this.pedidos = pedidos);
  }


  onClickAccion (pedido: Pedido): void {
    this.loading = true
    this.service.reservar(pedido)
    .subscribe((_) => {
       this.msg.success('Reservado exitosamente!');
       this.getPedidos()
       this.loading = false 
    })
  }



}
