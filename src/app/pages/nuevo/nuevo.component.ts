import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from 'src/app/objects/pedido';
import { PedidoService } from '../pedido.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { mockPropietario, tipografias as arrayLetras } from 'src/app/utils/const/constantes';
import { todosLosTiposDePedidos } from 'src/app/utils/const/constantes';
import { todosLosColores } from 'src/app/utils/const/constantes';
import { Tipo } from 'src/app/objects/tipo';
import { Color } from 'src/app/objects/color';
import { PendienteAtencion } from 'src/app/objects/estado';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  validateForm!: FormGroup;
  fileList: NzUploadFile[] = [];
  boceto: string = "";
  tipografias = arrayLetras
  uploading = false;

  tiposDePedidos : Array<{ value: string; label: string }> = [] 
  colores : Array<{ value: string; label: string }> = [] 
  

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
        
    let nuevoPedido : Pedido = {
      propietario : mockPropietario,
      cantidad: form.value.cantidad,
      nombre: form.value.titulo,
      nombreExtendido: form.value.subtitulo,
      tipografia: form.value.tipografia,
      tipo: tipoPedido,
      alto: form.value.alto,
      ancho: form.value.ancho,
      descripcion: form.value.comentario,
      colores: form.value.color,
      boceto:  this.fileList[0].originFileObj,
      estado: new PendienteAtencion()
    }

    

    this.service.agregarPedido(nuevoPedido).subscribe(response => {
      //console.log(response)
      this.msg.success('Agregado pedido exitosamente!');
      this._router.navigateByUrl('/todos')

    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file)
    return false
  };

  resetForm = () :void => { 
    this.fileList = []
    this.validateForm.reset();
  }


}
