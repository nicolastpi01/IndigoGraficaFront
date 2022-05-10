import { NgModule } from "@angular/core";
import { NuevoRoutingModule } from "./nuevo-routing.module";
import { NuevoComponent } from "./nuevo.component";
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from "ng-zorro-antd/button";
import { ReactiveFormsModule } from "@angular/forms";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzImageModule } from 'ng-zorro-antd/image';


@NgModule({
    imports: [
      NuevoRoutingModule, 
      NzFormModule, 
      NzButtonModule, 
      ReactiveFormsModule, 
      NzSelectModule, 
      NzGridModule, 
      NzDividerModule, 
      NzCardModule, 
      NzUploadModule, 
      NzSpaceModule,
      NzImageModule,
      NzInputModule,
      NzIconModule,
      NzBadgeModule,
      NzMessageModule,
      NzModalModule  
    ],
    declarations: [NuevoComponent],
    exports: [NuevoComponent]
  })
  export class NuevoModule { }