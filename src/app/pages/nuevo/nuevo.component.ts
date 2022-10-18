import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { PENDIENTEATENCION, tipografias as arrayLetras } from 'src/app/utils/const/constantes';
import { Tipo } from 'src/app/interface/tipo';
import { Color } from 'src/app/interface/color';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { filter, Observable, Observer } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import {  NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ColorService } from 'src/app/services/color.service';
import { TipoPedidoService } from 'src/app/services/tipo-pedido.service';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';
import { FileService } from 'src/app/services/file.service';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { PosicionService } from 'src/app/services/posicion.service';
import { getBase64 } from 'src/app/utils/functions/functions';
import { TokenStorageService } from 'src/app/services/token-storage.service';

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
  currentFile: FileDB | undefined;
  files: Array<FileDB> | undefined = []
  loadingEliminarPedido= false;
  dateFormat = 'dd/MM/YYYY';
  isVisibleModalComment = false;
  esEdicion = false
  pedidoId?: string

  isLoggedIn = false;
  currentUser: any;

  //@ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport | undefined;
  @ViewChild('viewport', { read: ElementRef }) viewport!: ElementRef;

  //@ViewChild('someVar') el!: ElementRef;
  //@ViewChild('dummyClick', { static: true }) dummyClickRef: ElementRef | undefined;

  constructor(private fb: FormBuilder, private service :PedidoService, private fileService: FileService, 
    private tipoService: TipoPedidoService, private colorService :ColorService, private _router: Router, 
    private msg: NzMessageService, private posService: PosicionService, private tokenService: TokenStorageService,  
    private route: ActivatedRoute) {} // para que se usa rd ?

  ngOnInit(): void {
    
    this.isLoggedIn = !!this.tokenService.getToken();
    if (this.isLoggedIn) {
      this.currentUser = this.tokenService.getUser();
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
      this.loadPedidoIfExist()
  
      this.panels = this.initialPanelState();
      //this.dummyClickRef?.nativeElement.click()
      //this.dummyClickRef?.nativeElement.focus()  
    }
  };

  initialPanelState = () :Array<{active: boolean, name: string, disabled: boolean}> => {
    return [
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
  };

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

  generateUrl = (file: FileDB) : string=> {
    return 'data:' + file.type + ';base64,' + file.data
  };

  loadPedidoIfExist(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id')||undefined
    
    if(this.pedidoId){
      this.esEdicion = true
      this.service.getPedido(this.pedidoId).subscribe(pedido => {
        this.currentPedido = pedido
        this.files = this.currentPedido.files?.map((file: FileDB) => {
          return {
            ...file, url: this.generateUrl(file)  
          }
        });
        this.panels[1].disabled = false
        const date = pedido.fechaEntrega as string
        const newDate = new Date(date)
        const colores = pedido.colores?.map(c => this.colores.find(color => color.value === c.hexCode)?.value)
        this.validateForm.setValue({
          titulo: pedido.nombre,
          subtitulo: pedido.nombreExtendido,
          cantidad: 1,
          alto:  50,
          ancho: 50,
          datePicker: newDate,
          tipografia: pedido.tipografia,
          tipo: this.tiposDePedidos.find(tipoPedido => tipoPedido.value === pedido.tipo?.nombre)?.value,
          color: colores,
          comentario: pedido.descripcion,
          remember: true
        })
      })
      debugger
      let nuevoMenu = document.getElementById("nuevo-menu")
      nuevoMenu!.classList.remove('ant-menu-item-selected')
    }else{
      this.esEdicion = false
      this.pedidoId = undefined
    }
  }

  

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
      this.enableImagePanels()
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  enableImagePanels():void{
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
      propietario: {
        ubicacion: this.currentUser.ubicacion,
        apellido: this.currentUser.apellido,
        nombre: this.currentUser.nombre,
        contacto: this.currentUser.contacto, 
        id: this.currentUser.id,
        username: this.currentUser.username,
        email: this.currentUser.email
      },
      
      fechaEntrega: form.value.datePicker,
      encargado: null,
      tipo: this.tipoPedidosData.find((tipoPedido: Tipo) => tipoPedido.nombre === form.value.tipo),
      colores: coloresRet
    }

    if(this.esEdicion){
      nuevoPedido.id = this.pedidoId
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
    const status = file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      this.msg.success(`${file.name} Agregado el archivo correctamente!`);

      file['preview'] = await getBase64(file.originFileObj!);
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
        comentarios: file.response.comentarios,
        //requerimientos: file.response.requerimientos,
        url: file.url || file['preview'],
        //comentarios : []
      }

      let currentPedidoCopy = JSON.parse(JSON.stringify(this.currentPedido))
      currentPedidoCopy.files = [...currentPedidoCopy.files, newFileDB ]

      this.service.update(currentPedidoCopy).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => { // revisar el any
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
            this.msg.success('File eliminado correctamente!');
        }),
        () => {
            this.msg.error('No pudo eliminarse el File!');
        }
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

  /*
  checkInputStyle = (comentario: Comentario) => {
    if(comentario.isVisible) return 'autofocus'
    else return ''
  };
  */

  // Acá, deberia agregar al objeto comentario el color que quiero que muestre, y despues cambiarlo en el OnClick (cambiarlo en todos menos en el que quiero)
  badgeAddOnBeforeStyle = (comentario: Comentario) => {
    return {
      'margin-top': '4px'
    }
  };

  handleOkComments() :void {

    this.agregarTodosLosComentarios();
    this.isVisibleModalComment = false;
  };

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
    });
    () => {
      this.msg.error('Hubo un error, no se pudieron agregar los requerimientos!');
    }
  };
  

  onChangeComment = (value: string, item: Comentario): void => {
    item.interacciones = item.interacciones.map((interaccion: Interaccion) => {
      return {
        ...interaccion, texto: value,
      }
    })
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
    
    
      if (this.currentFile) {
        //this.currentFile.comentarios = this.currentFile.comentarios.map((comentario: Comentario) => {
        //  return {
        //    ...comentario, isVisible : false
        //  }
        //});  
        this.currentFile.comentarios = [...this.currentFile.comentarios,
        {
          x: position.posx, 
          y: position.posy,
          terminado: false,
          isVisible: true, // puede usarse para ver si uso el autofocus o no
          respondido: false,
          creationDate: new Date(), 
          interacciones: [
            { 
              texto: '',
              rol: 'USUARIO', // Temporal
              key: 1
            }
          ],
          numero: this.currentFile.comentarios.length === 0 ? 1 : Math.max.apply(null, this.currentFile.comentarios.map((comentario: Comentario) => comentario.numero)) + 1,
          llave:  this.currentFile.comentarios.length === 0 ? 1 : Math.max.apply(null, this.currentFile.comentarios.map((comentario: Comentario) => comentario.numero)) + 1 
       }
      ];

      this.viewport.nativeElement.scrollIntoView({block: "end", behavior: "smooth"}); // Funciona parcialmente
      
    };
  };

  ordenar = (comentarios: Comentario[]) :Comentario[] => {
    let max = Math.max.apply(null, comentarios.map((comentario: Comentario) => comentario.numero))
    if(comentarios.length === max) {
      return comentarios
    }
    else {
      return comentarios.map((comentario: Comentario, index: number) => ({
        ...comentario, numero: index+1
      }));
    }
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

            // ACÁ ORDENO
            if(this.currentFile) {
              this.currentFile.comentarios = this.ordenar(this.currentFile.comentarios)
            };
            this.msg.success('Se elimino el comentario correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, no se pudo eliminar el comentario!');
          }
    }
    else {
      if(this.currentFile) {
        // ACÁ ORDENO
        this.currentFile.comentarios = this.ordenar(this.currentFile?.comentarios?.filter((comentario: Comentario) => comentario.llave !== item.llave))
      } 
    }
  };

  resetForm = () :void => { 
    this.validateForm.reset();
    this.currentPedido = undefined;
    this.currentFile = undefined;
    this.fileList = [];
    this.files = [];
    this.panels = this.initialPanelState();
  };

}
