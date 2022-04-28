import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from 'src/app/objects/pedido';
import { PedidoService } from '../pedido.service';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  validateForm!: FormGroup;
  
  constructor(private fb: FormBuilder, private service :PedidoService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      titulo: [null, [Validators.required]],
      subtitulo: [null, [Validators.required]],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      color: [null, []],
      alto: [null, [ Validators.min(10)]],
      ancho: [null, [ Validators.min(10)]],
      tipografia: [null, []],
      remember: [true]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      //console.log('submit', this.validateForm.value);
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
    let nuevoPedido : Pedido;
    
    nuevoPedido = (form.value as Pedido) // Crearlo mejor !!!! ya esta dando de alta correctamente !!
    
    this.service.agregarPedido(nuevoPedido).subscribe(response => {
      console.log(response)
    });
  }

}
