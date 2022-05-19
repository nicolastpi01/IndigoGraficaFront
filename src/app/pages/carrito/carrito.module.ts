
import { NgModule } from "@angular/core";
import { CarritoRoutingModule } from "./carrito-routing.module";
import { CarritoComponent } from "./carrito.component";

@NgModule({
    imports: [
      CarritoRoutingModule, 
    ],
    declarations: [CarritoComponent],
    exports: [CarritoComponent]
  })
  export class CarritoModule { }