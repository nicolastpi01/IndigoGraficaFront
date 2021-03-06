import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from "ng-zorro-antd/tag";
import { PedidosRoutingModule } from "./pedidos-routing.module";
import { PedidosComponent } from "./pedidos.component";
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from "@angular/forms";
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
    imports: [
      PedidosRoutingModule,
      NzTableModule,
      CommonModule,
      NzTagModule,
      NzButtonModule,
      NzIconModule,
      NzListModule,
      NzCardModule,
      FormsModule,
      NzFormModule,
      ReactiveFormsModule,
      NzBadgeModule,
      NzMessageModule,
      NzSelectModule,
      ScrollingModule
    ],
    declarations: [PedidosComponent],
    exports: [PedidosComponent]
  })
  export class PedidosModule { }