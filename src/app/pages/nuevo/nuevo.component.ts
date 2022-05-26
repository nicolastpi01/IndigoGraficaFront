import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { PENDIENTEATENCION, tipografias as arrayLetras } from 'src/app/utils/const/constantes';
import { Tipo } from 'src/app/interface/tipo';
import { Color } from 'src/app/interface/color';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { filter, Observable } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import {  NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ColorService } from 'src/app/services/color.service';
import { TipoPedidoService } from 'src/app/services/tipo-pedido.service';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';
import { FileService } from 'src/app/services/file.service';
import { Requerimiento } from 'src/app/interface/requerimiento';
import { ThisReceiver } from '@angular/compiler';


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

  constructor(private fb: FormBuilder, private service :PedidoService, private fileService: FileService, private tipoService: TipoPedidoService, 
    private colorService :ColorService, private _router: Router, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      titulo: [null, [Validators.required]],
      subtitulo: [null, [Validators.required]],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      color: [null, []],
      alto: [null, [ Validators.min(1)]],
      ancho: [null, [ Validators.min(1)]],
      tipografia: [null, []],
      tipo:  [null, [Validators.required]],
      comentario: [null, []],
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

  // Alta del Form
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
      cantidad: form.value.cantidad,
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
          console.log("Paso por aca")
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
        url: file.url || file['preview']
      }
      this.currentPedido?.files?.push(newFileDB); 

      //if(this.currentPedido && this.currentPedido.files) 
      this.service.update(this.currentPedido).
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
            if (currentFileAux) this.files?.push(currentFileAux);
            this.currentFile = currentFileAux;
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
      console.log("OnClickAgregarRequerimiento")
      this.currentFile.requerimientos = [...this.currentFile.requerimientos, nuevo ]
    }
    //console.log("Current File :", this.currentFile)
  }

  onClickEditFile = (event: MouseEvent, item: FileDB) => {
    console.log("OnClickEditFile")
    this.currentFile = item;
    this.showModalMiddle();
  }

  handleOkMiddle(): void {
    console.log("onClickAceptarModal")
    this.agregarTodosLosRequerimientos();
    this.isVisibleMiddle = false;
  }

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  goOutside = () => {
    // Deberia mostrar un modal indicando el pedido generado (brevemente)
    this._router.navigateByUrl('/todos')
  };
  
  agregarTodosLosRequerimientos = () :void => {

    /*
    let pedido = (e.body as Pedido) 
    this.currentPedido = pedido;
    this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
      return {
        ...file, url: this.fileList.find((nZFile: NzUploadFile) => nZFile.response.id === file.id)?.url
      }
    });

    let currentFileAux: FileDB | undefined = this.currentPedido.files?.find((file: FileDB) => file.id === newFileDB.id);
    if (currentFileAux) this.files?.push(currentFileAux);
    this.currentFile = currentFileAux;
    */
    this.service.update(this.currentPedido).
    pipe(filter(e => e instanceof HttpResponse))
    .subscribe( (e: any) => { 
      let pedido = (e.body as Pedido)
      this.currentPedido = pedido;
      this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
        return {
          ...file, url: this.fileList.find((nZFile: NzUploadFile) => nZFile.response.id === file.id)?.url
        }
      });
      //let newCurrentFile :FileDB | undefined = this.currentPedido.files?.find((file: FileDB) => file.id === this.currentFile?.id)
      //this.currentFile = newCurrentFile

      //this.files = this.currentPedido.files; 
      /*
      this.files?.map((file: FileDB) => {
        if(file.id === this.currentFile?.id) {
          return {
            ...file, requerimientos: this.currentFile?.requerimientos
            }
          }
          else {
            return file
          }
      });
      */

      this.msg.success('Se agregaron los requerimientos correctamente!');
      //console.log("CurrentFile :", this.currentFile)
      //console.log("Files :", this.files)
      console.log("Current Pedido :", this.currentPedido)
    });
    () => {
      this.msg.error('Hubo un error, no se pudieron agregar los requerimientos!');
    } 
  };

  onChangeReq = (value: string, item: Requerimiento): void => {
      item.descripcion = value;
  }

  handleCancelMiddle(): void {
    // Si no guardo los requerimientos deberian vaciarse los current requerimientos no agregados
    // this.currentFile?.requerimientos?.push(nuevo);
    this.isVisibleMiddle = false;
  };

  onClickEliminarReq = (event: MouseEvent, item: Requerimiento): void => {
    event.preventDefault
    if(item.id !== undefined) {
      // Si tiene id es porque se guardo, entonces debo llamar al servicio de actualizar Pedido
      console.log("Estoy eliminando un req que se persistio")
      // JSON.parse(JSON.stringify(obj1)) deep copy
      //if(this.currentFile) this.currentFile.requerimientos = this.currentFile?.requerimientos?.filter((req: Requerimiento) => req.id !== item.id)
      let url = this.currentFile?.url;
      let currentFileCopy = JSON.parse(JSON.stringify(this.currentFile))
      this.fileService.update({
        ...currentFileCopy, requerimientos: currentFileCopy?.requerimientos?.filter((req: Requerimiento) => req.id !== item.id)
      }).
          pipe(filter(e => e instanceof HttpResponse))
          .subscribe( (e: any) => { 
            //if(this.currentFile) this.currentFile.requerimientos = this.currentFile?.requerimientos?.filter((req: Requerimiento) => req.id !== item.id)
            let file = (e.body as FileDB)
            this.currentFile = {...file, url };
            let indexCurrentFileInFiles = this.files?.findIndex((f: FileDB) => f.id === file.id)
            // ?.requerimientos?.filter((req: Requerimiento) => req.id !== item.id)
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
            /*
            let indexCurrentFileInPedido = this.currentPedido?.files?.findIndex((f: FileDB) => f.id === file.id)
            if(this.currentPedido) this.currentPedido.files = this.currentPedido?.files?.map((file: FileDB, index: number) => {
              if(index === indexCurrentFileInPedido) {
                return {
                  ...file, requerimientos: file.requerimientos?.filter((req: Requerimiento) => req.id !== item.id)
                }
              }
              else {
                return file
              }
            })
            */
            // actualizar la lista de files X
            // actualizar current File X
            // Actualizar current Pedido
            console.log("Current Pedido:", this.currentPedido) // Hay que eliminar tambien de currentPedido
            console.log("Current Files :", this.files)
            console.log("Current File :", this.currentFile) 
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
