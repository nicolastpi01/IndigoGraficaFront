import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PedidoService } from 'src/app/services/pedido.service';
import { filter } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { formatDistance } from 'date-fns';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';

@Component({
  selector: 'app-resolver',
  templateUrl: './resolver.component.html',
  styleUrls: ['./resolver.component.css']
})

export class ResolverComponent implements OnInit {

  currentPedido: Pedido | undefined;
  currentFile: FileDB | undefined;
  currentComment: Comentario | undefined;
  id!: string | null;
  interaccionForResponse: Interaccion | undefined;
  textAreaValue: string | undefined;
  
  isVisibleModalComment = false;
  isVisibleModalChat = false;
  isVisibleModalResponse: boolean = false;
  disabledResponseTextArea: boolean = false;

  panels: Array<{active: boolean, name: string, disabled: boolean}> = [];
  tabs: Array<{ name: string, icon: string, title: string }> = [];



  time = formatDistance(new Date(), new Date());
  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()
  defaultFileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'yyy.png',
      status: 'error'
    }
  ];
  fileList1 = [...this.defaultFileList];

  constructor(private route: ActivatedRoute, private service :PedidoService, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getPedido();
    this.panels = [
      {
        active: true,
        name: 'Datos',
        disabled: false
      },
      {
        active: false,
        disabled: false,
        name: 'Files'
      },
      {
        active: false,
        disabled: false,
        name: 'Solucion'
      }
    ];
    this.tabs = [
      {
        name: 'Pedido',
        icon: 'gift',
        title: 'Info del pedido'
      },
      {
        name: 'Usuario',
        icon: 'user',
        title: 'Info del usuario'
      }
    ];
  };

  colorear :(descripcion: string) => string | undefined = colorearEstado
  
  onChangeTextArea = (value: string) :void => {
    this.textAreaValue = value;
  };

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
            this.disabledResponseTextArea = true;
            this.msg.success('Se agrego la respuesta correctamente!');
        }),
        () => {
            this.msg.error('No se pudo agregar la respuesta, vuelva a intentarlo en unos segundos');
        }
      this.isVisibleModalResponse = false;
    }; 
  };

  handleCancelModalResponse = () => {
    let last = this.searchLastInteraccion();
    if (last?.rol === 'EDITOR') {
      this.textAreaValue = last?.texto
      this.disabledResponseTextArea = true;
    }
    else {
      this.textAreaValue = undefined;
    } 
    this.isVisibleModalResponse = false;
  };

  
  sePuedeResponder = (interaccion: Interaccion) => {
    if(this.interaccionForResponse) {
      return this.interaccionForResponse.id === interaccion.id
    }
    else {
      let last: Interaccion | undefined = this.searchLastInteraccion();
      // Se puede responder si es la ultima interacción y ademas, es del usuario
      //return last && last.id === interaccion.id && interaccion.rol === 'USUARIO'
      return last && last.key === interaccion.key && interaccion.rol === 'USUARIO'
    }
  };
  
  responderInteraccion = (event: Event, interaccion: Interaccion) => {
    event.preventDefault;
    this.interaccionForResponse = interaccion;
    this.isVisibleModalResponse = true;
    // Si esta al reves deberiamos verificar al principio  
  };

  tieneRtaCurrentComment = () :boolean => {
    let last = this.searchLastInteraccion(); 
    return last?.rol === 'EDITOR'
  };

  determineIcon = (interaccion: Interaccion) => {
    if(interaccion.rol === 'USUARIO') {
      return "user"
    }
    else {
      return "highlight"
    }
  };

  onChangeCheck = (event: boolean, comentario: Comentario) => {
    comentario.terminado = event;
  };

  avatarStyle = (interaccion: Interaccion) => {
    if(interaccion.rol === 'USUARIO') {
      return {
        'background-color':'#87d068'
      }
    }
    else {
      return {
        'background-color': '#f56a00'
      }
    }
  };

  setHabilitarRespuesta = () => {
    this.disabledResponseTextArea = !this.disabledResponseTextArea;
  };

  getPedido(): void {
    this.service.getPedido(this.id)
    .subscribe((pedido) => { // revisar el any
        //this.currentPedido = e.body as Pedido
        this.currentPedido = pedido;
        this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
          return {
            ...file, url: this.generateUrl(file)  //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
          }
        });
    })
  };

  generateUrl = (file: FileDB) :string => {
    return 'data:' + file.type + ';base64,' + file.data
  };

  onClickComment = (event: MouseEvent, item: FileDB) => {
    event.preventDefault;
    this.currentFile = item; 
    this.isVisibleModalComment = true;
  };

  onClickChat = (event: MouseEvent, comentario: Comentario) => {
    event.preventDefault;
    this.currentComment = comentario;
    // if hay response previa entonces pongo en el texto la rta
    //if(this.tieneRtaCurrentComment() && !this.textAreaValue) {
    let last = this.searchLastInteraccion(); 
    if (last?.rol === 'EDITOR') {
      this.textAreaValue = last?.texto
      this.disabledResponseTextArea = true;
    }; 
    this.isVisibleModalChat = true;
  };

  handleCancelChat = () => {
    let lastInteraccion = this.searchLastInteraccion();
    if(lastInteraccion?.rol === 'EDITOR' && lastInteraccion.id === undefined) {
      this.currentComment?.interacciones.pop(); // Si la ultima interacción no se persistio y es Editor lo saco
    }
    this.isVisibleModalChat = false;
  };

  handleOkChat = () => {
    this.isVisibleModalChat = false;
  };

  searchLastInteraccion = ():  Interaccion | undefined => {
    return this.currentComment?.interacciones.find((_: Interaccion, index: number) => index+1 === this.currentComment?.interacciones.length)
  } 

  badgeUponImagePositionStyle = (comentario: Comentario) => {
    return {
      position: 'absolute', 
      left: comentario.x.toString() + 'px', 
      top: comentario.y.toString() + 'px',
    }; 
  };

  badgeColorStyle = () : { backgroundColor: string; } => {
    return {
      'backgroundColor': '#e95151'
    }
  };

  handleOkResolver = () => {
    if(this.currentPedido) {
      this.currentPedido = {
        ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
          if(file.id === this.currentFile?.id && this.currentFile) {
            return this.currentFile;
          }
          else {
            return file;
          }
        })
      }
      this.service.update(this.currentPedido).
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
            this.msg.success('Se marcaron los comentarios!');
        }),
        () => {
            this.msg.error('Hubo un error, no se pudieron marcar los comentarios');
        }
    };
    
  };

  handleCancelResolver = () => {
    this.getPedido(); // revisar esto !
    this.isVisibleModalComment = false;
  };

}
