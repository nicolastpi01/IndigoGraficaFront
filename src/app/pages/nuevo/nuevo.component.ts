import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../../services/pedido.service';
import { PENDIENTEATENCION, tipografias as arrayLetras } from 'src/app/utils/const/constantes';
import { Tipo } from 'src/app/interface/tipo';
import { Color } from 'src/app/interface/color';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { filter } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import {  NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ColorService } from 'src/app/services/color.service';
import { TipoPedidoService } from 'src/app/services/tipo-pedido.service';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';

// Luego sacar de acá
export interface Requerimiento {
  id?: string, 
  descripcion: string,
  chequeado: boolean,
  desabilitado?: true,
  key?: number 
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

  validateForm!: FormGroup;
  fileList: NzUploadFile[]= [];
  //boceto: string = "";
  tipografias = arrayLetras
  uploading = false;

  previewImage: string = '';
  previewVisible = false;

  tiposDePedidos : Array<{ value: string; label: string }> = [] 
  colores : Array<{ value: string; label: string }> = []
  coloresData : Array<Color> = []
  tipoPedidosData : Array<Tipo> = []
  requerimientos: Array<RequerimientoUbicacion> = []; // Todos
  disabledAgregarRequerimiento: boolean = true;
  currentPedido!: Pedido;

  index = 0;
  tabs: Array<{name: string, disabled: boolean}> = [];
  
  constructor(private fb: FormBuilder, private service :PedidoService, private tipoService: TipoPedidoService, private colorService :ColorService, 
    private _router: Router, private msg: NzMessageService) {}

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

  }

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    console.log("Ejecuto handleChange")
    const status = file.status;
    if (status !== 'uploading') {
      //console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} Agregado el archivo correctamente!`);
      // Actualizar el pedido
      console.log("File :", file); 
      let newFileDB: FileDB = {
        id: file.response.id,
        name: file.response.name,
        type: file.response.type,
        data: file.response.data,
        requerimientos: file.response.requerimientos
      }
      this.currentPedido.files?.push(newFileDB);
      
      this.service.update(this.currentPedido).
        pipe(filter(e => e instanceof HttpResponse))
        .subscribe( (e: any) => { // revisar el any
            //this.uploading = false;
            //console.log("Pedido response :", e.body);
            this.currentPedido = e.body as Pedido
            //console.log("Current Pedido :", this.currentPedido)
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

  findRequerimientos = () => {
    return this.requerimientos.find((req: RequerimientoUbicacion) => req.index === this.index)!.requerimientos;
  }

  onClickAlta(): void {
    if (this.validateForm.valid) {
      this.handleUpload()
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    //if(this.currentRequerimientos !== undefined) {
    //  this.requerimientos.push(this.currentRequerimientos) // guardo una lista de RequerimientoUbicacion
    //}
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

  agregarRequerimiento = () : void => {
    let currentReq = this.requerimientos.find((req: RequerimientoUbicacion) => req.index === this.index)
    let nuevo :Requerimiento = {
      descripcion: '',
      chequeado: false,
      desabilitado: true,
      key: currentReq!.requerimientos.length
    };
    currentReq?.requerimientos.push(nuevo);
  }

onChangeReq = (value: string, item: Requerimiento): void => {
    item.descripcion = value;
}

onChangeSelectedIndexTab = (index: number): void => {
}

onClickEliminarReq = (event: MouseEvent, item: Requerimiento): void => {
  event.preventDefault
  let currentReq = this.requerimientos.find((req: RequerimientoUbicacion) => req.index === this.index)
  if(currentReq) {
    let filter = currentReq.requerimientos.filter((req: Requerimiento) => req.key !== item.key)
    currentReq!.requerimientos = filter
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
      //console.log("Pedido response :", e.body);
      this.currentPedido = e.body as Pedido
      //console.log("Current Pedido :", this.currentPedido)
      this.msg.success('Pedido generado satisfactoriamente!');
  }),
  () => {
      this.uploading = false;
      this.msg.error('Fallo la generación del pedido!');
  }
}

clickeo() {
  console.log("Clickeo")
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
resetForm = () :void => { 
  this.validateForm.reset();
  this.fileList = [];
  this.disabledAgregarRequerimiento = true;
  this.requerimientos = [];
  this.tabs = [];
  this.index = 0;
}

}
