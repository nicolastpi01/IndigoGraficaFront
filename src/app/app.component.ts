import { Component } from '@angular/core';
import { PedidoService } from './pages/pedido.service';
import { PENDIENTEATENCION } from './utils/const/constantes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  cantidad? : number
  title = 'indigo'

  constructor(private service: PedidoService) {}

  ngOnInit() {
    this.cantidadPedidos()
  }

  cantidadPedidos () {
    this.service.getPedidos(PENDIENTEATENCION)
    .subscribe(pedidos => this.cantidad = pedidos.length);
  }
}
