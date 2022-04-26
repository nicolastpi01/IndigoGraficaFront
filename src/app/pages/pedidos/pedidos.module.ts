import { NgModule } from "@angular/core";
import { PedidosRoutingModule } from "./pedidos-routing.module";
import { PedidosComponent } from "./pedidos.component";


@NgModule({
    imports: [
      PedidosRoutingModule, 
      
    ],
    declarations: [PedidosComponent],
    exports: [PedidosComponent]
  })
  export class PedidosModule { }