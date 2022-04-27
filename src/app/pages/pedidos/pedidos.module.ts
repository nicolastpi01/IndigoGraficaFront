import { NgModule } from "@angular/core";
import { PedidosRoutingModule } from "./pedidos-routing.module";
import { PedidosComponent } from "./pedidos.component";
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from "@angular/common";
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';


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