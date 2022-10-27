import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { PedidoService } from 'src/app/services/pedido.service';
import { filter, last, Observable } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { formatDistance } from 'date-fns';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { badgeColorStyle, getBase64, toLocalDateString, determineIcon, 
  avatarStyle, badgeUponImagePositionStyle, toFullDate, showNoResultTextChatFor } from 'src/app/utils/functions/functions';
import { ThisReceiver } from '@angular/compiler';
import { Solution } from 'src/app/interface/solution';
import { Color } from 'src/app/interface/color';
import { fallback } from 'src/app/utils/const/constantes';
import { PerfilInfo } from 'src/app/components/chat/chat.component';

@Component({
  selector: 'app-resolver',
  templateUrl: './resolver.component.html',
  styleUrls: ['./resolver.component.css']
})

export class ResolverComponent implements OnInit {

  fallback: string = fallback;
  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString;
  determineIcon: (interaccion: Interaccion) => "user" | "highlight" = determineIcon;
  avatarStyle: (interaccion: Interaccion) => { 'background-color': string; } = avatarStyle;
  badgeUponImagePositionStyle: (comentario: Comentario) => { position: string; left: string; top: string; } = badgeUponImagePositionStyle; 
  badgeColorStyleFunction: ()  => {
    backgroundColor: string;
  } = badgeColorStyle;
  fullDate : (date: Date | any) => string = toFullDate;
  currentPedido: Pedido | undefined;
  currentFile: FileDB | undefined;
  currentComment: Comentario | undefined;
  currentSolution: FileDB | undefined; 
  showFallback: boolean = false;
  id!: string | null;
  textAreaValue: string | undefined; 
  isVisibleModalComment = false;
  isVisibleModalChat = false;
  isVisibleModalPedidoChat = false;
  isVisibleModalFileChat = false;
  
  panels: Array<{active: boolean, name: string, disabled: boolean}> = [];
  tabs: Array<{ name: string, icon: string, title: string }> = [];
  time = formatDistance(new Date(), new Date());
  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()
  ChatNoResultMessage: string = showNoResultTextChatFor('Cliente'); 

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
        name: 'Comentarios'
      },
      {
        active: false,
        disabled: false,
        name: 'Resolver'
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

  getPerfil :PerfilInfo = {
    title: "Charla con el Cliente!",
    label: "EDITOR",
    icon: "highlight",
    hexColor: "background-color: #f56a00"
  };

  tieneDimension = () => {
    return this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0
  };

  eliminarRespuesta = () => {
    let last = this.searchLastInteraccion();
    if(last && last.id && last.rol === 'EDITOR') {
      this.currentComment?.interacciones.pop();
      if(this.currentComment) this.currentComment.respondido = false;
        
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
          this.textAreaValue = undefined;
          this.msg.success('Se elimino la respuesta correctamente!');
      }),
      () => {
          this.msg.error('No se pudo eliminar la respuesta, vuelva a intentarlo en unos segundos');
      }
    }
    else {
      this.textAreaValue = undefined;
    }
  };

  colorear :(descripcion: string) => string | undefined = colorearEstado
  
  onChangeTextArea = (value: string) :void => {
    this.textAreaValue = value;
  };

  handleOkModalResponse = (textValue: string | undefined) => {
    if(this.currentComment && textValue) {      
      let lastInteraccion = this.searchLastInteraccion(); // Si esta al reves deberiamos verificar al principio
      if(lastInteraccion?.rol === 'EDITOR') {
        this.currentComment.interacciones.pop();
      }
      let response: Interaccion = {
        texto: textValue,
        rol: 'EDITOR',
        key: this.currentComment.interacciones.length 
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
        }),
        () => {
            this.msg.error('No se pudo agregar la respuesta, vuelva a intentarlo en unos segundos');
        }
    }; 
  };

  onClickPedidoChat = (event: MouseEvent) => {
    event.preventDefault;
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentPedido?.interacciones)) 
    let last: Interaccion | undefined = InteraccionesCP.pop() 
    if(last?.rol === 'EDITOR') {
        this.textAreaValue = last?.texto
    };
    this.isVisibleModalPedidoChat = true;
  };

  onClickFileChat = (file: FileDB) => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(file.interacciones)) 
    let last: Interaccion | undefined = InteraccionesCP.pop() 
    if(last?.rol === 'EDITOR') {
        this.textAreaValue = last?.texto
    };
    this.currentFile = file;
    this.isVisibleModalFileChat = true;
  };

  handleClosePedidoChat = (visible: boolean) => {
    this.textAreaValue = undefined;
    this.isVisibleModalPedidoChat = visible;
  };

  handleOkModalFileChat = (editorComment: string) => {   
    if(this.currentFile && this.currentFile.interacciones && editorComment !== undefined && editorComment !== '') {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentFile.interacciones)) 
      let lastInteraccion: Interaccion | undefined = InteraccionesCP.pop()
      let fileCp : FileDB = JSON.parse(JSON.stringify(this.currentFile))
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido))

      if(fileCp.interacciones) {
        if(lastInteraccion?.rol === 'EDITOR') { 
          fileCp.interacciones.pop(); 
        }
        let response: Interaccion = {
          texto: editorComment,
          rol: 'EDITOR',
          key: fileCp.interacciones.length
        };
        fileCp.interacciones = [ 
          ...fileCp.interacciones,
          response 
        ];
        pedidoCp = {
          ...pedidoCp, files: pedidoCp.files?.map((file: FileDB) => {
            if(file.id === fileCp.id && fileCp) {
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
              this.textAreaValue = editorComment;
              this.currentPedido = pedido;    
              this.currentPedido = {
                ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
                  return {
                    ...file, url: this.generateUrl(file)
                  }
                }) 
              };
              this.currentFile = this.currentPedido.files?.find((file: FileDB) => file.id === this.currentFile?.id); 
              this.msg.success('Se agrego el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, intente enviar el comentario de nuevo!');
          }
      }
    }
  };


  handleDelModalFileChat = () => {
    if(this.currentFile && this.currentFile.interacciones) {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentFile.interacciones)) 
      let lastInteraccion: Interaccion | undefined = InteraccionesCP.pop()
      let fileCp : FileDB = JSON.parse(JSON.stringify(this.currentFile))
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido))

      if(fileCp.interacciones) {
        if(lastInteraccion?.rol === 'EDITOR') fileCp.interacciones.pop(); 
      };
      pedidoCp.files = pedidoCp.files?.map((file: FileDB) => {
        if(file.id === fileCp.id) {
          return fileCp
        }
        else {
          return file
        }
      })
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
          this.currentFile = this.currentPedido.files?.find((file: FileDB) => file.id === this.currentFile?.id);
          this.textAreaValue = undefined; 
          this.msg.success('Se elimino el comentario correctamente!');
          }),
          () => {
          this.msg.error('Hubo un error, intente eliminar el comentario de nuevo!');
          }
    }
  };

  handleClickAceptar = (userComment: string) => {   
    if(this.currentPedido && this.currentPedido.interacciones && userComment !== '') {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentPedido.interacciones)) 
      let lastInteraccion: Interaccion | undefined = InteraccionesCP.pop()

      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido))
      if(pedidoCp.interacciones) {
        if(lastInteraccion?.rol === 'EDITOR') { 
          pedidoCp.interacciones.pop(); 
        }
        let response: Interaccion = {
          texto: userComment,
          rol: 'EDITOR',
          key: pedidoCp.interacciones.length
        };
        pedidoCp.interacciones = [ 
          ...pedidoCp.interacciones,
          response 
        ];
        this.service.update(pedidoCp).
          pipe(filter(e => e instanceof HttpResponse))
          .subscribe(async (e: any) => {
              let pedido = (e.body as Pedido)
              this.textAreaValue = userComment;
              this.currentPedido = pedido;    
              this.currentPedido = {
                ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
                  return {
                    ...file, url: this.generateUrl(file)
                  }
                }) 
              }; 
              this.msg.success('Se agrego el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, no enviar el comentario!');
          }
      }
    }
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
              this.currentPedido = {
                ...this.currentPedido, files: this.currentPedido.files?.map((file: FileDB) => {
                  return {
                    ...file, url: this.generateUrl(file)
                  }
                }) 
              };
              this.textAreaValue = undefined;
              this.msg.success('Se elimino el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, no se pudo eliminar el comentario!');
          }
    }
  };

  handleCancelModalResponse = (value: boolean) => {
    this.textAreaValue = undefined;
    this.isVisibleModalChat = value;
  };

  handleCancelModalFileChat = (value: boolean) => {
    this.textAreaValue = undefined;
    this.isVisibleModalFileChat = value;
  };

  handlePreview = (file: NzUploadFile): void => { };

  async handleChange({ file, fileList }: NzUploadChangeParam): Promise<void> {
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
    if (file.status === 'done') {
      file['preview'] = await getBase64(file.originFileObj!);

      let newFileDB: FileDB = {
        id: file.response.id,
        name: file.response.name,
        type: file.response.type,
        data: file.response.data,
        url: file.url || file['preview'],
        comentarios : []
      }

      this.currentSolution = newFileDB; // No deberia setearse aca, luego de la rta. del server
      // Despues de la rta del server tengo que generar todas las url para los Files en Solutions
      // Tengo que setear la currentSolution

      let newSolution: Solution = {
        idFileToSolution: this.currentFile?.id,
        file: newFileDB 
      };
      // No setear el current Solution mandar una copia o algo asi
      if(this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0) {
        this.currentPedido = {
          ...this.currentPedido, solutions : this.currentPedido && this.currentPedido.solutions ? 
          [...this.currentPedido?.solutions.filter((sol: Solution) => sol.idFileToSolution !== newSolution.idFileToSolution), newSolution ] 
          : [ newSolution ]
          };
      }
      else {
        this.currentPedido = {
          ...this.currentPedido, solutions : [ newSolution ]
          };
      }
      
      this.service.update(this.currentPedido).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => { // revisar el any
            let pedido = (e.body as Pedido)
            //let files: FileDB[] | undefined = this.currentPedido?.files; 
            this.currentPedido = {...pedido, files: this.currentPedido?.files?.map((file: FileDB) => {
              return {
                ...file, url: this.generateUrl(file)  //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
              }
            })};
            console.log("El pedido: ", this.currentPedido)
            //this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
            //  return {
            //    ...file, url: await getBase64(file)  
                //this.fileList.find((nZFile: NzUploadFile) => nZFile.response.id === file.id)?.url
            //}
            //});

            //let currentFileAux: FileDB | undefined = this.currentPedido.files?.find((file: FileDB) => file.id === newFileDB.id);
            //if (currentFileAux && this.files) this.files = [...this.files, currentFileAux ] // this.files?.push(currentFileAux); 
            //this.currentFile = currentFileAux;
            //if(this.currentFile) this.currentFile.comentarios = []
            this.msg.success(`${file.name} file uploaded successfully`); 
            //this.msg.success('Se actualizo el pedido correctamente!');
        }),
        () => {
            //this.currentPedido?.files?.pop();
            this.msg.error('Fallo la generación del pedido!');
        }

    } else if (file.status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  };

  handleSendMarkups = (comments: Comentario[]) => {
    let fileCp : FileDB = JSON.parse(JSON.stringify(this.currentFile));
    let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido));
  };

  // Este es la firma del metodo nzAction de Upload antZorro
  handleAction = (file: NzUploadFile) : string | Observable<string> => {
    return 'http://localhost:8080/files/upload'
  };

  resolverFilesStyle = (pedido: Pedido) => {
    if(pedido.files && pedido.files.length > 1) {
      return "margin-left:10rem;"
    }
    else {
      return "margin-left:3rem;"
    }
  };

  cardStyle = (file: FileDB) => {
    if(this.currentFile?.id === file.id) {
      return {
        'border-color': 'rgb(179, 172, 172)',
        'border-width': '2px',
        'border-style': 'dashed'
      }
    }
    else {
      return ''
    }
  };

  getPedido(): void {
    this.service.getPedido(this.id)
    .subscribe((pedido) => { // revisar el any
        this.currentPedido = pedido;
        if(pedido.files === undefined || pedido.files.length === 0) {
          let file : FileDB | undefined = pedido.solutions ? pedido.solutions[0].file : undefined
          if(file) this.currentSolution = {...file, url: this.generateUrl(file) }
        };
        this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
          return {
            ...file, url: this.generateUrl(file)  //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
          }
        });
    })
  };

  pedidoColores = () :Color[]  => {
    if(this.currentPedido && this.currentPedido.colores) return this.currentPedido.colores
    if(this.currentPedido && this.currentPedido.tipo && this.currentPedido.tipo.colores) return this.currentPedido.tipo.colores
    else return [] 
  };

  generateUrl = (file: FileDB) :string => {
    return 'data:' + file.type + ';base64,' + file.data
  };

  onClickComment = (event: MouseEvent, item: FileDB) => {
    event.preventDefault;
    this.currentFile = item; 
    this.isVisibleModalComment = true;
  };

  onClickDeleteSolution = (event: MouseEvent) => {
    event.preventDefault;
    let cp : Pedido | undefined = JSON.parse(JSON.stringify(this.currentPedido))
    if(this.currentFile) {
      cp = {
        ...cp, solutions : cp?.solutions?.filter((solution: Solution) => solution.idFileToSolution !== this.currentFile?.id) 
      }
    }
    else {
      cp = {
        ...cp, solutions : [] 
      }
    }
    
    this.service.update(cp).
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
            this.msg.success(`Solución ${this.currentSolution?.name} eliminada correctamente!.`);
            this.showFallback = true;
            this.currentSolution = undefined        
        }),
        () => {
            this.msg.error(`Hubo un error al intentar eliminar la solución ${this.currentSolution?.name}.`);
        }
  };

  onClickAddSolution = (event: MouseEvent, item: FileDB) => {
    //this.showFallback = false;
    event.preventDefault;
    this.currentFile = item
    //console.log("Current File: ", item)
    //console.log("Solutions: ", this.currentPedido?.solutions)
    this.currentSolution = this.currentPedido?.solutions?.find((solution: Solution) => solution.idFileToSolution === item.id)?.file
    //console.log("Current Solution: ", this.currentSolution)
    
    if(!this.currentSolution) {
      this.showFallback = true
    } 
    else {
      this.currentSolution = {
        ...this.currentSolution, url: this.generateUrl(this.currentSolution)
      }
    }
  };

  onClickChat = (comment: Comentario) => {
    this.currentComment = comment;
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

  handleCancelResolver = (value: boolean) => {
    this.getPedido(); // revisar esto !
    this.isVisibleModalComment = value;
  };

}
