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
  files: Array<FileDB> = []
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
    const status = file.status;
    if (status !== 'uploading') {
    }
    if (status === 'done') {
      this.msg.success(`${file.name} Agregado el archivo correctamente!`);

      // Actualizar el pedido
      file['preview'] = await this.getBase64(file.originFileObj!);
      this.fileList = fileList.map((nZFile: NzUploadFile) => {
        if(nZFile.uid == file.uid) {
          return {
            ...nZFile, url: file['preview']
          }
        }
        else return nZFile
      });
      
      // Armo el nuevo File con la rta del server
      let newFileDB: FileDB = {
        id: file.response.id,
        name: file.response.name,
        type: file.response.type,
        data: file.response.data,
        requerimientos: file.response.requerimientos,
        url: file.url || file['preview']
      }
      
      this.currentPedido?.files?.push(newFileDB); // Agrego el current File al Current Pedido. 

      if(this.currentPedido) this.service.update(this.currentPedido).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => { // revisar el any
            //this.uploading = false;
            //console.log("Pedido response :", e.body);
            let pedido = (e.body as Pedido) 
            this.currentPedido = pedido;
            let lastFile :FileDB | undefined = this.currentPedido.files?.pop();

            if(lastFile) {
              this.currentFile = {...lastFile, url: newFileDB.url }; // ref. al current File 
              this.files.push(this.currentFile) // Agrego el current File a la lista de Files subidos
              this.currentPedido.files?.push(this.currentFile);
            }
            
            this.files = this.files.slice(-3); // Me quedo con los ultimos tres Files
            //console.log("Current Pedido :", this.currentPedido)
            //console.log("Current File :", this.currentFile)
            //console.log("Files :", this.files)
            console.log("FileList :", this.fileList)
            this.msg.success('Se actualizo el pedido correctamente!');
        }),
        () => {
            console.log("Paso por acá")
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

  onClickEditFile = (event: MouseEvent, item: FileDB) => {
    this.currentFile = item;
    this.showModalMiddle();
  }
  
  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

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
    // Hay que llamar al servicio!!
    this.files = this.files.filter((file: FileDB) => item.id !== file.id)
    this.currentPedido = {
      ...this.currentPedido,
      files: this.files
    };
    //this.currentFile = undefined // y si no es el ultimo ?
  
    this.fileList = this.fileList.filter((file: NzUploadFile) => file.response.id !== item.id)

    console.log("FileList: ", this.fileList)
    //console.log("CurrentFile: ", this.currentFile)
    console.log("CurrentPedido: ", this.currentPedido)
    console.log("CurrentFiles: ", this.files)
  };

  disabledAgregarRequerimiento = () :boolean => {
    return this.currentFile !== undefined && this.currentFile.requerimientos.length >= 8 
  };
  
  agregarRequerimiento = () : void => {
    let nuevo :Requerimiento = {
      descripcion: '',
      chequeado: false,
      desabilitado: true,
      llave: this.currentFile?.requerimientos.length
    };
    this.currentFile?.requerimientos.push(nuevo);
    //console.log("Current File :", this.currentFile);
  }

  handleOkMiddle(): void {
    this.isVisibleMiddle = false;
    this.agregarTodosLosRequerimientos();
  }

  goOutside = () => {
    // Deberia mostrar un modal indicando el pedido generado (brevemente)
    this._router.navigateByUrl('/todos')
  };
  
  agregarTodosLosRequerimientos = () :void => {
    // Cambiar por el que updatea el Pedido
    this.fileService.update(this.currentFile).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe( (e: any) => { 
          let file = (e.body as FileDB)
          this.currentFile = file;
          console.log("Current Pedido:", this.currentPedido) 
          this.msg.success('Se agregaron los requerimientos correctamente!');
        }),
        () => {
            this.msg.error('Hubo un error, no se pudieron actualizar los requerimientos!');
        }
  };

  onChangeReq = (value: string, item: Requerimiento): void => {
      item.descripcion = value;
  }

  handleCancelMiddle(): void {
    // Si no guardo los requerimientos deberian vaciarse
    this.isVisibleMiddle = false;
  }

  onClickEliminarReq = (event: MouseEvent, item: Requerimiento): void => {
    event.preventDefault
    /*
    let currentReq = this.requerimientos.find((req: RequerimientoUbicacion) => req.index === this.index)
    if(currentReq) {
      let filter = currentReq.requerimientos.filter((req: Requerimiento) => req.key !== item.key)
      currentReq!.requerimientos = filter
    }
    */
    if(item.id != undefined) {
      // Si tiene id es porque se guardo, entonces debo llamar al servicio de actualizar Pedido
      if(this.currentFile) this.currentFile.requerimientos = this.currentFile?.requerimientos.filter((req: Requerimiento) => req.id !== item.id)
      this.fileService.update(this.currentFile).
          pipe(filter(e => e instanceof HttpResponse))
          .subscribe( (e: any) => { 
            let file = (e.body as FileDB)
            this.currentFile = file;
            console.log("Current Pedido:", this.currentFile) 
            this.msg.success('Se actualizo el pedido correctamente!');
          }),
          () => {
              this.msg.error('Hubo un error, no se pudieron actualizar los requerimientos!');
          }
    }
    else {
      if(this.currentFile) this.currentFile.requerimientos = this.currentFile?.requerimientos.filter((req: Requerimiento) => req.llave !== item.llave)
      //console.log("Current File :", this.currentFile);
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
