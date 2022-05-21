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

// Luego sacar de acá
export interface Requerimiento {
  id?: string, 
  descripcion: string,
  chequeado: boolean,
  desabilitado?: true,
  llave?: number // Pongo key y no funciona, quedo llave por ahora
}
// Luego sacar de acá
export interface RequerimientoUbicacion {
  requerimientos: Array<Requerimiento>,
  position: number,
  index: number 
  uidFile: string
}

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})

export class NuevoComponent implements OnInit {

  panels: Array<{active: boolean, name: string, disabled: boolean}> = [];

  validateForm!: FormGroup;
  fileList: NzUploadFile[]= [];
  tipografias = arrayLetras
  uploading = false;
  loadingEliminarPedido= false;

  previewImage?: string;
  previewVisible = false;

  tiposDePedidos : Array<{ value: string; label: string }> = [] 
  colores : Array<{ value: string; label: string }> = []
  coloresData : Array<Color> = []
  tipoPedidosData : Array<Tipo> = []
  requerimientos: Array<RequerimientoUbicacion> = []; // Todos
  currentPedido: Pedido | undefined;
  currentFile: FileDB | undefined;
  files: Array<FileDB> = []
  //images: Array<String | undefined> = []
  //index = 0;
  //tabs: Array<{name: string, disabled: boolean}> = [];

  isVisibleMiddle = false;
  
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

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    //console.log("Handle Preview")
    //if (!file.url && !file['preview']) {
    //  file['preview'] = await this.getBase64(file.originFileObj!);
    //}
    
    console.log("File requerimientos:", file.response.requerimientos)
    //this.previewImage = file.url || file['preview'];
    //this.previewVisible = true;
  };

  
  
  

  async handleChange({ file, fileList }: NzUploadChangeParam): Promise<void> {
    console.log("Ejecuto handleChange")
    const status = file.status;
    if (status !== 'uploading') {
      //console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} Agregado el archivo correctamente!`);
      // Actualizar el pedido

      file['preview'] = await this.getBase64(file.originFileObj!);
      //this.previewImage = file.url || file['preview'];
      
      //console.log("File :", file); 
      let newFileDB: FileDB = {
        id: file.response.id,
        name: file.response.name,
        type: file.response.type,
        data: file.response.data,
        requerimientos: file.response.requerimientos,
        url: file.url || file['preview']
      }

      
      //this.previewVisible = true;
      
      this.currentFile = newFileDB;
      this.currentPedido?.files?.push(newFileDB);

      
      this.files.push(newFileDB)

      this.files = this.files.slice(-3);

      //console.log("Files: ", this.files)

      //console.log("CurrentFile :", newFileDB)
      /*
      console.log("typeof:", typeof(newFileDB.data) )
      */
      
      if(this.currentPedido) this.service.update(this.currentPedido).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe(async (e: any) => { // revisar el any
            //this.uploading = false;
            //console.log("Pedido response :", e.body);
            let pedido = (e.body as Pedido)
            this.currentPedido = pedido; 
            //let copiedFiles :FileDB[] | undefined = JSON.parse(JSON.stringify(pedido.files));
            //this.currentFile = copiedFiles?.pop();
            //await this.handlePreview(file)

            //console.log("FileList :", this.fileList);
            
            /*
            console.log("Files:", pedido.files )
            this.files = pedido.files ? pedido.files : [];

            let copiedFiles :FileDB[] | undefined = JSON.parse(JSON.stringify(pedido.files));
            this.currentFile = copiedFiles?.pop();

            console.log("blob:", this.currentFile?.data)
            //if(newFileDB && newFileDB.data) {
            //  newFileDB.url = await this.getBase64Dos(newFileDB.data.Blob())
            //}
            */
            //console.log("CurrentFile :", newFileDB)
             

            

            //let url: fileNz.url //|| fileNz['preview']
            
            
            //this.currentFile = this.currentPedido.files?.find((file: FileDB) => file.id === newFileDB.id);
              
            
            //this.newTab("File "+`${this.fileList.length}`) // actualiza el Index

            //this.disabledAgregarRequerimiento = false;
          /*
            let newReq :RequerimientoUbicacion = {
              position: this.fileList.length,
              requerimientos: [],
              index: this.index,
              uidFile: file.uid 
             }
            this.requerimientos.push(newReq);
            */
            //console.log("Current Pedido :", this.currentPedido)
            //console.log("Current File :", this.currentFile)
            this.msg.success('Se actualizo el pedido correctamente!');
        }),
        () => {
            this.msg.error('Fallo la generación del pedido!');
        }
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  };

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

  disabledAgregarRequerimiento = () :boolean => {
    return this.currentFile == undefined || 
              this.currentFile.requerimientos == undefined || 
                this.currentFile.requerimientos.length >= 9 
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

  /*
  newTab(name: string): void {
    this.tabs.push({
      name: name,
      disabled: false
    });
    this.index = this.tabs.length - 1;
  }

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }
  */

  findRequerimientos = () => {
    //return this.requerimientos.find((req: RequerimientoUbicacion) => req.index === this.index)!.requerimientos;
    return this.currentFile?.requerimientos;
  }

  onClickAlta(): void {
    if (this.validateForm.valid) {
      this.handleUpload()
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

  /*
  beforeUpload = (file: NzUploadFile): boolean => {
    //if(this.currentRequerimientos !== undefined) {
    //  this.requerimientos.push(this.currentRequerimientos) // guardo una lista de RequerimientoUbicacion
    //}
  console.log("Me ejecuto beforeUpload")  
  this.newTab("File "+`${this.fileList.length}`) // actualiza el Index

  let newReq :RequerimientoUbicacion = {
    position: this.fileList.length,
    requerimientos: [],
    index: this.index,
    uidFile: file.uid // Si borro la imagen quiero borrar el requerimientoUbicacion tambien
   }
    this.requerimientos.push(newReq);   
    this.fileList = this.fileList.concat(file)
    this.disabledAgregarRequerimiento = false;
      
    return false
  };
  */

  agregarRequerimiento = () : void => {
    //let currentReq = this.requerimientos.find((req: RequerimientoUbicacion) => req.index === this.index)
    let nuevo :Requerimiento = {
      descripcion: '',
      chequeado: false,
      desabilitado: true,
      llave: this.currentFile?.requerimientos.length
    };
    this.currentFile?.requerimientos.push(nuevo);
    console.log("Current File :", this.currentFile);
    //currentReq?.requerimientos.push(nuevo);
  }

  agregarTodosLosRequerimientos = () :void => {
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
    console.log("Current File :", this.currentFile)
}

onChangeSelectedIndexTab = (i: number): void => {
  console.log("Index", i);
  this.currentFile = this.currentPedido?.files?.find((file: FileDB, index: number) => index === i);
  console.log("CurrentFile: ", this.currentFile)
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

agregar = (item: Requerimiento): void => {}

handleUpload(): void {

  this.uploading = true;

  let form = this.validateForm;

  let coloresRet :Color[] = [];
  form.value.color.forEach( (colorHexCode: string) => {
    let colorRet = this.coloresData.find( (colorData: Color) => colorData.hexCode === colorHexCode)
    if (colorRet) coloresRet.push(colorRet);
  })

  let nuevoPedido : any = {
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
      this.uploading = false;
      this.currentPedido = e.body as Pedido
      this.service.toggle();
      this.msg.success('Pedido generado satisfactoriamente!');
  }),
  () => {
      this.uploading = false;
      this.msg.error('Fallo la generación del pedido!');
  }
}
onClickFile = (event: MouseEvent, item: FileDB) => {
  this.currentFile = item;
  this.showModalMiddle();
  //console.log("El item: ", item)
}

showModalMiddle(): void {
  this.isVisibleMiddle = true;
}

handleOkMiddle(): void {
  //console.log('click ok');
  this.isVisibleMiddle = false;
  this.agregarTodosLosRequerimientos();
}

handleCancelMiddle(): void {
  this.isVisibleMiddle = false;
}

resetForm = () :void => { 
  this.validateForm.reset();
  this.currentPedido = undefined;
  this.fileList = [];
  //this.disabledAgregarRequerimiento = true;
  this.requerimientos = [];
  //this.tabs = [];
  //this.index = 0;
}

eliminarPedido = () :void => {
  if(!this.currentPedido) {
    this.msg.warning("Debe generar un pedido antes de proceder a eliminarlo")
  }
  else {
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



}


/*
handleUpload(): void {

  this.uploading = true;
  let form = this.validateForm;

  let coloresRet :Color[] = [];
  form.value.color.forEach( (colorHexCode: string) => {
    let colorRet = this.coloresData.find( (colorData: Color) => colorData.hexCode === colorHexCode)
    if (colorRet) coloresRet.push(colorRet);
  })

  const formData = new FormData()
  this.fileList.forEach((file: any) => {
    formData.append('files[]', file);
  })
  
  let nuevoPedido : any = {
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

  formData.append('pedido', new Blob([JSON.stringify(nuevoPedido)], {
    type: "application/json"
  }));

  let requerimientosRet : Array<Array<Requerimiento>> = [];
  this.requerimientos.map((req: RequerimientoUbicacion) => requerimientosRet.push(req.requerimientos))

  formData.append('requerimientos', new Blob([JSON.stringify(requerimientosRet)],{
    type: "application/json"
  }));
  
  this.service.upload(formData).
  pipe(filter(e => e instanceof HttpResponse))
  .subscribe( () => {
      this.uploading = false;
      this.fileList = [];
      this.msg.success('Pedido generado satisfactoriamente!');
      this._router.navigateByUrl('/todos')
  }),
  () => {
      this.uploading = false;
      this.msg.error('Fallo la generación del pedido!');
  }
}
*/