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
import { avatarStyle, determineIcon, toLocalDateString, badgeUponImagePositionStyle, badgeColorStyle, toFullDate, showNoResultTextChatFor } from 'src/app/utils/functions/functions';
import { fallback } from 'src/app/utils/const/constantes';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { formatDistance } from 'date-fns';
import { ThisReceiver } from '@angular/compiler';
import { HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { PerfilInfo } from 'src/app/components/chat/chat.component';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  //pageIndex: number = 1;
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
  /*
  indeterminate = true;
  allChecked = false;
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false }
  ];
  */
  dateFormat = 'dd/MM/YYYY';
  expanded: boolean = false;
  expandedId: boolean = false;
  userCommentValue: string = '';
  tabs: Array<{ name: string, icon: string, title: string }> = [];
  fallback: string = fallback;
  time = formatDistance(new Date(), new Date());
  AccionText: String = "Editar"

  ChatNoResultMessage: string = showNoResultTextChatFor('Editor'); 
  toFullDate : (date: Date | any) => string = toFullDate;
  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString;
  determineIcon: (interaccion: Interaccion) => "user" | "highlight" = determineIcon;
  avatarStyle: (interaccion: Interaccion) => { 'background-color': string; } = avatarStyle;
  colorear :(descripcion: string) => string | undefined = colorearEstado;
  badgeUponImagePositionStyle: (comentario: Comentario) => { position: string; left: string; top: string; } = badgeUponImagePositionStyle;
  badgeColorStyleFunction: ()  => {
    backgroundColor: string;
  } = badgeColorStyle;
  
  constructor(private _router: Router, private service: PedidoService, 
    private fb: FormBuilder, private modal: NzModalService, private msg: NzMessageService, private tokenService: TokenStorageService) { }

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
    let token :string = this.tokenService.getToken()
    this.service.getPedidosPorUsuario(token)
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
    });
  }

  getPerfil :PerfilInfo = {
    title: "Charla con el Editor!",
    label: "USUARIO",
    icon: "user",
    hexColor: "background-color: #87d068"
  };

  onClickTab = () => {
    //console.log("Click Tab")
  };

  onClickShowFileComments = (event: MouseEvent, item: FileDB, pedido: Pedido) => {
    event.preventDefault;
    this.currentFile = item;
    this.currentPedido = pedido; 
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
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido))
      pedidoCp.interacciones = InteraccionesCP
      this.service.update(pedidoCp).
          pipe(filter(e => e instanceof HttpResponse))
          .subscribe(async (e: any) => {
              let pedido = (e.body as Pedido)
              this.currentPedido = pedido;
              this.userCommentValue = '' // Notificar al componente Chat    
              this.currentPedido = {
                ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
                  return {
                    ...file, url: this.generateUrl(file)
                  }
                }) 
              };
              this.pedidos = this.pedidos.map((pedido: any) => {
                if(pedido.id === this.currentPedido?.id) { 
                  return this.currentPedido
                }
                else {
                  return pedido
                }
              });
              this.msg.success('Se elimino el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, no se pudo eliminar el comentario!');
          }
    }
  };

  deleteInteractionForAFileWithComments = () => {
    if(this.currentComment && this.currentComment.interacciones) {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentComment.interacciones))
      let commentCp : Comentario = JSON.parse(JSON.stringify(this.currentComment));
      let fileCp : FileDB = JSON.parse(JSON.stringify(this.currentFile));
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido));
      
      InteraccionesCP.pop()
      commentCp = {
        ...commentCp, interacciones: InteraccionesCP 
      }
      fileCp = {
        ...fileCp, comentarios: fileCp.comentarios.map((comentario: Comentario) => {
          if(commentCp && comentario.id === commentCp.id) {
            return commentCp
          }
          else {
            return comentario
          }
        })
      }; 
      pedidoCp = {
        ...pedidoCp, files: pedidoCp.files?.map((file: FileDB) => {
          if(fileCp && file.id === fileCp.id) {
            return fileCp
          }
          else {
            return file
          }
        })
      };
      this.service.update(pedidoCp).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => {
            let pedido = (e.body as Pedido)
            this.currentPedido = pedido;
            this.userCommentValue = ''
            this.currentPedido = {
              ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
                return {
                  ...file, url: this.generateUrl(file)
                }
              }) 
            };
            this.currentFile = this.currentPedido.files?.find((file: FileDB) => file.id === this.currentFile?.id)
            this.currentComment = this.currentFile?.comentarios.find((comentario: Comentario)=> comentario.id === this.currentComment?.id)
            this.pedidos = this.pedidos.map((pedido: any) => {
              if(pedido.id === this.currentPedido?.id) { 
                return this.currentPedido
              }
              else {
                return pedido
              }
            }); 
            this.msg.success('Se elimino el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error al eliminar el comentario!');
          }
    }
  };

  // desabilito el botón de eliminar si no hay interacciones, o bien si la última interacción es del Editor
  disabledInteractionDeletedButton = (algoConInteracciones: any) => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(algoConInteracciones?.interacciones)) 
    let last: Interaccion | undefined = InteraccionesCP.pop() 
    return (algoConInteracciones && algoConInteracciones.interacciones && algoConInteracciones.interacciones.length === 0) // No hay interacciones
    || (algoConInteracciones && algoConInteracciones.interacciones && last && last.rol === 'EDITOR') // o bién, la última interacción es del editor  
  };

  showNoResult = () :string | TemplateRef<void> => {
    return 'no hay comentarios con el Editor, dejále un comentario!'
  }

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

  handleClickSendInteractionButton = (comment: string) => {

    if(this.currentComment && this.currentComment.interacciones && comment !== '') {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentComment.interacciones)) 
      let lastInteraccion: Interaccion | undefined = InteraccionesCP.pop()
      let commentCp : Comentario = JSON.parse(JSON.stringify(this.currentComment));
      let fileCp : FileDB = JSON.parse(JSON.stringify(this.currentFile));
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido));

      if(commentCp.interacciones) {
        if(lastInteraccion?.rol === 'USUARIO') {
          commentCp.interacciones.pop();
        } 
        let response: Interaccion = {
          texto: comment,
          rol: 'USUARIO',
          key: commentCp.interacciones.length 
        };
        commentCp = {
          ...commentCp, interacciones: [...commentCp.interacciones, response] 
        };
        fileCp = {
          ...fileCp, comentarios: fileCp.comentarios.map((comentario: Comentario) => {
            if(commentCp && comentario.id === commentCp.id) {
              return commentCp
            }
            else {
              return comentario
            }
          })
        };
        pedidoCp = {
          ...pedidoCp, files: pedidoCp.files?.map((file: FileDB) => {
            if(fileCp && file.id === fileCp.id) {
              return fileCp
            }
            else {
              return file
            }
          })
        };
        this.service.update(pedidoCp).
          pipe(filter(e => e instanceof HttpResponse))
          .subscribe(async (e: any) => {
              let pedido = (e.body as Pedido)
              this.currentPedido = pedido;
              this.currentPedido = {
                ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
                  return {
                    ...file, url: this.generateUrl(file)
                  }
                }) 
              };
              this.currentFile = this.currentPedido.files?.find((file: FileDB) => file.id === this.currentFile?.id)
              this.currentComment = this.currentFile?.comentarios.find((comentario: Comentario)=> comentario.id === this.currentComment?.id)
              this.pedidos = this.pedidos.map((pedido: any) => {
                if(pedido.id === this.currentPedido?.id) { 
                  return this.currentPedido
                }
                else {
                  return pedido
                }
              }); 
              this.msg.success('Se agrego el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error al enviar el comentario!');
          }
        }
      }  
  };

  handleClickAceptar = (userComment: string) => {   
    //if(this.currentPedido && this.currentPedido.interacciones && this.userCommentValue !== '') {
    if(this.currentPedido && this.currentPedido.interacciones && userComment !== '') {
      console.log("Me ejecute!!")
      // Copio las interacciones
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentPedido.interacciones)) 
      // Obtengo el último elem. de la copia de las interacciones
      let lastInteraccion: Interaccion | undefined = InteraccionesCP.pop()
      // Copio el current Pedido
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido))
      // Si la última interacción es del Usuario, entonces estoy editando, entonces quito la última, 
      // sino la última interacción es del Editor entonces la dejo
      if(pedidoCp.interacciones) {
        if(lastInteraccion?.rol === 'USUARIO') { 
          pedidoCp.interacciones.pop(); // Modifico la copia del CurrentPedido, no el original
        }
        let response: Interaccion = {
          texto: userComment,
          rol: 'USUARIO',
          key: pedidoCp.interacciones.length
        };
        pedidoCp.interacciones = [ // Mando al server la copia del CurrentPedido
          ...pedidoCp.interacciones,
          response 
        ];
        this.service.update(pedidoCp).
          pipe(filter(e => e instanceof HttpResponse))
          .subscribe(async (e: any) => {
              let pedido = (e.body as Pedido)
              this.currentPedido = pedido;    
              this.currentPedido = {
                ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
                  return {
                    ...file, url: this.generateUrl(file)
                  }
                }) 
              };
              this.pedidos = this.pedidos.map((pedido: any) => {  // Vuelvo a poner el pedido recién modificado en la lista de pedidos
                if(pedido.id === this.currentPedido?.id) { 
                  return this.currentPedido
                }
                else {
                  return pedido
                }
              });
              //this.userCommentValue = userComment; 
              this.msg.success('Se agrego el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, no enviar el comentario!');
          }
      }
    }
  };
  
  isEditing = (algoConInteracciones: any) :boolean => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(algoConInteracciones?.interacciones)) 
      let last: Interaccion | undefined = InteraccionesCP.pop()
    return algoConInteracciones !== undefined && algoConInteracciones.interacciones !== undefined 
    && last !== undefined && last.rol === 'USUARIO'
  }

  onClickChat(pedido: Pedido): void {
    this.currentPedido = pedido;
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(pedido.interacciones)) 
    let last: Interaccion | undefined = InteraccionesCP.pop() 
    if(last?.rol === 'USUARIO') {
      let lastInteraction : Interaccion | undefined =  last; 
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

  handleCloseChat(visible: boolean) : void {
    //this.userCommentValue = ''
    this.isVisibleModalChat = visible;
  }

  /*
  handleOkChat(): void {
    this.userCommentValue = ''
    this.isVisibleModalChat = false;
  }
  */

  handleCloseFilesChat(visible: boolean) : void {
    //this.userCommentValue = ''
    this.isVisibleModalFilesChat = visible;
  }

  /*
  handleCancelFilesChat() : void {
    this.userCommentValue = ''
    this.isVisibleModalFilesChat = false;
  }

  handleOkFilesChat(): void {
    this.userCommentValue = ''
    this.isVisibleModalFilesChat = false;
  }
  */

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

  /*
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
  */

  onOkDeleteConfirm = (pedido: Pedido) => {
      this.service.eliminar(pedido.id).
      pipe(filter(e => e instanceof HttpResponse))
      .subscribe( (e: any) => {
        this.pedidos = this.pedidos.filter((p: any) => p.id !== pedido.id)
        this.total = this.pedidos.length
        this.msg.success(e.body.message);
      }),
      (e: any) => {
          // Ojo, no esta catcheando el error 
          this.msg.error(e.body.message);
      }
  };

  /*
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
  */

  onClickAccion (pedido: Pedido): void {
    this._router.navigateByUrl('/nuevo' + `/${pedido.id}`)
  }

  /*
  indexChange($event: any){
    let newIndex = parseInt($event);
    this.pageIndex = newIndex;
    let newPedido = this.pedidos[newIndex-1];
    if(newPedido) this.currentPedido = newPedido;
  }
  */

}
