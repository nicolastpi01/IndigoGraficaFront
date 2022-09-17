import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Comentario } from 'src/app/interface/comentario';
import { FileDB } from 'src/app/interface/fileDB';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { RESERVADO, REVISION } from 'src/app/utils/const/constantes';
import { badgeColorStyle, toLocalDateString } from 'src/app/utils/functions/functions';
import { getValueOrNot, HeadingData, userData } from 'src/app/utils/functions/pedidosData/functions';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';

@Component({
  selector: 'app-reservados',
  templateUrl: '../reservados/reservados.component.html',
  styleUrls: ['../reservados/reservados.component.css']
})
export class ReservadosComponent implements OnInit {

  userData: HeadingData[] = userData
  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString
  getValueOrNot : (headData: HeadingData, pedido: any) => any = getValueOrNot
  badgeColorStyleFunction: ()  => {
    backgroundColor: string;
  } = badgeColorStyle
  

  count: number = 2;
  index: number = 0;
  index2: number = 2;
  accionText = 'Resolver'
  pedidos: any[] = []
  allData: Array<any> = []
  isVisibleFilesModal: boolean = false;
  colorear :(descripcion: string) => string | undefined = colorearEstado
  loading: boolean = false
  AccionText: String = "Resolver"
  loadingMore: boolean = false;

  currentFile: any 
  total: number = 0;
  currentPedido: any;

  constructor(private service: PedidoService,  private msg: NzMessageService, private _router: Router) { }

  ngOnInit(): void {
    this.getPedidos()
  }

  onCancelModal() {
    this.currentFile = undefined;
    this.currentPedido = undefined;
    this.isVisibleFilesModal = false;
  }

  badgeUponImageStyle = (comentario: Comentario) => {
    return {
      position: 'absolute', 
      left: comentario.x.toString() + 'px', 
      top: comentario.y.toString() + 'px'
    }
  };

  onClickWatch = (event: MouseEvent, item: any) => {
    event.preventDefault;
    this.currentFile = item; 
  };

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

  getPedidos(): void {
    this.service.getPedidos(RESERVADO)
    .subscribe(pedidos => {

      this.allData = pedidos
      this.total = pedidos.length
      this.pedidos = pedidos.map((p) => ({ ...p, showMore: false })) 
      //this.pedidos = pedidos.map((p) => ({ ...p, showMore: false })).slice(this.index, this.index2); 
    });
  }

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


  onClickAccion (pedido: Pedido): void {
    this._router.navigateByUrl('/pedidos' + `/${pedido.id}`)
  }


}
