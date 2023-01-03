import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileDB } from 'src/app/interface/fileDB';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { RESERVADO } from 'src/app/utils/const/constantes';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.css']
})
export class RevisionComponent implements OnInit {

  index: number = 0
  index2: number = 2
  PENDREVISION: string = 'pendRevision'
  total: number = 0
  actionText: string = ""
  currentPedido: Pedido | undefined
  currentFile: FileDB | undefined
  loading: boolean = false
  pedidos: Array<any> = []
  roles: string[] = []
  isLoggedIn: boolean = false
  allData: Array<any> = []

  constructor(private service: PedidoService, private msg: NzMessageService, private _router: Router, 
    private tokenService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenService.getToken()
    if(this.isLoggedIn) {
      this.getPedidos()
      const user = this.tokenService.getUser()
      this.roles = user.roles
    }
  };

  getPedidos(): void {
    this.loading = true
    let token :string = this.tokenService.getToken()
    this.service.getPedidos(this.PENDREVISION)
    .subscribe(pedidos => {
      this.allData = pedidos
      this.total = pedidos.length
      this.pedidos = pedidos.map((p) => ({ ...p, showMore: false })).slice(this.index, this.index2)        
      this.loading = false
    })
  };

  cleanPedidoAndFile(myPackage: {pedido: Pedido | undefined, file: FileDB | undefined}) {
    this.currentFile = myPackage.file
    this.currentPedido = myPackage.pedido
  };

  manageOuputOnClickWatch = (item: any) => {
    this.currentFile = item; 
  };

}
