import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileDB } from 'src/app/interface/fileDB';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-retornados',
  templateUrl: './retornados.component.html',
  styleUrls: ['./retornados.component.css']
})
export class RetornadosComponent implements OnInit {
  isLoggedIn = false
  roles: string[] = []
  allData: Array<any> = []
  total: number = 0
  loading: boolean = false
  pedidos: Array<any> = []
  actionText: string = "Resolver"
  currentPedido: Pedido | undefined
  currentFile: FileDB | undefined

  constructor(private service: PedidoService, private msg: NzMessageService, private _router: Router, 
    private tokenService: TokenStorageService) { }

  ngOnInit() {
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
    this.service.getPedidos("rechazado") // POR UN CONST STATE RECHAZADO!
    .subscribe(pedidos => {
      this.allData = pedidos
      this.total = pedidos.length
      this.pedidos = pedidos.map((p) => ({ ...p, showMore: false }))        
      this.loading = false
    })
  };

  onClickAction (pedido: Pedido): void {
    this._router.navigateByUrl('/pedidos' + `/${pedido.id}`) 
  }

  cleanPedidoAndFile(myPackage: {pedido: Pedido | undefined, file: FileDB | undefined}) {
    this.currentFile = myPackage.file
    this.currentPedido = myPackage.pedido
  };

  manageOuputOnClickWatch = (item: any) => {
    this.currentFile = item; 
  };

}
