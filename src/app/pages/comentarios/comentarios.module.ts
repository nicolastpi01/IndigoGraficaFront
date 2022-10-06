

import { NgModule } from "@angular/core";
import { ComentariosRoutingModule } from "./comentarios-routing.module";
import { ComentariosComponent } from "./comentarios.component";

@NgModule({
    imports: [
      ComentariosRoutingModule, 
    ],
    declarations: [ComentariosComponent],
    exports: [ComentariosComponent]
  })
  export class ComentariosModule { }