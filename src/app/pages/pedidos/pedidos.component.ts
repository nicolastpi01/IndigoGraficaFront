import { Component, HostBinding, OnInit } from '@angular/core';
import { Pedido } from 'src/app/interface/pedido';
import { PENDIENTEATENCION } from 'src/app/utils/const/constantes';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { PedidoService } from '../../services/pedido.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileDB } from 'src/app/interface/fileDB';
import { Comentario } from 'src/app/interface/comentario';
import { badgeColorStyle, toLocalDateString } from 'src/app/utils/functions/functions';
import { toArray } from 'ng-zorro-antd/core/util';
import { getValueOrNot, HeadingData, userData } from 'src/app/utils/functions/pedidosData/functions';
import { Router } from '@angular/router';
import { Estado } from 'src/app/interface/estado';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  getValueOrNot : (headData: HeadingData, pedido: any) => any = getValueOrNot
  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()
  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString
  userData: HeadingData[] = userData
  badgeColorStyleFunction: ()  => {
    backgroundColor: string;
  } = badgeColorStyle

  count: number = 2;
  index: number = 0;
  index2: number = 2;
  accionText = 'Reservar'
  //array = new Array(this.count);
  loadingMore: boolean = false;
  //loadingCard: boolean = false;
  isVisibleFilesModal: boolean = false;
  colorear :(state: Estado) => string | undefined = colorearEstado
  loadingAccion: boolean = false
  loading: boolean = false
  AccionText: String = "Reservar"
  currentPedido: Pedido | undefined
  currentFile: any 
  @HostBinding('class.is-open')
  isOpen = false;

  pedidos: Array<any> = []
  allData: Array<any> = []
  total: number = 0;
  


  constructor(private service: PedidoService,  private msg: NzMessageService, private _router: Router) { }

  ngOnInit() {
    this.getPedidos()
    //this.service.change.subscribe((isOpen: any) => {
    //  this.isOpen = isOpen;
      //this.getPedidos()
    //});
  }

  getPedidos(): void {
    this.loading = true
    this.service.getPedidos('pendAtencion')
    .subscribe(pedidos =>{
      this.allData = pedidos
      this.total = pedidos.length
      this.pedidos = pedidos.map((p) => ({ ...p, showMore: false }))
      //this.pedidos = pedidos.map((p) => ({ ...p, showMore: false })).slice(this.index, this.index2);        
      this.loading = false
    })
  };

 // `Está seguro de querer eliminar el pedido con id: ${pedido.id} ?.`
  showTotal = (total: number) => {
    if(total > 0) return `#Total: ${total}`
    else return ''
  };
    
  badgeUponImageStyle = (comentario: Comentario) => {
    return {
      position: 'absolute', 
      left: comentario.x.toString() + 'px', 
      top: comentario.y.toString() + 'px'
    }
  };

  onClickShowMore(pedido: any) {
    pedido.showMore = !pedido.showMore
  }

  /*
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

  generateUrl = (file: FileDB) :string => {
    return 'data:' + file.type + ';base64,' + file.data
  };

  onClickShowFiles(pedido: Pedido) {
    //this.loadingCard = true
    this.currentPedido = pedido;
    this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
      return {
        ...file, url: this.generateUrl(file)  //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
      }
    });
    this.currentFile = this.currentPedido.files? this.currentPedido.files[0] : undefined 
    this.isVisibleFilesModal = true;
    //this.loadingCard = false
  };
    /*
    this.currentPedido = pedido;
        this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
          return {
            ...file, url: this.generateUrl(file)  //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
          }
        });
    */

  handleAfterClose(event: EventInit) {
    this.currentPedido = undefined;
  }

  onCancelModal() {
    this.currentFile = undefined;
    this.currentPedido = undefined;
    this.isVisibleFilesModal = false;
  }

  onClickWatch = (event: MouseEvent, item: any) => {
    event.preventDefault;
    this.currentFile = item; 
  };

  onClickAccion (pedido: Pedido): void {
    this.loadingAccion = true
    this.service.reservar(pedido)
    .subscribe((_) => {
       this.msg.success('Reservado exitosamente!');
       this.service.toggle()
       this.getPedidos()
       this.loadingAccion = false
       setTimeout(() => {
        //console.log("Hola Mundo");
        this._router.navigateByUrl("/reservados")
    }, 2000);
        
    })
  }

}
