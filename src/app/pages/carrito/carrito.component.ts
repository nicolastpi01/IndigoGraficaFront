import { Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Color } from 'src/app/interface/color';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { FileDB } from 'src/app/interface/fileDB';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { avatarStyle, determineIcon, toLocalDateString, showNoResultTextChatFor } from 'src/app/utils/functions/functions';
import { fallback } from 'src/app/utils/const/constantes';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { formatDistance } from 'date-fns';
import { HttpResponse } from '@angular/common/http';
import { catchError, filter, of, pipe } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { PerfilInfo } from 'src/app/components/chat/chat.component';
import { Estado } from 'src/app/interface/estado';
import { Solution } from 'src/app/interface/solution';

interface SolutionFeedback {
  'color': "green" | "red",
  'icon': "check-circle" | "close-circle",
  'text': "Aprobado" | "Desaprobado"
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})

export class CarritoComponent implements OnInit {

  total: number = 0;
  count: number = 2;
  index: number = 0;
  index2: number = 2;
  pedidos: any[] = [];
  allData: any[] = []

  currentPedido: Pedido | undefined; 
  currentFile: FileDB | undefined;
  currentComment: Comentario | undefined;
  currentSolution: Solution | undefined;
  loadingSearch: boolean = false;
  loading: boolean = false;
  isVisibleModalMoreInfo: boolean = false;
  isVisibleModalChat: boolean = false;
  isVisibleModalFilesChat: boolean = false;
  isVisibleModalFileComments: boolean = false;
  isVisibleModalChatUponAFile: boolean = false;
  isVisibleModalRevisarSolucion: boolean = false;
  loadingMore: boolean = false;

  dateFormat = 'dd/MM/YYYY';
  expanded: boolean = false;
  expandedId: boolean = false;
  userCommentValue: string = '';
  tabs: Array<{ name: string, icon: string, title: string }> = [];
  fallback: string = fallback;
  time = formatDistance(new Date(), new Date());
  AccionText: String = "Editar"

  solutionFeedback: SolutionFeedback = {
    "color": "red",
    "icon": "close-circle",
    "text": "Desaprobado"
  }

  ChatNoResultMessage: string = showNoResultTextChatFor('Editor'); 
  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString;
  determineIcon: (interaccion: Interaccion) => "user" | "highlight" = determineIcon;
  avatarStyle: (interaccion: Interaccion) => { 'background-color': string; } = avatarStyle;
  colorear :(state: Estado) => string | undefined = colorearEstado;
  currentRol: string = 'CLIENTE'
  IdsSolutionsDisapproved: (string | undefined)[] = []

  contentNotifySolutionText = "Va a enviar la revisión, las Soluciones 'desaprobadas' seran revisadas por el Editor quien corregira las mismas a la brevedad, las soluciones 'aprobadas'desapareceran de la vista, esta seguro de mandar la revisión ?"
  
  constructor(private _router: Router, private service: PedidoService, 
    private fb: FormBuilder, private modal: NzModalService, private msg: NzMessageService, private tokenService: TokenStorageService) { }

  ngOnInit(): void {
    this.tabs = [
      {
        name: 'Info',
        icon: 'data',
        title: 'Datos'
      },
      {
        name: 'Files',
        icon: 'file',
        title: 'Archivos'
      },
      {
        name: 'Solutions',
        icon: 'check',
        title: 'Soluciones'
      }
    ]; 
    this.getPedidos()
  }

  getPedidos(): void {
    this.loading = true
    let token :string = this.tokenService.getToken()
    this.service.getPedidosPorUsuario(token)
    .subscribe(pedidos => {
      this.allData = pedidos.map((pedido: Pedido) => {
        return {
          ...pedido, 
          expandedId : false,
          expandedTitle: false,
          solutions : pedido.solutions?.map((sol: Solution) => {
            return {
              ...sol, file: {
               ...sol.file, url: this.generateUrl(sol.file)  
              }
            }
          }),
          files : pedido.files?.map((file: FileDB) => {
            return {
              ...file, url: this.generateUrl(file)
            }
          })
        }
       });
      this.pedidos = pedidos.map((pedido: Pedido) => {
        return {
          ...pedido, 
          expandedId: false,
          expandedTitle: false,
          solutions : pedido.solutions?.map((sol: Solution) => {
            return {
              ...sol, file: {
               ...sol.file, url: this.generateUrl(sol.file)  
              }
            }
          }),
          files : pedido.files?.map((file: FileDB) => {
            return {
              ...file, url: this.generateUrl(file)
            }
          })
        }
       }).slice(this.index, this.index2);

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

  onLoadMore = () => {
    this.loadingMore = true;
    let index = this.index + this.count
    let index2 = this.index2 + this.count
    
    let slice = this.allData.slice(index, index2) // revisar esto "!!"!""
    this.pedidos = this.pedidos.concat(slice)

    this.index2 = index2;
    this.index = index;
    this.loadingMore = false;
  };

  onClickFileChat = (file: FileDB, pedido: Pedido) => {
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(file.interacciones))
    let last: Interaccion | undefined =  InteraccionesCP.pop()
    if (last && last.rol === 'USUARIO') {
      this.userCommentValue = last.texto
    };
    this.currentFile = file;
    this.currentPedido = pedido;
    this.isVisibleModalChatUponAFile = true;
  };

  onClickShowFileComments = (event: MouseEvent, item: FileDB, pedido: Pedido) => {
    event.preventDefault;
    this.currentFile = item;
    this.currentPedido = pedido; 
    this.isVisibleModalFileComments = true;
  }

  onClickComment = (comentario: Comentario) => {
    this.currentComment = comentario;
    let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(comentario.interacciones))
    let last: Interaccion | undefined =  InteraccionesCP.pop()
    if (last && last.rol === 'USUARIO') {
      this.userCommentValue = last.texto
    };
    this.isVisibleModalFilesChat = true;    
  };

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

  handleCloseFileChat = (value: boolean) => {
    this.userCommentValue = '';
    this.isVisibleModalChatUponAFile = value;
  };

  handleCloseComments = (value: boolean) => {
    this.currentFile = undefined;
    this.currentPedido = undefined;
    this.isVisibleModalFileComments = value;
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

  onAcceptModalFileChat = (userComment: string) => {
    if(this.currentFile && this.currentFile.interacciones && userComment !== undefined && userComment !== '') {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentFile.interacciones)) 
      let lastInteraccion: Interaccion | undefined = InteraccionesCP.pop()
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido))
      let fileCp : FileDB = JSON.parse(JSON.stringify(this.currentFile))

      if(fileCp.interacciones) {
        if(lastInteraccion?.rol === 'USUARIO') fileCp.interacciones.pop();
        let response: Interaccion = {
          texto: userComment,
          rol: 'USUARIO',
          key: fileCp.interacciones.length
        }
        fileCp.interacciones = [
          ...fileCp.interacciones, response
        ]
        pedidoCp = {
          ...pedidoCp, files: pedidoCp.files?.map((file: FileDB) => {
            if(fileCp && file.id === fileCp.id) {
              return fileCp
            }
            else {
              return file
            }
          })
        }
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
            this.pedidos = this.pedidos.map((pedido: any) => {
              if(pedido.id === this.currentPedido?.id) { 
                return this.currentPedido
              }
              else {
                return pedido
              }
            });
            this.currentFile = this.currentPedido.files?.find((file: FileDB) => file.id === this.currentFile?.id)
            this.userCommentValue = userComment; 
            this.msg.success('Se agrego el comentario correctamente!');
          }),
          () => {
            this.msg.error('Hubo un error al enviar el comentario!');
          }
      };
    }  
  };

  onDelModalFileChat = () => {
    if(this.currentFile && this.currentFile.interacciones) {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(this.currentFile.interacciones))
      let fileCp : FileDB = JSON.parse(JSON.stringify(this.currentFile));
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido));
      InteraccionesCP.pop()
      fileCp = {
        ...fileCp, interacciones: InteraccionesCP 
      } 
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

  handleClickAceptar = (userComment: string) => {   
    //if(this.currentPedido && this.currentPedido.interacciones && this.userCommentValue !== '') {
    if(this.currentPedido && this.currentPedido.interacciones && userComment !== '') {
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

  handleOnSendMarkups(comments: Comentario[]): void {
    let fileCp : FileDB = JSON.parse(JSON.stringify(this.currentFile));
    let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido));
    fileCp = {
      ...fileCp, comentarios: fileCp.comentarios.map((comentario: Comentario) => {
        if(comments.find((comment: Comentario) => comment.id === comentario.id) !== undefined) {
          return comments.find((comment: Comentario) => comment.id === comentario.id)!
        }
        else {
          return comentario
        }
      })
    };
    pedidoCp = {
      ...pedidoCp, files: pedidoCp.files?.map((file: FileDB) => {
        if(fileCp && file.id === fileCp.id) {
          return fileCp;
        }
        else {
          return file;
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
        this.msg.success('Se marcaron los comentarios!');
      }),
      () => {
        this.msg.error('Hubo un error, no se pudieron marcar los comentarios');
      }
  };

  generateUrl = (file: FileDB) :string => {
    return 'data:' + file.type + ';base64,' + file.data
  };

  tieneDimension = () => {
    return this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0
  };

  handleCloseChat(visible: boolean) : void {
    this.userCommentValue = ''
    this.isVisibleModalChat = visible;
  }

  handleCloseFilesChat(visible: boolean) : void {
    this.userCommentValue = ''
    this.isVisibleModalFilesChat = visible;
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
    this._router.navigateByUrl('/editar' + `/${pedido.id}`)
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

  isPendingRevision = (pedido: Pedido) :boolean => {
    return pedido?.state?.value === 'pendRevision'
  }

  determineSolutionFeedback = (solution: Solution) :SolutionFeedback => {
    let ret: SolutionFeedback = {
      'color': 'red',
      'icon': 'close-circle',
      'text': 'Desaprobado'
    }
    if(solution.approved) {
      ret = {
        "color": "green",
        "icon": "check-circle",
        "text": "Aprobado"
      }
    }
    return ret;
  };

  determineTagColor = (solution: Solution) :string => {
    if(solution.approved) {
      return '#87d068'
    }
    else {
      if(solution.approved === false) {
        return '#e41e14'
      }
      else {
        return '#837d7d'
      }
      
    } 
  }
  determineTextColor = (solution: Solution) :string => {
    if(solution.approved) {
      return 'APROBADO'
    }
    else {
      if(solution.approved === false) {
        return 'DESAPROBADO'
      }
      else {
        return 'PENDIENTE'
      }
      
    }  
  };
  
  showRevisarModal = (solution: Solution) :void => {
    console.log("PEDIDO EN TAB SOLUTIONS: ", this.currentPedido)
    this.currentSolution = solution
    this.solutionFeedback = this.determineSolutionFeedback(solution)
    let pedidoFind: Pedido | undefined = this.pedidos.find((pedido: Pedido) => 
    pedido.files?.some((file: FileDB) => file.id?.toString() === solution.idFileToSolution))
    if(pedidoFind) this.currentPedido = pedidoFind // sino se queda como esta el CurrentFile 
    this.isVisibleModalRevisarSolucion = true
  };

  closeModalSolution = () => {
    this.isVisibleModalRevisarSolucion = false;
  }

  determineImageToSolution = () :string => {
    let findFile: FileDB | undefined = this.currentPedido?.files?.find((file: FileDB) => file.id?.toString() === this.currentSolution?.idFileToSolution)
    if(findFile && findFile.url) {
      return findFile.url
    }
    else {
      return 'fallback'
    }
  }

  sendApproveSolution = (approved: boolean) :void => {
    console.log("CURRENT PEDIDO: ", this.currentPedido)
    let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido))
    pedidoCp = {
      ...pedidoCp, solutions: pedidoCp.solutions?.map((sol: Solution) => {
        if(this.currentSolution && (sol.id === this.currentSolution.id)) {
          return {
            ...sol, approved: approved
          }
        }
        else {
          return sol
        }
      })
    };
    let token :string = this.tokenService.getToken()
    this.service.agreeToTheSolution(pedidoCp, approved, token).pipe(
      catchError(er => {
        this.msg.error(er.error.message);
        return of(er)
      })
    ).
      pipe(filter(e => e instanceof HttpResponse))
      .subscribe(async (e: any) => {
        this.msg.success(`Solución ${approved ? 'aprobada' : 'desaprobada'} satisfactoriamente!`)
        console.log("IDS ANTES: ", this.IdsSolutionsDisapproved)
        this.IdsSolutionsDisapproved = this.IdsSolutionsDisapproved.filter((id: string  | undefined) => id !== this.currentSolution?.id)
        console.log("IDS DESPUES: ", this.IdsSolutionsDisapproved)
        if(this.currentSolution) {
          this.currentSolution = {
            ...this.currentSolution, approved: approved
          }
        };
        this.currentPedido = {
          ...this.currentPedido, solutions: this.currentPedido?.solutions?.map((sol: Solution) => {
            if(this.currentSolution && (sol.id === this.currentSolution.id)) {
              return this.currentSolution
            }
            else {
              return sol
            }
        })}
        this.pedidos = this.pedidos.map((pedido: Pedido) => {
          if(pedido.id === this.currentPedido?.id) {
            return this.currentPedido
          }
          else {
            return pedido
          }
        });
        
      });
  };

  onClickTab = (tab: { name: string, icon: string, title: string }, pedido: Pedido) => {
    if(tab.name === 'Solutions') {
      console.log("ON CLICK TAB PEDIDO: ", pedido)
      this.currentPedido = pedido
    }
  };

  checkSolutionsDissaproved = () => {
    let solutionDisapproved : Solution[] | undefined = this.currentPedido?.solutions?.filter((sol: Solution) => sol.approved === null)
    let IdsSolutionsDisapproved: (string | undefined)[] = solutionDisapproved ? solutionDisapproved.map((sol: Solution) => sol.id) : []
    this.IdsSolutionsDisapproved = IdsSolutionsDisapproved;
  }

  // Estaria bueno mostrar el id del Pedido que se quiere enviar a revisión
  showNotifyRevision = () => {
    if(this.existsSolutionsWithoutFeedback()) {
      this.checkSolutionsDissaproved()
      this.msg.error("Exísten soluciones para las cuáles no se ha brindado una conformidad-- Aprobado o Desaprobado")
    }
    else {
      this.modal.warning({
        nzTitle: `<b style="color: yellow;">Atención!</b>`,
        nzContent: this.contentNotifySolutionText,
        nzOkText: 'Sí',
        nzCentered: true,
        nzOkType: 'primary',
        nzOnOk: () => this.onOkNotifyRevision(),
        nzCancelText: 'No',
        nzOnCancel: () => {
        }  
      });
    }
  };

  refreshPage() {
    window.location.reload();
  }

  onOkNotifyRevision = () => {
    this.service.sendRevision(this.currentPedido?.id).pipe(
      catchError(er => {
        this.msg.error(er.error.message);
        return of(er)
      })
    )
      .subscribe((result: any) => {
        this.service.toggle()
        this.msg.success(result.message)  
        setTimeout(() => {
          this.msg.loading("recargando...");
          this.refreshPage()
        }, 1500);         
      });
  };

  existsSolutionsWithoutFeedback = () :boolean => {
    let ret: boolean = false
    if(this.currentPedido && this.currentPedido.solutions) {
      ret = ret || this.currentPedido.solutions.some((sol: Solution) => sol.approved === null)
    }
    return ret
  };

  cardStyle = (solution: Solution) => {
    if( this.IdsSolutionsDisapproved.includes((solution.id) ) ) {
      return {
        'border-color': 'rgb(237, 27, 27)',
        'border-width': '2px',
        'border-style': 'dashed'
      }
    }
    else {
      return ''
    }
  };


}
