import { NgModule } from "@angular/core";
import { NuevoRoutingModule } from "./nuevo-routing.module";
import { NuevoComponent } from "./nuevo.component";



@NgModule({
    imports: [NuevoRoutingModule],
    declarations: [NuevoComponent],
    exports: [NuevoComponent]
  })
  export class NuevoModule { }