import { NgModule } from "@angular/core";
import { ReservadosRoutingModule } from "./reservados-routing.module";
import { ReservadosComponent } from "./reservados.component";
import { CommonModule } from "@angular/common";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from "@angular/forms";
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@NgModule({
    imports: [
      ReservadosRoutingModule,
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
      ScrollingModule,
      NzDescriptionsModule,
      NzPaginationModule,
      NzSpinModule,
      NzModalModule,
      NzImageModule,
      NzTypographyModule 
    ],
    declarations: [ReservadosComponent],
    exports: [ReservadosComponent]
  })
  export class ReservadosModule { }