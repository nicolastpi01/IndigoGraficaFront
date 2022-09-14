import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PedidoService } from 'src/app/services/pedido.service';
import { filter, last } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { formatDistance } from 'date-fns';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { badgeColorStyle, toLocalDateString } from 'src/app/utils/functions/functions';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-resolver',
  templateUrl: './resolver.component.html',
  styleUrls: ['./resolver.component.css']
})

export class ResolverComponent implements OnInit {

  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString;
  badgeColorStyleFunction: ()  => {
    backgroundColor: string;
} = badgeColorStyle; 

  currentPedido: Pedido | undefined;
  currentFile: FileDB | undefined;
  currentComment: Comentario | undefined;
  id!: string | null;
  //interaccionForResponse: Interaccion | undefined;
  visibleResponse: boolean = false;
  textAreaValue: string | undefined; 
  isVisibleModalComment = false;
  isVisibleModalChat = false;
  
  panels: Array<{active: boolean, name: string, disabled: boolean}> = [];
  tabs: Array<{ name: string, icon: string, title: string }> = [];

  time = formatDistance(new Date(), new Date());
  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()

  defaultFileList: NzUploadFile[] = [];

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

  isDisabledEliminarRespuesta = () => {
    return !this.textAreaValue && this.tieneRtaCurrentComment()
  };

  eliminarRespuesta = () => {
    let last = this.searchLastInteraccion();
    if(last && last.id && last.rol === 'EDITOR') {
      this.currentComment?.interacciones.pop();  
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
          this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
            return {
              ...file, url: this.generateUrl(file)
            }
          });
          this.currentFile = pedido.files?.find((file: FileDB) => file.id === this.currentFile?.id)
          if(this.currentFile) {
            this.currentFile = {
              ...this.currentFile, url: this.generateUrl(this.currentFile) 
            }
          };
          this.currentComment = this.currentFile?.comentarios.find((comentario: Comentario) => comentario.id === this.currentComment?.id)
          this.textAreaValue = undefined; // rep
          this.visibleResponse = false; // rep
          this.msg.success('Se elimino la respuesta correctamente!');
      }),
      () => {
          this.msg.error('No se pudo eliminare la respuesta, vuelva a intentarlo en unos segundos');
      }
    }
    else {
      this.textAreaValue = undefined; // rep
      this.visibleResponse = false; // rep
    }
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
            this.msg.success('Se agrego la respuesta correctamente!');
            this.handleCancelModalResponse()
        }),
        () => {
            this.msg.error('No se pudo agregar la respuesta, vuelva a intentarlo en unos segundos');
        }
    }; 
  };

  

  handleCancelModalResponse = () => {
    /*
    let last = this.searchLastInteraccion();
    if (last?.rol === 'EDITOR') {
      this.textAreaValue = last?.texto
    }
    else {
      this.textAreaValue = undefined;
    }
    */
    //this.interaccionForResponse = undefined;
    this.textAreaValue = undefined;
    this.visibleResponse = false;
    this.isVisibleModalChat = false;
  };

  
  sePuedeResponder = (interaccion: Interaccion) :boolean => {
      let last: Interaccion | undefined = this.searchLastInteraccion();
      let ret :boolean = false
      if(last) {
        if(interaccion.key) {
          ret = interaccion.key === last.key
        }
        else {
          ret = interaccion.id === last.id
        }
      }
      return ret; 
  };
  
  
  responderInteraccion = (event: Event, interaccion: Interaccion) => {
    event.preventDefault;
    //this.interaccionForResponse = interaccion;
    this.visibleResponse = true;
    //this.isVisibleModalResponse = true;
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

  getPedido(): void {
    this.service.getPedido(this.id)
    .subscribe((pedido) => { // revisar el any
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
