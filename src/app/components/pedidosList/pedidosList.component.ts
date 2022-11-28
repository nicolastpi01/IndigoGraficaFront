import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { Comentario } from "src/app/interface/comentario";
import { Estado } from "src/app/interface/estado";
import { FileDB } from "src/app/interface/fileDB";
import { Pedido } from "src/app/interface/pedido";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { toLocalDateString } from "src/app/utils/functions/functions";
import { getValueOrNot, HeadingData, userData } from "src/app/utils/functions/pedidosData/functions";
import { colorearEstado } from "src/app/utils/pedidos-component-utils";

@Component({
    selector: 'app-pedidosList',
    templateUrl: './pedidosList.component.html',
    styleUrls: ['./pedidosList.component.css']
  })
  export class PedidosListComponent {

    allData: Array<any> = []
    isLoggedIn: boolean = false

    @Input() elements: Array<any> = []
    @Input() total: number = 0
    @Input() loading: boolean = false
    @Input() roles: string[] = []
    @Input() onClickAction: ((pedido: Pedido) => void) | undefined
    @Input() onClickActionText: string = ''

    isVisibleFilesModal: boolean = false
    currentPedido: Pedido | undefined
    currentFile: FileDB | undefined
    @Output('onClickWatch') emitFileOnClickWatch = new EventEmitter<FileDB>();
    @Output('onClickShowFiles') emitOnClickShowFiles = new EventEmitter<{pedido: Pedido, file: FileDB | undefined}>();
    @Output('onClickCancelModal') emitOnClickCancelModal = new EventEmitter<{pedido: Pedido | undefined, file: FileDB | undefined}>();

    // IMPORTS
    toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString
    colorear :(state: Estado) => string | undefined = colorearEstado
    userData: HeadingData[] = userData
    getValueOrNot : (headData: HeadingData, pedido: any) => any = getValueOrNot

    constructor(private msgService: NzMessageService, private _router: Router, 
      private tokenService: TokenStorageService) {}

    showTotal = (total: number) => {
      if(total > 0) return `#Total: ${total}`
      else return ''
    }

    onClickShowMore(pedido: any) {
      pedido.showMore = !pedido.showMore
    }

    isEditor = () :boolean => {
      return this.roles.includes('ROLE_ENCARGADO')
    }

    onClickWatch = (file: any) => {
      this.currentFile = file;
      console.log("CURRENT FILE: ", this.currentFile)
      this.emitFileOnClickWatch.emit(file) 
    };

    onClickShowFiles = (pedido: Pedido) => {
      this.isVisibleFilesModal = true
      this.currentPedido = pedido;
      this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
        return {
          ...file, url: this.generateUrl(file)  //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
        }
      });
      this.currentFile = this.currentPedido.files? this.currentPedido.files[0] : undefined 
      this.emitOnClickShowFiles.emit({
        pedido: this.currentPedido, 
        file: this.currentFile
      }) 
    };

    generateUrl = (file: FileDB) :string => {
      return 'data:' + file.type + ';base64,' + file.data
    };

    badgeUponImageStyle = (comentario: Comentario) => {
      return {
        position: 'absolute', 
        left: comentario.x.toString() + 'px', 
        top: comentario.y.toString() + 'px'
      }
    };

    onCancelModal() {
      this.currentFile = undefined
      this.currentPedido = undefined
      this.isVisibleFilesModal = false
      this.emitOnClickCancelModal.emit({
        pedido: this.currentPedido,
        file: this.currentFile
      })
    };

  }