
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NuevoRoutingModule } from './nuevo-routing.module';
import { NuevoComponent } from './nuevo.component';

@NgModule({
    imports: [
      NuevoRoutingModule, 
      NzButtonModule,
      NzUploadModule,
      NzFormModule
    ],
    declarations: [NuevoComponent],
    exports: [NuevoComponent]
  })
  export class NuevoModule { }