import { NgModule } from "@angular/core";
import { PedidosListModule } from "src/app/components/pedidosList/pedidosList.module";
import { RevisionRoutingModule } from "./revision-routing.module";
import { RevisionComponent } from "./revision.component";

@NgModule({
    imports: [
      RevisionRoutingModule,
      PedidosListModule 
    ],
    declarations: [RevisionComponent],
    exports: [RevisionComponent]
  })
  export class RevisionModule { }