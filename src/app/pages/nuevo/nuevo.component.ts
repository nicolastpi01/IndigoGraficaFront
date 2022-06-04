import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { PENDIENTEATENCION, tipografias as arrayLetras } from 'src/app/utils/const/constantes';
import { Tipo } from 'src/app/interface/tipo';
import { Color } from 'src/app/interface/color';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { filter, Observable, Observer } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import {  NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ColorService } from 'src/app/services/color.service';
import { TipoPedidoService } from 'src/app/services/tipo-pedido.service';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';
import { FileService } from 'src/app/services/file.service';
import { Requerimiento } from 'src/app/interface/requerimiento';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { PosicionService } from 'src/app/services/posicion.service';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})

export class NuevoComponent implements OnInit {

  panels: Array<{active: boolean, name: string, disabled: boolean}> = [];
  validateForm!: FormGroup;
  currentPedido: Pedido | undefined;
  loadingAlta = false;
  tipografias = arrayLetras
  colores : Array<{ value: string; label: string }> = []
  coloresData : Array<Color> = []
  tipoPedidosData : Array<Tipo> = []
  tiposDePedidos : Array<{ value: string; label: string }> = []
  fileList: NzUploadFile[] = [];
  previewImage?: string;
  previewVisible = false;
  isVisibleMiddle = false;
  currentFile: FileDB | undefined;
  files: Array<FileDB> | undefined = []
  loadingEliminarPedido= false;
  dateFormat = 'dd/MM/YYYY';

  isVisibleModalComment = false;

  constructor(private fb: FormBuilder, private service :PedidoService, private fileService: FileService, private tipoService: TipoPedidoService, 
    private colorService :ColorService, private _router: Router, private msg: NzMessageService, private posService: PosicionService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      titulo: [null, [Validators.required]],
      subtitulo: [null, [Validators.required]],
      cantidad: [null, []], // La cantidad por defecto es uno, y si no esta definido se pone uno en el Pedido
      alto: [null, [ Validators.min(30)], [(control: FormControl) => this.dimensionAsyncValidator (control, 'ancho') ]],
      ancho: [null, [ Validators.min(30)], [(control: FormControl) => this.dimensionAsyncValidator (control, 'alto') ]],
      datePicker: [null, [Validators.required], [this.confirmDateValidator]],
      tipografia: [null, []],
      tipo:  [[], [Validators.required]],
      color: [[], []],
      comentario: [null, [Validators.maxLength(150) ]],
      remember: [true]
    });
    
    this.findColores();
    this.findPedidos();

    this.panels = [
      {
        active: true,
        name: 'Datos',
        disabled: false
      },
      {
        active: false,
        disabled: true,
        name: 'Archivos'
      },
      
    ];

  }

  dimensionAsyncValidator = (control: FormControl, dimension: string) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if(this.validateForm.value) {
          if ( (control.value !== this.validateForm.value[dimension]) && this.validateForm.value[dimension] ) {
            observer.next({ error: true, differDimension: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        }
      }, 1000);
  });

  confirmDateValidator = (control: FormControl) => 
    new Observable((observer: Observer<ValidationErrors | null>) => {
      if((control.value as Date).getTime() < Date.now()) {
        observer.next({ error: true, postTodayDate: true });
      } 
      else {
        observer.next(null);
      }
      observer.complete();
  });

  findColores() :void {
    this.colorService.getAllColores()
    .subscribe((colores :Color[]) => {
      this.coloresData = colores;
      colores.forEach((color: Color) => {
        this.colores = [
          ...this.colores, {
            value: color.hexCode,
            label: color.nombre
          }
        ]
      })
    });
  }

  findPedidos() :void {
    this.tipoService.getAllTiposDePedidos()
    .subscribe((pedidos :Tipo[]) => {
      this.tipoPedidosData = pedidos;
      pedidos.forEach((tipo: Tipo) => {
        this.tiposDePedidos = [
          ...this.tiposDePedidos, {
            value: tipo.nombre,
            label: tipo.nombre
          }
        ]
      })
    });
  }

  onClickAlta(): void {
    if (this.validateForm.valid) {
      this.createPedido()
      this.panels = this.panels.map((panel) => {
        if(panel.name === 'Datos') {
          return {
            ...panel, active: false
          }}
          else {
            return {
              ...panel, active: true, disabled: false,
            }
          }
        })

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  createPedido = (): void => {
    this.loadingAlta = true;
    let form = this.validateForm;
  
    let coloresRet :Color[] = [];
    form.value.color.forEach( (colorHexCode: string) => { // Sacar el ForEach
      let colorRet = this.coloresData.find( (colorData: Color) => colorData.hexCode === colorHexCode)
      if (colorRet) coloresRet.push(colorRet);
    })
  
    let nuevoPedido : Pedido = {
      cantidad: form.value.cantidad ? form.value.cantidad : 1,
      nombre: form.value.titulo,
      nombreExtendido: form.value.subtitulo,
      tipografia: form.value.tipografia,
      alto: form.value.alto,
      ancho: form.value.ancho,
      descripcion: form.value.comentario,
      state: PENDIENTEATENCION,
      propietario: "Nicolas del Front",
      encargado: null,
      tipo: this.tipoPedidosData.find((tipoPedido: Tipo) => tipoPedido.nombre === form.value.tipo),
      colores: coloresRet
    }
  
    this.service.create(nuevoPedido).
    pipe(filter(e => e instanceof HttpResponse))
    .subscribe( (e: any) => { // revisar el any
        this.currentPedido = e.body as Pedido
        this.service.toggle(); // para que se actualice el contador del Sidebar
        this.loadingAlta = false;
        this.msg.success('Pedido generado satisfactoriamente!');
    }),
    () => {
        this.loadingAlta = false;
        this.msg.error('Fallo la generación del pedido!');
    }
  }

  async handleChange({ file, fileList }: NzUploadChangeParam): Promise<void> {
    //console.log("Handle Change")
    const status = file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      this.msg.success(`${file.name} Agregado el archivo correctamente!`);

      file['preview'] = await this.getBase64(file.originFileObj!);
      this.fileList = fileList.map((nZFile: NzUploadFile) => {
        if(nZFile.response.id === file.response.id) {
          return {
            ...nZFile, url: file['preview']
          }
        }
        else {
          return nZFile;
        }
      });
      
      let newFileDB: FileDB = {
        id: file.response.id,
        name: file.response.name,
        type: file.response.type,
        data: file.response.data,
        requerimientos: file.response.requerimientos,
        url: file.url || file['preview'],
        comentarios : []
      }

      let currentPedidoCopy = JSON.parse(JSON.stringify(this.currentPedido))
      currentPedidoCopy.files = [...currentPedidoCopy.files, newFileDB ]

      //if(this.currentPedido && this.currentPedido.files) 
      this.service.update(currentPedidoCopy).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => { // revisar el any
            //this.uploading = false;
            let pedido = (e.body as Pedido) 
            this.currentPedido = pedido;
            this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
              return {
                ...file, url: this.fileList.find((nZFile: NzUploadFile) => nZFile.response.id === file.id)?.url
              }
            });

            let currentFileAux: FileDB | undefined = this.currentPedido.files?.find((file: FileDB) => file.id === newFileDB.id);
            if (currentFileAux && this.files) this.files = [...this.files, currentFileAux ] // this.files?.push(currentFileAux); 
            this.currentFile = currentFileAux;
            if(this.currentFile) this.currentFile.comentarios = [] 
            /*
            if(newFile) {
              this.currentFile = {...newFile, url: newFileDB.url }; // ref. al current File
              if(this.files) this.files = [...this.files, this.currentFile] 
              //this.files?.push(this.currentFile) // Agrego el current File a la lista de Files subidos
              //this.currentPedido.files?.push(this.currentFile);
            }
            */
            //this.files = this.files?.slice(-3); // Me quedo con los ultimos tres Files

            //console.log("Current Pedido :", this.currentPedido)
            //console.log("Current File :", this.currentFile)
            //console.log("Files :", this.files)
            //console.log("FileList :", this.fileList)
            this.msg.success('Se actualizo el pedido correctamente!');
        }),
        () => {
            this.currentPedido?.files?.pop();
            this.msg.error('Fallo la generación del pedido!');
        }
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  };

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  handlePreview = (file: NzUploadFile): void => {
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  eliminarPedido = () :void => {
    if(!this.currentPedido) {
      this.msg.warning("Debe generar un pedido antes de proceder a eliminarlo")
    }
    else {
      this.loadingEliminarPedido = true;
      this.service.eliminar(this.currentPedido?.id).
      pipe(filter(e => e instanceof HttpResponse))
      .subscribe( (e: any) => {
        this.resetForm();
        this.msg.success(e.body.message);
        this.loadingEliminarPedido = false;
      }),
      (e: any) => {
          // Ojo, no esta catcheando el error 
          this.msg.error(e.body.message);
          this.loadingEliminarPedido = false;
      }
    }
  };

  onClickDeleteFile = (event: MouseEvent, item: FileDB) => {
    event.preventDefault()
    //console.log("FileList :", this.fileList)
    this.service.update({
      ...this.currentPedido,
      files: this.currentPedido?.files?.filter((file: FileDB) => file.id !== item.id)
    }).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => { // revisar el any
            this.files = this.files?.filter((file: FileDB) => item.id !== file.id) 
            this.fileList = this.fileList.filter((file: NzUploadFile) => file.response.id !== item.id)
            this.currentPedido = (e.body as Pedido);
            
            this.currentPedido.files = this.currentPedido.files?.map((f: FileDB) => {
              return {
                ...f, url: this.fileList.find((nZFile: NzUploadFile) => nZFile.response.id === f.id)?.url
              }
            });
            //console.log("Current Pedido :", this.currentPedido)
            this.msg.success('File eliminado correctamente!');
        }),
        () => {
            this.msg.error('No pudo eliminarse el File!');
        }
    //console.log("FileList: ", this.fileList)
    //console.log("CurrentFile: ", this.currentFile)
    //console.log("CurrentPedido: ", this.currentPedido)
    //console.log("CurrentFiles: ", this.files)
  };

  disabledAgregarRequerimiento = () :boolean => {
    return this.currentFile !== undefined && this.currentFile.requerimientos !== undefined && this.currentFile.requerimientos.length >= 8 
  };
  
  agregarRequerimiento = () : void => {
    //console.log("OnClickAgregarRequerimiento")
    let nuevo :Requerimiento = {
      descripcion: '',
      chequeado: false,
      desabilitado: true,
      llave: this.currentFile?.requerimientos?.length
    };
    //this.currentFile?.requerimientos?.push(nuevo); No estamos agregando
    if (this.currentFile && this.currentFile.requerimientos) {
      //console.log("OnClickAgregarRequerimiento")
      this.currentFile.requerimientos = [...this.currentFile.requerimientos, nuevo ]
    }
    //console.log("Current File :", this.currentFile)
  }

  onClickEditFile = (event: MouseEvent, item: FileDB) => {
    event.preventDefault()
    this.currentFile = item;
    this.showModalMiddle();
  };

  onClickComment = (event: MouseEvent, item: any) => {
    event.preventDefault;
    this.currentFile = item; 
    this.showModalComment();
  };

  determineMousePosition = (event: MouseEvent) : {left: number, top: number, posx: number, posy: number, px: number, py: number } => {
    const element :HTMLImageElement = event.target as HTMLImageElement
    const bounds = (event.target as HTMLElement).getBoundingClientRect();
    var left= bounds.left;
    var top= bounds.top;
    var posX = event.pageX - left;
    var posY = event.pageY - top;
    var cw= element.clientWidth
    var ch= element.clientHeight
    var iw= element.naturalWidth
    var ih= element.naturalHeight
    var px= posX/cw*iw
    var py= posY/ch*ih

    return {
      left: left,
      top: top,
      posx: posX,
      posy: posY,
      px: px,
      py: py
    }
  }

  badgeUponImageStyle = (comentario: Comentario) => {
    return {
      position: 'absolute', 
      left: comentario.x.toString() + 'px', 
      top: comentario.y.toString() + 'px'
    }
  };

  // Acá, deberia agregar al objeto comentario el color que quiero que muestre, y despues cambiarlo en el OnClick (cambiarlo en todos menos en el que quiero)
  badgeAddOnBeforeStyle = (comentario: Comentario) => {
    return {
      'margin-top': '4px'
    }
  };

  handleOkMiddle(): void {
    this.agregarTodosLosRequerimientos();
    this.isVisibleMiddle = false;
  }

  handleOkComments() :void {

    this.agregarTodosLosComentarios();
    this.isVisibleModalComment = false;
  };

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  showModalComment(): void {
    this.isVisibleModalComment = true;
  }

  goOutside = () => {
    // Deberia mostrar un modal indicando el pedido generado (brevemente)
    this._router.navigateByUrl('/todos')
  };

  agregarTodosLosComentarios = () => {

    let currentPedidoCopy = JSON.parse(JSON.stringify(this.currentPedido))
   
    currentPedidoCopy = {
      ...currentPedidoCopy, files: currentPedidoCopy.files.map((file: FileDB) => {
        if(file.id === this.currentFile?.id) {
          return this.currentFile
        }
        else {
          return file
        }
      }),
    }
    this.service.update(currentPedidoCopy).
    pipe(filter(e => e instanceof HttpResponse))
    .subscribe( (e: any) => { 
      let pedido = (e.body as Pedido)
      this.currentPedido = pedido;
      this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
        return {
          ...file, url: this.fileList.find((nZFile: NzUploadFile) => nZFile.response.id === file.id)?.url,
          comentarios: file.comentarios 
        }
      });
      let newCurrentFile :FileDB | undefined = this.currentPedido.files?.find((file: FileDB) => file.id === this.currentFile?.id)
      this.currentFile = newCurrentFile

      this.files = this.files?.map((file: FileDB) => {
        if(file.id === this.currentFile?.id) {
          return {
            ...file, comentarios: this.currentFile?.comentarios ? this.currentFile?.comentarios : [] 
          }
        }
        else {
          return file;
        }
      }) 
      this.msg.success('Se agregaron los requerimientos correctamente!');
      //console.log("CurrentFile :", this.currentFile) // EXCELENT
      //console.log("Files :", this.files) // EXCELENT
      //console.log("Current Pedido :", this.currentPedido) // REVISAR
    });
    () => {
      this.msg.error('Hubo un error, no se pudieron agregar los requerimientos!');
    }
  };
  
  agregarTodosLosRequerimientos = () :void => {
    let currentPedidoCopy = JSON.parse(JSON.stringify(this.currentPedido))
    currentPedidoCopy = {
      ...currentPedidoCopy, files: currentPedidoCopy.files.map((file: FileDB) => {
        if(file.id === this.currentFile?.id) {
          return this.currentFile
        }
        else {
          return file
        }
      }),
    }
    this.service.update(currentPedidoCopy).
    pipe(filter(e => e instanceof HttpResponse))
    .subscribe( (e: any) => { 
      let pedido = (e.body as Pedido)
      this.currentPedido = pedido;
      this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
        return {
          ...file, url: this.fileList.find((nZFile: NzUploadFile) => nZFile.response.id === file.id)?.url,
          requerimientos: file.requerimientos?.reverse()
        }
      });
      let newCurrentFile :FileDB | undefined = this.currentPedido.files?.find((file: FileDB) => file.id === this.currentFile?.id)
      this.currentFile = newCurrentFile

      this.files = this.files?.map((file: FileDB) => {
        if(file.id === this.currentFile?.id) {
          return {
            ...file, requerimientos: file.requerimientos?.map((req: Requerimiento) => {
              return {
                ...req, id: this.currentFile?.requerimientos?.find((req2: Requerimiento) => req2.id === req.id)?.id
              }
            })
          }
        }
        else {
          return file;
        }
      }) 
      this.msg.success('Se agregaron los requerimientos correctamente!');
    });
    () => {
      this.msg.error('Hubo un error, no se pudieron agregar los requerimientos!');
    } 
  };

  onChangeReq = (value: string, item: Requerimiento): void => {
      item.descripcion = value;
  };

  onChangeComment = (value: string, item: Comentario): void => {
    item.interacciones = item.interacciones.map((interaccion: Interaccion) => {
      return {
        ...interaccion, texto: value,
      }
    })
  };

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  };

  handleCancelComments(): void {
    if (this.currentFile) {
      this.currentFile.comentarios = this.currentFile.comentarios.filter((com: Comentario) => com.id !== undefined )
    } 
    this.isVisibleModalComment = false;
  };

  onClickFile = (event: MouseEvent) => {
    event.preventDefault();
    let position : {left: number, top: number, posx: number, posy: number, px: number, py: number } = this.determineMousePosition(event);
    
    if (this.currentFile) this.currentFile.comentarios = [...this.currentFile.comentarios,
      {
        x: position.posx, 
        y: position.posy,
        terminado: false,
        isVisible: false,
        interacciones: [
          { 
            texto: '',
            rol: 'USUARIO' // Temporal
          }
        ],
        numero: this.currentFile.comentarios.length === 0 ? 1 : Math.max.apply(null, this.currentFile.comentarios.map((comentario: Comentario) => comentario.numero)) + 1,
        llave:  this.currentFile.comentarios.length === 0 ? 1 : Math.max.apply(null, this.currentFile.comentarios.map((comentario: Comentario) => comentario.numero)) + 1 
     }
    ];
  };

  onClickEliminarComment = (event: MouseEvent, item: Comentario): void => {
    event.preventDefault()
    if(item.id !== undefined) {
      let url = this.currentFile?.url;
      let currentFileCopy = JSON.parse(JSON.stringify(this.currentFile))
      this.fileService.update({
        ...currentFileCopy, comentarios: currentFileCopy?.comentarios?.filter((comentario: Comentario) => comentario.id !== item.id)
      }).
          pipe(filter(e => e instanceof HttpResponse))
          .subscribe( (e: any) => {
            let file = (e.body as FileDB)
            this.currentFile = {...file, url };
            let indexCurrentFileInFiles = this.files?.findIndex((f: FileDB) => f.id === file.id)
            this.files = this.files?.map((file: FileDB, index: number) => {
              if(index === indexCurrentFileInFiles) {
                return {
                  ...file, comentarios: file.comentarios?.filter((comentario: Comentario) => comentario.id !== item.id)
                }
              }
              else {
                return file
              }
            })
            // actualizar la lista de files X
            // actualizar current File X
            // Actualizar current Pedido
            //console.log("Current Pedido:", this.currentPedido) // Hay que eliminar tambien de currentPedido 
            this.msg.success('Se elimino el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, no se pudo eliminar el comentario!');
          }
    }
    else {
      if(this.currentFile) {
        this.currentFile.comentarios = this.currentFile?.comentarios?.filter((comentario: Comentario) => comentario.llave !== item.llave)
      } 
    }
  };

  onClickEliminarReq = (event: MouseEvent, item: Requerimiento): void => {
    event.preventDefault()
    if(item.id !== undefined) {
      let url = this.currentFile?.url;
      let currentFileCopy = JSON.parse(JSON.stringify(this.currentFile))
      this.fileService.update({
        ...currentFileCopy, requerimientos: currentFileCopy?.requerimientos?.filter((req: Requerimiento) => req.id !== item.id)
      }).
          pipe(filter(e => e instanceof HttpResponse))
          .subscribe( (e: any) => { 
            let file = (e.body as FileDB)
            this.currentFile = {...file, url };
            let indexCurrentFileInFiles = this.files?.findIndex((f: FileDB) => f.id === file.id)
            this.files = this.files?.map((file: FileDB, index: number) => {
              if(index === indexCurrentFileInFiles) {
                return {
                  ...file, requerimientos: file.requerimientos?.filter((req: Requerimiento) => req.id !== item.id)
                }
              }
              else {
                return file
              }
            })
            this.msg.success('Se elimino el requerimiento correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, no se pudieron eliminar los requerimientos marcados!');
          }
    }
    else {
      if(this.currentFile) this.currentFile.requerimientos = this.currentFile?.requerimientos?.filter((req: Requerimiento) => req.llave !== item.llave)
    }
  }

  resetForm = () :void => { 
    this.validateForm.reset();
    this.currentPedido = undefined;
    this.currentFile = undefined;
    this.fileList = [];
    this.files = [];
  }

}
