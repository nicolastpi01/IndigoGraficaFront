import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { RESERVADO, REVISION } from 'src/app/utils/const/constantes';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';

@Component({
  selector: 'app-reservados',
  templateUrl: '../reservados/reservados.component.html',
  styleUrls: ['../reservados/reservados.component.css']
})
export class ReservadosComponent implements OnInit {

  pedidos: any[] = []
  colorear :(descripcion: string) => string | undefined = colorearEstado
  loading: boolean = false
  AccionText: String = "Resolver"


  pageIndex: number = 1; // pagina 1, current
  total: number = 0;
  currentPedido: any;

  constructor(private service: PedidoService,  private msg: NzMessageService, private _router: Router) { }

  ngOnInit(): void {
    this.getPedidos()
  }

  
  getPedidos(): void {
    this.service.getPedidos(RESERVADO)
    .subscribe(pedidos => {
       this.pedidos = pedidos
       this.total = pedidos.length
       if(pedidos.length > 0) this.currentPedido = pedidos[0]; 
    });
  }

  onPageIndexChange = (event: MouseEvent) => {
    //console.log("Change1: ", event);
  }

  handleChange = (change: any) => {
    console.log("Typeof :", typeof(change) )
    console.log("The change :", change);
  }

  handleEmitPage = (event: EventEmitter<number>) => {
    
    
    //console.log("Event :", event)
  }

  onClickAccion (pedido: Pedido): void {
    this._router.navigateByUrl('/pedidos' + `/${pedido.id}`)
  }

  indexChange($event: any){
    //console.log(`Right:${$event}`);

    let newIndex = parseInt($event) - 1;
    this.pageIndex = newIndex;
    let newPedido = this.pedidos[newIndex];
    if(newPedido) this.currentPedido = newPedido;

    
    
    //console.log(`Error:${this.PageIndex}`);
  }

}
