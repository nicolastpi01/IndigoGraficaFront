

import { NgModule } from "@angular/core";
import { EditarRoutingModule } from "./editar-routing.module";
import { EditarComponent } from "./editar.component";

@NgModule({
    imports: [
      EditarRoutingModule, 
    ],
    declarations: [EditarComponent],
    exports: [EditarComponent]
  })
  export class EditarModule { }