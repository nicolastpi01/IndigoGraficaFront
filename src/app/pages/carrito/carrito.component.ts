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
import { avatarStyle, determineIcon, toLocalDateString, badgeUponImagePositionStyle, badgeColorStyle } from 'src/app/utils/functions/functions';
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

  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()

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

    console.log("CURRENT COMMENT :", comentario)
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
    console.log("CLick Eliminar")
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

  estaEditando = () :boolean => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentPedido?.interacciones)) 
      let last: Interaccion | undefined = InteraccionesCP.pop()
    return this.currentPedido !== undefined && this.currentPedido.interacciones !== undefined 
    && last !== undefined && last.rol === 'USUARIO'
  }

  showNoResult = () :string | TemplateRef<void> => {
    return 'no hay comentarios con el Editor, dejále un comentario!'
  }

  disabledEliminarComment = () => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentPedido?.interacciones)) 
      // Obtengo el último elem. de la copia de las interacciones
      let last: Interaccion | undefined = InteraccionesCP.pop() 
    return (this.currentPedido && this.currentPedido.interacciones && this.currentPedido.interacciones.length === 0)
    || (this.currentPedido && this.currentPedido.interacciones && last && last.rol === 'EDITOR')
  };

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

  /*
  handleOkModalResponse = () => {
    if(this.currentComment && this.textAreaValue) {      
      let lastInteraccion = this.searchLastInteraccion(); // Si esta al reves deberiamos verificar al principio

      if(lastInteraccion?.rol === 'EDITOR') {
        this.currentComment.interacciones.pop();
      }
      let response: Interaccion = {
        texto: this.textAreaValue,
        rol: 'EDITOR',
        key: this.currentComment.interacciones.length // revisar esto
      };

      this.currentComment = {
        ...this.currentComment, respondido: true
      }

      this.currentComment.interacciones = [
        ...this.currentComment.interacciones,
        response 
      ];

      if(this.currentFile) {
        this.currentFile = {
          ...this.currentFile, comentarios: this.currentFile?.comentarios.map((comentario: Comentario) => {
            if(comentario.id === this.currentComment?.id && this.currentComment) {
              return this.currentComment 
            }
            else {
              return comentario
            }
          })
        }
      };
      this.currentPedido = {
        ...this.currentPedido, files: this.currentPedido?.files?.map((file: FileDB) => {
          if(file.id === this.currentFile?.id && this.currentFile) {
            return this.currentFile 
          }
          else {
            return file
          }
        })
      };
      
      this.service.update(this.currentPedido).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => {
            let pedido = (e.body as Pedido)
            this.currentPedido = pedido;
            this.currentFile = pedido.files?.find((file: FileDB) => file.id === this.currentFile?.id)
            if(this.currentFile) {
              this.currentFile = {
                ...this.currentFile, url: this.generateUrl(this.currentFile) 
              }
            };
            this.currentComment = this.currentFile?.comentarios.find((comentario: Comentario) => comentario.id === this.currentComment?.id)
            this.msg.success('Se agrego la respuesta correctamente!');
            this.handleCancelModalResponse()
        }),
        () => {
            this.msg.error('No se pudo agregar la respuesta, vuelva a intentarlo en unos segundos');
        }
    }; 
  };
  */

  onClickChat(pedido: Pedido): void {
    this.currentPedido = pedido;
    /*
    this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
      return {
        ...file, url: this.generateUrl(file)
      }
    });
    */
    //console.log("PEDIDO", pedido)
    this.isVisibleModalChat = true;
  }

  generateUrl = (file: FileDB) :string => {
    return 'data:' + file.type + ';base64,' + file.data
  };

  tieneDimension = () => {
    return this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0
  };

  handleCancelChat() : void {
    this.isVisibleModalChat = false;
  }

  handleOkChat(): void {
    this.isVisibleModalChat = false;
  }

  handleCancelFilesChat() : void {
    this.isVisibleModalFilesChat = false;
  }

  handleOkFilesChat(): void {
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
