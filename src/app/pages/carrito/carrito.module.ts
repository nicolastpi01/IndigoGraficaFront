
import { NgModule } from "@angular/core";
import { CarritoRoutingModule } from "./carrito-routing.module";
import { CarritoComponent } from "./carrito.component";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@NgModule({
    imports: [
      CarritoRoutingModule,
      NzDescriptionsModule,
      NzTagModule,
      NzBadgeModule,
      CommonModule,
      FormsModule,
      NzFormModule,
      NzButtonModule,
      NzIconModule,
      NzPaginationModule  
       
    ],
    declarations: [CarritoComponent],
    exports: [CarritoComponent]
  })
  export class CarritoModule { }