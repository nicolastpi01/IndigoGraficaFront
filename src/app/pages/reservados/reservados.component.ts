import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { RESERVADO, REVISION } from 'src/app/utils/const/constantes';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';

@Component({
  selector: 'app-reservados',
  templateUrl: '../pedidos/pedidos.component.html',
  styleUrls: ['./reservados.component.css']
})
export class ReservadosComponent implements OnInit {

  pedidos: any[] = []
  colorear :(descripcion: string) => string | undefined = colorearEstado
  loading: boolean = false
  AccionText: String = "Resolver"

  constructor(private service: PedidoService,  private msg: NzMessageService, private _router: Router) { }

  ngOnInit(): void {
    this.getPedidos()
  }

  
  getPedidos(): void {
    this.service.getPedidos(RESERVADO)
    .subscribe(pedidos => this.pedidos = pedidos);
  }

  onClickAccion (pedido: Pedido): void {
    this._router.navigateByUrl('/pedidos' + `/${pedido.id}`)
  }

}
