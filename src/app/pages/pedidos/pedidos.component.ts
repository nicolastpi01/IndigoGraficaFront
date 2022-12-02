import { Component, HostBinding, OnInit } from '@angular/core';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from '../../services/pedido.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileDB } from 'src/app/interface/fileDB';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})

export class PedidosComponent implements OnInit {

  count: number = 2
  index: number = 0
  index2: number = 2
  loadingMore: boolean = false
  isVisibleFilesModal: boolean = false
  loadingAccion: boolean = false
  
  
  @HostBinding('class.is-open')
  isOpen = false;
  allData: Array<any> = []


  total: number = 0
  actionText: string = "Reservar"
  currentPedido: Pedido | undefined
  currentFile: FileDB | undefined
  loading: boolean = false
  pedidos: Array<any> = []
  roles: string[] = []
  isLoggedIn = false
  
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

  isEditor = () :boolean => {
    return this.roles.includes('ROLE_ENCARGADO')
  };

  getPedidos(): void {
    this.loading = true
    let token :string = this.tokenService.getToken()
    this.service.getAllPedidos(token)
    .subscribe(pedidos => {
      this.allData = pedidos
      this.total = pedidos.length
      this.pedidos = pedidos.map((p) => ({ ...p, showMore: false }))
      //this.pedidos = pedidos.map((p) => ({ ...p, showMore: false })).slice(this.index, this.index2);        
      this.loading = false
    })
  };

  onClickAction (pedido: Pedido): void {
      if(pedido.isEditing) {
        this.msg.error("No puede reservar el Pedido en este momento, ya que el Cliente lo esta Editando")
      }
    else {
      if(this.isEditor()) {
        //this.loadingAccion = true
        let token :string = this.tokenService.getToken()
        this.service.reservar(pedido, token)
        .subscribe({
          next: (_) => {
            this.msg.success('Reservado exitosamente!');
            this.service.toggle()
            this.pedidos = this.pedidos.filter((p: Pedido) => p.id !== pedido.id) // Saco el que se reservo!
            if(this.pedidos.length === 0) {
              this.msg.loading("redireccionando...");
              setTimeout(() => {
                this._router.navigateByUrl("/reservados")
              }, 1000);
            }
          },
          error: (err) => {
            this.msg.error(err.error.message)
          }
        })
          //this.getPedidos()
          //this.loadingAccion = false feedback del front
          /*
          setTimeout(() => {
            this._router.navigateByUrl("/reservados")
          }, 2000);
          */
      }  
    }  
  };

  cleanPedidoAndFile(myPackage: {pedido: Pedido | undefined, file: FileDB | undefined}) {
    this.currentFile = myPackage.file
    this.currentPedido = myPackage.pedido
  };

  manageOuputOnClickWatch = (item: any) => {
    this.currentFile = item; 
  };

  /*

  onClickShowMore(pedido: any) {
    pedido.showMore = !pedido.showMore
  }

  onLoadMore = (event: MouseEvent) => {
    event.preventDefault;
    this.loadingMore = true;
    let index = this.index + this.count
    let index2 = this.index2 + this.count
    
    let slice = this.allData.slice(index, index2) // revisar esto "!!"!""
    this.pedidos = this.pedidos.concat(slice)

    this.index2 = index2;
    this.index = index;
    this.loadingMore = false;
  }
  */

}
