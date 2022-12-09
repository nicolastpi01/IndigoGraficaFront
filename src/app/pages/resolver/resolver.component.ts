import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { PedidoService } from 'src/app/services/pedido.service';
import { catchError, filter, last, Observable, of } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { formatDistance } from 'date-fns';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { badgeColorStyle, getBase64, toLocalDateString, determineIcon, 
  avatarStyle, badgeUponImagePositionStyle, toFullDate, showNoResultTextChatFor } from 'src/app/utils/functions/functions';
import { Solution } from 'src/app/interface/solution';
import { Color } from 'src/app/interface/color';
import { fallback } from 'src/app/utils/const/constantes';
import { PerfilInfo } from 'src/app/components/chat/chat.component';
import { Estado } from 'src/app/interface/estado';
import { Budget } from 'src/app/interface/Budget';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { MailService } from 'src/app/services/mail.service';

interface FileReplacementFeedback {
  color: string,
  text: string
};

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
  currentbudget: Budget | undefined;
  currentBudget: Budget | undefined; // Cargarlo en el OnInit si existe
  showFallbackBudget: boolean = false;
  showFallback: boolean = false;
  id!: string | null;
  textAreaValue: string | undefined; 
  isVisibleModalComment = false;
  isVisibleModalChat = false;
  isVisibleModalPedidoChat = false;
  isVisibleModalFileChat = false;
  isVisibleModalBudgetChat = false;  
  panels: Array<{active: boolean, name: string, disabled: (() => boolean) }> = [];
  tabs: Array<{ name: string, icon: string, title: string }> = [];
  time = formatDistance(new Date(), new Date());
  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()
  ChatNoResultMessage: string = showNoResultTextChatFor('Cliente');
  currentRol :string = 'EDITOR';

  // 300 caracteres!
  textoSinFormato: string = 'Esto tiene 150 caracteres Esto tiene 150 caracteres Esto tiene 150 caracteres Esto tiene 150 caracteres Esto tiene 150 caracteres Esto tiene 150 caracEsto tiene 150 caracteres Esto tiene 150 caracteres Esto tiene 150 caracteres Esto tiene 150 caracteres Esto tiene 150 caracteres Esto tiene 150 carac' 

  constructor(private route: ActivatedRoute, private service :PedidoService, private mailService : MailService, private msg: NzMessageService, 
    private _router: Router, private modal: NzModalService, private tokenService: TokenStorageService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getPedido()
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

  determinePanels = (pedido: Pedido) :Array<{active: boolean, name: string, disabled: (() => boolean)}> => {
    if(pedido.state && pedido.state.value === 'rechazado') {
      return [
        {
          active: false,
          name: 'Datos',
          disabled: () => false 
        },
        {
          active: true,
          name: 'Resolver',
          disabled: () => false
        }
      ];
    }
    else {
      return [
        {
          active: true,
          name: 'Datos',
          disabled: () => false 
        },
        {
          active: false,
          name: 'Comentarios',
          disabled: () =>  !this.hasFiles()
        },
        {
          active: false,
          name: 'Resolver',
          disabled: () => false
        }
      ];
    }
  };

  tieneDimension = () => {
    return this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0
  };

  hasFilesToResolve = () :boolean => {
    if(this.isRejected()) {
      return this.currentPedido !== undefined && this.currentPedido.files !== undefined &&
        this.currentPedido.files.filter((file: FileDB) => !this.hasApprovedSolution(file) ).length > 0 
    }
    else {
      return this.currentPedido !== undefined && this.currentPedido.files !== undefined && this.currentPedido.files.length > 0
    }
  };
  
  hasApprovedSolution = (file: FileDB) :boolean => {
    let find: Solution | undefined = this.currentPedido?.solutions?.find((sol: Solution) => sol.idFileToSolution === file.id?.toString() )
    //console.log("FIND :", find)
    let approved: boolean = (find !== undefined) && (find.approved !== undefined) && find.approved
    return (this.currentPedido !== undefined) && (this.currentPedido.solutions !== undefined) && approved
  };
  
  filesToResolve = () :FileDB[] | undefined => {
    if(this.isRejected()) {
      //console.log("IS REJECTED")
      //let pedidoFind: Pedido | undefined = this.pedidos.find((pedido: Pedido) => 
      //pedido.files?.some((file: FileDB) => file.id?.toString() === solution.idFileToSolution))

      return this.currentPedido?.files?.filter((file: FileDB) => !this.hasApprovedSolution(file) )
    }
    else {
      return this.currentPedido?.files
    }
  }


  // Cuando se desaprueba una Solución la misma debe quedar hasReplacement = false
  determineFileHasReplacementFeedback = (fileSol: FileDB) :FileReplacementFeedback => {
    let ret: FileReplacementFeedback = {
      color: 'red',
      text: 'Esta solución fue desaprobada por el Cliente, agregue una nueva!'
    }
    if(this.hasReplacement(fileSol)) {
      ret = {
        color: "green",
        text: "Esta es una solución para la cuál ya se agrego un reemplazo"
      }
    }
    return ret;
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

  isRejected = () : boolean =>  {
    return this.currentPedido !== undefined && this.currentPedido.state !== undefined 
    && this.currentPedido.state.value === 'rechazado'
  };

  colorear :(state: Estado) => string | undefined = colorearEstado
  
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
      //console.log(file, fileList);
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

      // ACA AGREGO hasReplacement 
      let newSolution: Solution = {
        idFileToSolution: this.currentFile?.id,
        file: newFileDB,
        hasReplacement: this.isRejected() // Si es un Pedido rechazado entonces ahora tiene reemplazo, sino queda en False 
      };
      // No setear el current Solution mandar una copia o algo asi
      if(this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0) {
        this.currentPedido = {
          //VSVSFVSF
          ...this.currentPedido, solutions : this.currentPedido && this.currentPedido.solutions ? 
          [...this.currentPedido?.solutions.filter((sol: Solution) => sol.idFileToSolution !== newSolution.idFileToSolution?.toString()), newSolution ] 
          : [ newSolution ]
          };
      }
      else {
        this.currentPedido = {
          ...this.currentPedido, solutions : [ newSolution ]
          };
      }
      
      console.log("CURRENT PEDIDO: ", this.currentPedido)
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

            console.log("Current Sol: ", this.currentSolution)
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

  // : Promise<void>
  onClickSendBudget = ({ file, fileList }: NzUploadChangeParam)  => {

  };

  resolver = () => {
   this.service.resolver(this.currentPedido?.id).subscribe({
    next: ((pedido: any) => {
      this.msg.success(pedido.message)
      this.service.toggle()
      setTimeout(() => {
        this.msg.info("redireccionando...");
      }, 500);
      setTimeout(() => {
        this._router.navigateByUrl("/revision") // redireccionar a otro lado vista...
      }, 2500);
    }),
    error: ((er: any) => {
      this.msg.error(er.error.message);
    })
   }) 
  };

  hasFiles = () => {
    return this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0
  }

  hasComments = () => {
    let ret: boolean = false
    this.currentPedido?.files?.map((file: FileDB) => {
      ret = ret || (file.comentarios.length > 0)
    });
    return ret
  };

  panelHeader = (panel: {active: boolean, name: string, disabled: () => boolean}) :string => {
    if(panel.name === 'Comentarios') { 
      return `${panel.name} ${!this.hasFiles() ? '(no cuenta con archivos)' : (
        !this.hasComments() ? '(no cuenta con comentarios para ningún archivo)' : ''
      )}`
    }
    else {
      return panel.name
    }
  };

  showNotifyPayment(): void {
    this.modal.warning({
      nzTitle: `<b style="color: yellow;">Atención!</b>`,
      nzContent: `Está seguro de querer notificar que el Cliente realizo el pago para el Pedido con id: ${this.currentPedido?.id} ?`,
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => this.onOkNotifyPayment(this.currentPedido?.id),
      nzCancelText: 'No',
      nzOnCancel: () => {
      }  
    });
  }

  onOkNotifyPayment = (pedidoId: string | undefined) => {
    // Llama al servicio para indicar que el Cliente ya pago por la res. del Pedido
    let token :string = this.tokenService.getToken()
    this.service.notifyPayment(pedidoId, token)
    .subscribe({
      next: (pedido: any) => {
        this.msg.success(pedido.message)
        this.currentPedido = {
          ...this.currentPedido, hasPayment: true
        }
      },
      error: (err: any) => {
        this.msg.error(err.error.message)
      }
    })
  };

  paymentInfoStyle = () => {
    let retStyle = {
      "font-weight": 'bold',
      "font-size": '1rem',
      "line-height": '0.2',
      "margin-top": '5%',
    }
    if(this.currentPedido && this.currentPedido.hasPayment) {
      return {
        ...retStyle, color: 'rgb(37, 167, 52)', // green
      }
    }
    else {
      return {
        ...retStyle, color: 'rgb(201, 46, 46)' // red
      }
    } 
  };

  onClickShowRejectionReason = () => {
    // Levanta el Modal que muestra la información de rechazo de la Solución
    this.modal.info({
      nzTitle: `<b style="color: blue;">Motivo rechazo: </b>`,
      nzContent: this.currentPedido?.solutions?.find((sol: Solution) => sol.idFileToSolution === this.currentFile?.id?.toString())?.rejectionReason,
      nzOkText: 'Ok',
      nzCentered: true,
      nzOkType: 'primary',
      nzOnOk: () => {
      }  
    });
  };

  // retorna true cuando una Sol. tiene reemplazo, sino false o undefined
  hasReplacement = (file: FileDB) :boolean | undefined => {
    // solution.idFileToSolution !== this.currentFile?.id
    console.log("FILE: ", this.currentFile)
    console.log("SOLUTIONS: ", this.currentPedido?.solutions)
    let findSol: Solution | undefined = this.currentPedido?.solutions?.find((sol: Solution) => sol.idFileToSolution === this.currentFile?.id?.toString())
    console.log("FIND SOL: ", findSol)
    return findSol && findSol.hasReplacement
  };

  rejectedHeaderInfo = () => {
    let ret = {
      style: {
        "font-weight": 'bold',
        "text-align": 'center',
        "color": 'rgb(201, 46, 46)' // red
      },
      text: 'Reemplace todas las soluciones que necesiten arreglo, y envie la Revisión nuevamente!'
    }
    if(this.currentPedido && this.currentPedido.solutions && 
      this.currentPedido.solutions.length > 0 && this.currentPedido.solutions.every((sol: Solution) => sol.hasReplacement)) { // Cuando cada Solución 'Desaprobada' tiene su nuevo reemplazo!
      return {
        ...ret,
        style: {
          ...ret.style, color: 'rgb(37, 167, 52)', // green
        },
        text: 'Todas las Soluciones tienen un reemplazo, el Pedido esta listo para Reenviarse' 
      }
    }
    return ret
  }; 

  paymentInfoText = () => {
    if(this.currentPedido && this.currentPedido.hasPayment) {
      return {
        "fistParagraph": 'El Cliente ya ha depositado',
        "secondParagraph": 'el pago para este Pedido.'
      }
    }
    else {
      return {
        "fistParagraph": 'Aún no se ha depositado',
        "secondParagraph": 'un pago para este Pedido.'
      }
    } 
  };

  hasBudget(pedido: Pedido | undefined) {
    return pedido && pedido.presupuesto && pedido.presupuesto.length > 0
  }

  hasBeenSendBudget() {
    return this.currentPedido && this.currentPedido.presupuesto && this.currentPedido.presupuesto.length > 0 &&
    this.currentPedido.sendBudgetMail
  }


  onClickSendBudgetButton = () => {
    if(this.hasBudget(this.currentPedido)) {
      let budgests: Budget[] = JSON.parse(JSON.stringify(this.currentPedido?.presupuesto))
      let budget: Budget | undefined = budgests.pop()
      if(budget && budget.file) {
        this.currentBudget = {
        ...budget, file: {
          ...budget.file, url: this.generateUrl(budget.file) 
          }
        }
      };
    }
    else {
      this.showFallbackBudget = true
    }
    this.isVisibleModalBudgetChat = true
  };

  handleCancelBudget = () => {
    this.goOutModalBudget()
  }

  onOkActionBudget = () => {
    this.goOutModalBudget()
  }

  goOutModalBudget = () => {
    this.isVisibleModalBudgetChat = false
  }
  
  disabledSendBudget = () => {
    return !this.currentBudget || (this.currentPedido && this.currentPedido.sendBudgetMail)
  }

  disabledUploadBudget = () => {
    return this.currentPedido && this.currentPedido.sendBudgetMail
  };

  disabledDeletedBudget = () => {
    return (this.currentPedido && this.currentPedido.sendBudgetMail) || !this.currentBudget
  };

  handleSendBudget = () => {
    // COMPORTAMIENTO CUANDO EL SERVER DA OK
    this.currentPedido = {
      ...this.currentPedido, sendBudgetMail: true
    };
    this.msg.success("Presupuesto enviado.")
    setTimeout(() => {
      //this.msg.loading("recargando...");
      //this.refreshPage() F5
      this.goOutModalBudget()
    }, 1500);
     // Cuando este ok reemplazar esto por hacer un F5 con un loading
    this.mailService.sendBudget(this.currentPedido!.id!)
    .pipe(filter(e => e instanceof HttpResponse)).subscribe(async (e: any) => {
      this.msg.success(`Presupuesto enviado.`);
    }), () => {
      this.msg.error('Sucedió un error durante el envio del presupuesto.');
      // y cierra el Modal
    }
  };

  messageTitle = () => {
    if(this.hasBeenSendBudget()) {
      return 'Ya has enviado el presupuesto'
    }
    else {
      return ''
    }
  }

  budgetTitle = () => {
    return this.currentPedido && this.currentPedido.sendBudgetMail
  }

  async handleChangeBudget({ file, fileList }: NzUploadChangeParam): Promise<void> {
    // Se puede subir un Presupuesto siempre y cuando no se haya enviado el Presupuesto al Cliente
    // además, el efecto es que se 'pisa' el anterior presupuesto. Hay que notificar al Usuario de esto
    if (file.status === 'uploading') {
      //this.msg.loading("subiendo...")
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
      let newBudget: Budget = {
        file: newFileDB, 
      };
      let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido));
      pedidoCp = {
        ...pedidoCp, presupuesto: [newBudget]
      };
      this.service.update(pedidoCp).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => { // revisar el any
            let pedido = (e.body as Pedido)
            this.currentPedido = {...pedido, files: this.currentPedido?.files?.map((file: FileDB) => {
              return {
                ...file, url: this.generateUrl(file)
              }
            })};
            /*
            this.currentPedido = {...pedido, presupuesto: this.currentPedido?.presupuesto?.map((budget: Budget) => {
              return {
                ...budget, file: {
                  ...file, url: this.generateUrl(budget.file)
                }
              }
            })};
            */
            if(this.currentPedido.presupuesto) {
              let budgests: Budget[] = JSON.parse(JSON.stringify(this.currentPedido.presupuesto))
              let budget: Budget | undefined = budgests.pop()
              if(budget && budget.file) {
                this.currentBudget = {
                  ...budget, file: {
                    ...budget.file, url: this.generateUrl(budget.file) 
                  }
                }
              };
            } 
            this.msg.success(`Presupuesto ingresado exitosamente.`); 
        }),
        () => {
            this.msg.error('Fallo el envio del presupuesto!');
        }

    } else if (file.status === 'error') {
        this.msg.error(`${file.name} Fallo el envío del presupuesto!`);
    }
  };

  onClickDeleteBudget = (item: Budget | undefined) => {
    // Se puede eliminar un presupuesto siempre y cuando no se haya enviado al Cliente
    let pedidoCp : Pedido = JSON.parse(JSON.stringify(this.currentPedido))
    pedidoCp = {
      ...pedidoCp, presupuesto: pedidoCp.presupuesto?.filter((budget: Budget) => budget.id !== item?.id)
    }
    this.service.update(pedidoCp).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => {
            this.currentPedido = (e.body as Pedido);
            this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
              return {
                ...file, url: this.generateUrl(file)
              }
            });
            this.currentBudget = undefined // Elimino el Budget
            this.showFallbackBudget = true // ya que no tiene Budget debo poner el showFallbackBudget en true!
            this.msg.success('Presupuesto eliminado correctamente!');
        }),
        () => {
            this.msg.error('No se pudo eliminar el Presupuesto. Intente de nuevo!');
        }
  }; 

  handleSendMarkups = (comments: Comentario[]) => {
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
        this.panels = this.determinePanels(pedido)
        if(pedido.files === undefined || pedido.files.length === 0) {
          let file : FileDB | undefined = pedido.solutions ? pedido.solutions[0]?.file : undefined
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
    console.log("LLAME ONCLICK COMMENT")
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
    event.preventDefault;
    this.currentFile = item
    // Cuidado, porque item.id y idFileToSolution son de =/ tipo
    let currentSol :Solution | undefined = this.currentPedido?.solutions?.find((solution: Solution) => solution.idFileToSolution === item.id?.toString())
    this.currentSolution = currentSol?.file
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

  goOutside = () => {
    this._router.navigateByUrl('/bienvenido')
  };

}
