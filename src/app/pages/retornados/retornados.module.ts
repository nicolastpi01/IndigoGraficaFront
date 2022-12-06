
import { NgModule } from "@angular/core";
import { PedidosListModule } from "src/app/components/pedidosList/pedidosList.module";
import { RetornadosRoutingModule } from "./retornados-routing.module";
import { RetornadosComponent } from "./retornados.component";

@NgModule({
    imports: [
      RetornadosRoutingModule,
      PedidosListModule 
    ],
    declarations: [RetornadosComponent],
    exports: [RetornadosComponent]
  })
  export class RetornadosModule { }