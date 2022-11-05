import { Component, Input } from "@angular/core";


@Component({
    selector: 'app-noelements',
    templateUrl: './noelements.component.html',
    styleUrls: ['./noelements.component.css']
  })
  export class NoElementsComponent {
    @Input() topText: string | undefined;
    @Input() bottomText: string | undefined;
  }