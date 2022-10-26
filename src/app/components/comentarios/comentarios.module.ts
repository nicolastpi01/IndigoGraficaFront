import { NgModule } from "@angular/core";
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzListModule } from "ng-zorro-antd/list";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ReactiveFormsModule } from "@angular/forms";
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { ComentariosComponent } from "./comentarios.component";

@NgModule({
    imports: [
      NzDescriptionsModule,
      NzTagModule,
      NzBadgeModule,
      CommonModule,
      FormsModule,
      NzFormModule,
      NzButtonModule,
      NzIconModule,
      NzPaginationModule,
      NzLayoutModule,
      NzSpinModule,
      NzListModule,
      NzCardModule,
      NzCheckboxModule,
      NzDatePickerModule,
      ReactiveFormsModule,
      NzInputModule,
      NzModalModule,
      NzTypographyModule,
      NzImageModule,
      ScrollingModule,
      NzCommentModule,
      NzAvatarModule,
      NzTabsModule
             
    ],
    declarations: [ComentariosComponent],
    exports: [ComentariosComponent]
  })
  export class ComentariosModule { }