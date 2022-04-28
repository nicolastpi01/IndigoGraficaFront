import { NgModule } from "@angular/core";
import { NuevoRoutingModule } from "./nuevo-routing.module";
import { NuevoComponent } from "./nuevo.component";
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from "ng-zorro-antd/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzSelectModule } from 'ng-zorro-antd/select';


@NgModule({
    imports: [NuevoRoutingModule, NzFormModule, NzButtonModule, ReactiveFormsModule, NzSelectModule ],
    declarations: [NuevoComponent],
    exports: [NuevoComponent]
  })
  export class NuevoModule { }