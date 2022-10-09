import { Component, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Color } from 'src/app/interface/color';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { FileDB } from 'src/app/interface/fileDB';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { RESERVADO } from 'src/app/utils/const/constantes';
import { avatarStyle, determineIcon, toLocalDateString, badgeUponImagePositionStyle, badgeColorStyle, toFullDate } from 'src/app/utils/functions/functions';
import { fallback } from 'src/app/utils/const/constantes';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { formatDistance } from 'date-fns';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  pageIndex: number = 1; 
  total: number = 0;
  pedidos: any[] = [];
  currentPedido: Pedido | undefined; 
  currentFile: FileDB | undefined;
  currentComment: Comentario | undefined;

  loadingSearch: boolean = false;
  loading: boolean = false;
  isVisibleModalMoreInfo: boolean = false;
  isVisibleModalChat: boolean = false;
  isVisibleModalFilesChat: boolean = false;
  isVisibleModalFileComments: boolean = false;
  indeterminate = true;
  
  allChecked = false;
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false }
  ];
  dateFormat = 'dd/MM/YYYY';

  expanded: boolean = false;

  expandedId: boolean = false;

  userCommentValue: string = '';
  tabs: Array<{ name: string, icon: string, title: string }> = [];

  fallback: string = fallback;

  toFullDate : (date: Date | any) => string = toFullDate;
  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString;
  determineIcon: (interaccion: Interaccion) => "user" | "highlight" = determineIcon;
  avatarStyle: (interaccion: Interaccion) => { 'background-color': string; } = avatarStyle;
  colorear :(descripcion: string) => string | undefined = colorearEstado;
  badgeUponImagePositionStyle: (comentario: Comentario) => { position: string; left: string; top: string; } = badgeUponImagePositionStyle;
  badgeColorStyleFunction: ()  => {
    backgroundColor: string;
  } = badgeColorStyle;
    
  time = formatDistance(new Date(), new Date());
  AccionText: String = "Editar"

  constructor(private _router: Router, private service: PedidoService, private fb: FormBuilder, private modal: NzModalService) { }

  ngOnInit(): void {
    this.tabs = [
      {
        name: 'Info',
        icon: 'gift',
        title: 'Datos'
      },
      {
        name: 'archivos',
        icon: 'file',
        title: 'Archivos'
      }
    ];
    this.getPedidos()
  }

  getPedidos(): void {
    this.loading = true
    this.service.getPedidos('Pendiente atencion')
    .subscribe(pedidos => {
       this.pedidos = pedidos.map((pedido: Pedido) => {
        return {
          ...pedido, 
          expandedId : false,
          expandedTitle: false,
          files : pedido.files?.map((file: FileDB) => {
            return {
              ...file, url: this.generateUrl(file)
            }
          })
        }
       })
       this.total = pedidos.length
       this.loading = false
       //if(pedidos.length > 0) this.currentPedido = pedidos[0]; 
    });
  }

  onClickTab = () => {
    //console.log("Click Tab")
  };

  onClickShowFileComments = (event: MouseEvent, item: FileDB) => {
    event.preventDefault;
    this.currentFile = item; 
    this.isVisibleModalFileComments = true;
  }

  onClickComment = (event: MouseEvent, comentario: Comentario) => {
    event.preventDefault;
    this.currentComment = comentario;
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(comentario.interacciones))
    let last: Interaccion | undefined =  InteraccionesCP.pop()
    if (last && last.rol === 'USUARIO') {
      this.userCommentValue = last.texto
    };
    this.isVisibleModalFilesChat = true;    
  }

  onChangeCheck = (event: boolean, comentario: Comentario) => {
    comentario.terminado = event;
  };

  handleCancelResolver = () => {
    this.isVisibleModalFileComments = false;
  }

  handleOkResolver = () => {
    this.isVisibleModalFileComments = false;
  }

  onChangeUserComment = (value: string) => {
    this.userCommentValue = value;
  }

  handleClickEliminarComment = () => {
    if(this.currentPedido && this.currentPedido.interacciones) {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentPedido.interacciones))
      InteraccionesCP.pop()
      this.currentPedido.interacciones = InteraccionesCP
      this.userCommentValue = ''

      this.pedidos = this.pedidos.map((pedido: any) => {
        if(pedido.id === this.currentPedido?.id) { // No modificar directamente los pedidos sino que usar copias
          return this.currentPedido
        }
        else {
          return pedido
        }
      });
    }
  }

  deleteInteractionForAFileWithComments = () => {
    if(this.currentComment && this.currentComment.interacciones) {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentComment.interacciones))
      InteraccionesCP.pop()
      // Esto se puede hacer una vez se llame al servicio
      this.currentComment = {
        ...this.currentComment, interacciones: InteraccionesCP 
      }
      this.userCommentValue = ''
      // Actualizar Current File
      // Actualizar Current Pedido
      // Actualizar Pedidos
    }
  };

  disabledInteractionDeletedButton = (algoConInteracciones: any) => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(algoConInteracciones?.interacciones)) 
      // Obtengo el último elem. de la copia de las interacciones
      let last: Interaccion | undefined = InteraccionesCP.pop() 
    return (algoConInteracciones && algoConInteracciones.interacciones && algoConInteracciones.interacciones.length === 0)
    || (algoConInteracciones && algoConInteracciones.interacciones && last && last.rol === 'EDITOR')
    
  };

  isEditing = (algoConInteracciones: any) :boolean => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(algoConInteracciones?.interacciones)) 
      let last: Interaccion | undefined = InteraccionesCP.pop()
    return algoConInteracciones !== undefined && algoConInteracciones.interacciones !== undefined 
    && last !== undefined && last.rol === 'USUARIO'
  }

  showNoResult = () :string | TemplateRef<void> => {
    return 'no hay comentarios con el Editor, dejále un comentario!'
  }

  /*
  disabledEliminarComment = () => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentPedido?.interacciones)) 
      // Obtengo el último elem. de la copia de las interacciones
      let last: Interaccion | undefined = InteraccionesCP.pop() 
    return (this.currentPedido && this.currentPedido.interacciones && this.currentPedido.interacciones.length === 0)
    || (this.currentPedido && this.currentPedido.interacciones && last && last.rol === 'EDITOR')
  };
  */

  itemListStyle = (interaccion: Interaccion, item: any) => {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(item.interacciones)) 
      let last: Interaccion | undefined = InteraccionesCP.pop()
      let ret :boolean = false
      if(last) {
        if(interaccion.key) {
          ret = interaccion.key === last.key
        }
        else {
          ret = interaccion.id === last.id
        }
      }
      if(ret && interaccion.rol === 'USUARIO') {
        return {
          'border-color': 'rgb(247, 251, 31)',
          'border-width': '2px',
          'border-style': 'dashed'
        } 
      }
      else {
        return ''
      }
  };

  handleClickSendInteractionButton = () => {
    
    if(this.currentComment && this.currentComment.interacciones && this.userCommentValue !== '') {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentComment.interacciones)) 
      let lastInteraccion: Interaccion | undefined = InteraccionesCP.pop() 

      if(lastInteraccion?.rol === 'USUARIO') this.currentComment.interacciones.pop();
      
      let response: Interaccion = {
        texto: this.userCommentValue,
        rol: 'USUARIO',
        key: this.currentComment.interacciones.length 
      };

      this.currentComment = {
        ...this.currentComment, interacciones: [...this.currentComment.interacciones, response] 
      }
      if(this.currentFile) {
        this.currentFile = {
          ...this.currentFile, comentarios: this.currentFile.comentarios.map((comentario: Comentario) => {
            if(this.currentComment && comentario.id === this.currentComment.id) {
              return this.currentComment
            }
            else {
              return comentario
            }
          })
        }
      };
      if(this.currentPedido) {
        this.currentPedido = {
          ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
            if(this.currentFile && file.id === this.currentFile.id) {
              return this.currentFile
            }
            else {
              return file
            }
          })
        }
      };
      this.pedidos = this.pedidos.map((pedido: any) => {
        if(pedido.id === this.currentPedido?.id) { 
          return this.currentPedido
        }
        else {
          return pedido
        }
      });
    }
  };

 

  handleClickAceptar = () => {
    
    if(this.currentPedido && this.currentPedido.interacciones && this.userCommentValue !== '') {
      // Copio las interacciones
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentPedido.interacciones)) 
      // Obtengo el último elem. de la copia de las interacciones
      let lastInteraccion: Interaccion | undefined = InteraccionesCP.pop() 

      // Si la última interacción es del Usuario, entonces estoy editando, entonces quito la última, 
      // sino la última interacción es del Editor entonces la dejo
      if(lastInteraccion?.rol === 'USUARIO') { 
        this.currentPedido.interacciones.pop();
      }
      let response: Interaccion = {
        texto: this.userCommentValue,
        rol: 'USUARIO',
        key: this.currentPedido.interacciones.length // revisar esto
      };
      // Agrego la nueva respuesta del Usuario
      //this.currentPedido = {
      //  ...this.currentPedido, interacciones : [...this.currentPedido.interacciones, response]
      //}
      this.currentPedido.interacciones = [ // No modificar directamente las interacciones sino que usar copias
        ...this.currentPedido.interacciones,
        response 
      ];

      // Agrego de nuevo el CurrentPedido (acabo de modificarlo) a la lista de Pedidos
      this.pedidos = this.pedidos.map((pedido: any) => {
        if(pedido.id === this.currentPedido?.id) { // No modificar directamente los pedidos sino que usar copias
          return this.currentPedido
        }
        else {
          return pedido
        }
      });
    }
  };

  onClickChat(pedido: Pedido): void {
    this.currentPedido = pedido;
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(pedido.interacciones)) 
    let last: Interaccion | undefined = InteraccionesCP.pop() 
    if(last?.rol === 'USUARIO') {
      let lastInteraction : Interaccion | undefined =  pedido.interacciones?.pop() 
      if(lastInteraction) this.userCommentValue = lastInteraction.texto;  
    }
    this.isVisibleModalChat = true;
  };

  generateUrl = (file: FileDB) :string => {
    return 'data:' + file.type + ';base64,' + file.data
  };

  tieneDimension = () => {
    return this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0
  };

  handleCancelChat() : void {
    this.userCommentValue = ''
    this.isVisibleModalChat = false;
  }

  handleOkChat(): void {
    this.userCommentValue = ''
    this.isVisibleModalChat = false;
  }

  handleCancelFilesChat() : void {
    this.userCommentValue = ''
    this.isVisibleModalFilesChat = false;
  }

  handleOkFilesChat(): void {
    this.userCommentValue = ''
    this.isVisibleModalFilesChat = false;
  }

  handleCancelMoreInfo() : void {
    this.isVisibleModalMoreInfo = false;
  };

  onExpandedChangeTitle = (pedido: any) => {
    pedido.expandedTitle = true;
  }

  onExpandedChangedId= (pedido: any) => {
    pedido.expandedId = true;
  }

  onClickEdit(pedido: Pedido) : void {
    this._router.navigateByUrl('/pedidos/editar' + `/${pedido.id}`)
  };

  handleOkMoreInfo() : void {
    this.isVisibleModalMoreInfo = false;
  };

  onClickFile(): void {
    //this._router.navigateByUrl('/usuariocomentarios' + `/${this.currentPedido?.id}`)
    
  }

  pedidoColores = () :Color[]  => {
    if(this.currentPedido && this.currentPedido.colores) return this.currentPedido.colores
    if(this.currentPedido && this.currentPedido.tipo && this.currentPedido.tipo.colores) return this.currentPedido.tipo.colores
    else return [] 
  };

  onClickMoreInfo(event: MouseEvent, pedido: Pedido): void {
    event.preventDefault;
    this.currentPedido = pedido;
    this.isVisibleModalMoreInfo = true   
  }

  showDeleteConfirm(pedido: any): void {

    this.modal.confirm({
      nzTitle: `<b style="color: red;">Eliminar</b>`,
      nzContent: `Está seguro de querer eliminar el pedido con id: ${pedido.id} ?.`,
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onOkDeleteConfirm(pedido),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  onOkDeleteConfirm = (pedido: any) => {
    this.pedidos = this.pedidos.filter((p: any) => p.id !== pedido.id)
  };

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  onClickAccion (pedido: Pedido): void {
    this._router.navigateByUrl('/nuevo' + `/${pedido.id}`)
  }

  eliminar ():void {

  }

  indexChange($event: any){
    let newIndex = parseInt($event);
    this.pageIndex = newIndex;
    let newPedido = this.pedidos[newIndex-1];
    if(newPedido) this.currentPedido = newPedido;
  }

}
