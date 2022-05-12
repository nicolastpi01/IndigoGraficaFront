import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../pedido.service';
import { tipografias as arrayLetras } from 'src/app/utils/const/constantes';
import { todosLosTiposDePedidos } from 'src/app/utils/const/constantes';
import { todosLosColores } from 'src/app/utils/const/constantes';
import { Tipo } from 'src/app/objects/tipo';
import { Color } from 'src/app/objects/color';
import { PendienteAtencion } from 'src/app/objects/estado';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { filter } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import {  NzUploadFile } from 'ng-zorro-antd/upload';

// Luego sacar de acá
export interface Requerimiento {
  id?: string, // sacar!!
  descripcion: string,
  chequeado: boolean,
  desabilitado?: true,
  key?: number // Usar esto en todo caso
}
// Luego sacar de acá
export interface RequerimientoUbicacion {
  requerimientos: Array<Requerimiento>,
  position: number,
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
  boceto: string = "";
  tipografias = arrayLetras
  uploading = false;

  // NUEVOS //
  //previewImage: string | undefined = '';
  //previewVisible = false;
  // NUEVOS //

  tiposDePedidos : Array<{ value: string; label: string }> = [] 
  colores : Array<{ value: string; label: string }> = []
  requerimientos: Array<Array<Requerimiento>> = []; // Todos
  currentRequerimientos!: RequerimientoUbicacion;
  disabledAgregarRequerimiento: boolean = true;
  

  constructor(private fb: FormBuilder, private service :PedidoService, private _router: Router, private msg: NzMessageService) {}

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
    todosLosTiposDePedidos.forEach((tipo: Tipo) => {
      this.tiposDePedidos.push({
        value: tipo.nombre,
        label: tipo.nombre
      })
    })

    todosLosColores.forEach((color: Color) => {
      this.colores.push({
        label: color.nombre,
        value: color.value
      })
    })
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.agregarPedido(this.validateForm)
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  
  agregarPedido(form: FormGroup) {
    let tipoPedido = todosLosTiposDePedidos.find((tipo: Tipo) => tipo.nombre == form.value.tipo)
  
    let nuevoNuevoPedido : any = {
      cantidad: form.value.cantidad,
      nombre: form.value.titulo,
      nombreExtendido: form.value.subtitulo,
      tipografia: form.value.tipografia,
      alto: form.value.alto,
      ancho: form.value.ancho,
      descripcion: form.value.comentario,
      state: "Pend. Atencion",
      propietario: "Nicolas del Front",
      encargado: null,
    }
    this.service.agregarPedido(nuevoNuevoPedido).subscribe(response => {
      this.msg.success('Agregado pedido exitosamente!');
      this._router.navigateByUrl('/todos')
    });
  }
  
  beforeUpload = (file: NzUploadFile): boolean => {
    //console.log("File :", file);
    //if(this.currentRequerimientos !== undefined) {
      //console.log("Tengo un current requerimiento, deberia guardarlo antes de seguir")
    //  this.requerimientos.push(this.currentRequerimientos.requerimientos)
    //}
    this.currentRequerimientos = {
      position: this.fileList.length,
      requerimientos: [],
      uidFile: file.uid
    };
    this.fileList = this.fileList.concat(file)
    this.disabledAgregarRequerimiento = false;
    //console.log("FileList Size: ", this.fileList.length)
    //console.log("Current req: ", this.currentRequerimientos)
    console.log("Requerimientos", this.requerimientos)
    return false
  };

  agregarRequerimiento = () : void => {

    let current :Requerimiento = {
      descripcion: '',
      chequeado: false,
      desabilitado: true,
      key: this.currentRequerimientos.requerimientos.length
    };

    this.currentRequerimientos = {
      ...this.currentRequerimientos, requerimientos: [...this.currentRequerimientos.requerimientos, 
        current
      ]
    }
  }

  onChangeReq = (value: string, item: Requerimiento): void => {
    item.descripcion = value;
  }

  agregar = (item: Requerimiento): void => {} // No se usa

handleUpload(): void {
  //console.log("Me ejecute!!")
  const formData = new FormData()
  this.fileList.forEach((file: any) => {
    formData.append('files[]', file);
  })

  let form = this.validateForm;
  let nuevoNuevoPedido : any = {
    cantidad: form.value.cantidad,
    nombre: form.value.titulo,
    nombreExtendido: form.value.subtitulo,
    tipografia: form.value.tipografia,
    alto: form.value.alto,
    ancho: form.value.ancho,
    descripcion: form.value.comentario,
    state: "Pend. Atencion",
    propietario: "Nicolas del Front",
    encargado: null,
    tipo: {
      id:1,
      nombre: "Logo",
      alto: 60,
      ancho: 60,
      tipografia: "sans serif"
    },
    colores: [
      {
          id:10,
          nombre: "Rojo",
          hexCode: "#FF0000"
      },
      {
          id:9,
          nombre: "Azul",
          hexCode: "#0000FF"
      }
    ]
  }

  formData.append('pedido', new Blob([JSON.stringify(nuevoNuevoPedido)], {
    type: "application/json"
  }));

  this.requerimientos.push(this.currentRequerimientos.requerimientos) // siempre va

  formData.append('requerimientos', new Blob([JSON.stringify(this.requerimientos)],{
    type: "application/json"
  }));
  
  this.uploading = true;
  
  this.service.upload(formData).
  pipe(filter(e => e instanceof HttpResponse))
  .subscribe( () => {
      this.uploading = false;
      this.fileList = [];
      this.msg.success('upload successfully.');
  }),
  () => {
      this.uploading = false;
      this.msg.error('upload failed.');
  }
}

resetForm = () :void => { 
  this.fileList = []
  this.validateForm.reset();
}

}
