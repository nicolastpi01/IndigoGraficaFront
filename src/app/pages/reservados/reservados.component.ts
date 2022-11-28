import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileDB } from 'src/app/interface/fileDB';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { RESERVADO } from 'src/app/utils/const/constantes';

@Component({
  selector: 'app-reservados',
  templateUrl: '../reservados/reservados.component.html',
  styleUrls: ['../reservados/reservados.component.css']
})
export class ReservadosComponent implements OnInit {

  count: number = 2;
  index: number = 0;
  index2: number = 2;
  allData: Array<any> = []
  loadingMore: boolean = false;


  loading: boolean = false
  currentFile: FileDB | undefined 
  actionText = 'Resolver'
  currentPedido: Pedido | undefined
  roles: string[] = []
  pedidos: any[] = []
  total: number = 0

  constructor(private service: PedidoService,  private msg: NzMessageService, private _router: Router, 
    private tokenService: TokenStorageService) { }

  ngOnInit(): void {
    this.getPedidos()
    const user = this.tokenService.getUser()
    this.roles = user.roles;
  }

  getPedidos(): void {
    this.loading = true;
    this.service.getPedidos(RESERVADO)
    .subscribe(pedidos => {
      this.allData = pedidos
      this.total = pedidos.length
      this.pedidos = pedidos.map((p) => ({ ...p, showMore: false }))
      this.loading = false 
      //this.pedidos = pedidos.map((p) => ({ ...p, showMore: false })).slice(this.index, this.index2); 
    });
  }

  manageOuputOnClickWatch = (item: any) => {
    this.currentFile = item; 
  };

  cleanPedidoAndFile = (myPackage: {pedido: Pedido | undefined, file: FileDB | undefined}) => {
    this.currentPedido = myPackage.pedido,
    this.currentFile = myPackage.file
  };

  /*
  onLoadMore = (event: MouseEvent) => {
    event.preventDefault;
    this.loadingMore = true;
    
    let index = this.index + this.count
    let index2 = this.index2 + this.count
    
    let slice = this.allData.slice(index, index2) 
    this.pedidos = this.pedidos.concat(slice)

    this.index2 = index2;
    this.index = index;
    this.loadingMore = false;
  };
  */

  onClickShowMore(pedido: any) {
    pedido.showMore = !pedido.showMore
  }

  onClickAction (pedido: Pedido): void {
    this._router.navigateByUrl('/pedidos' + `/${pedido.id}`)
  }

}
