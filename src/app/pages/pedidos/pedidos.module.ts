import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from "ng-zorro-antd/tag";
import { PedidosRoutingModule } from "./pedidos-routing.module";
import { PedidosComponent } from "./pedidos.component";

@NgModule({
    imports: [
      PedidosRoutingModule,
      NzTableModule,
      CommonModule,
      NzTagModule,
      NzButtonModule,
      NzIconModule 
      
    ],
    declarations: [PedidosComponent],
    exports: [PedidosComponent]
  })
  export class PedidosModule { }