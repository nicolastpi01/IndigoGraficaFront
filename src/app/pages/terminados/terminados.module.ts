
import { NgModule } from "@angular/core";
import { PedidosListModule } from "src/app/components/pedidosList/pedidosList.module";
import { TerminadosRoutingModule } from "./terminados-routing.module";
import { TerminadosComponent } from "./terminados.component";


@NgModule({
    imports: [
      TerminadosRoutingModule,
      PedidosListModule
    ],
    declarations: [TerminadosComponent],
    exports: [TerminadosComponent]
  })
  export class TerminadosModule { }