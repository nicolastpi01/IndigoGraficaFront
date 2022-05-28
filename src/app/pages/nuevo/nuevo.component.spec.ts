import { TestBed } from '@angular/core/testing';
import { PedidoService } from 'src/app/services/pedido.service';
import { NuevoComponent } from './nuevo.component';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';


TestBed.configureTestingModule({
  declarations: [ NuevoComponent ],
  imports: [RouterTestingModule,  HttpClientTestingModule],
  providers: [
     { provide: FormBuilder},
     { provide: PedidoService },
     { provide: NzMessageService },
     { provide: Overlay },
  ]
});

const fixture = TestBed.createComponent(NuevoComponent);
const comp = fixture.componentInstance;

const expectedPanels: Array<{active: boolean, name: string, disabled: boolean}> = [
  {
    active: true,
    name: 'Datos',
    disabled: false
  },
  {
    active: false,
    disabled: true,
    name: 'Archivos'
  },
  
];

// simulate the parent setting the collapse panel property with that panels
comp.panels = expectedPanels;

// trigger initial data binding -> ngOnInit()
fixture.detectChanges();

const altaButton = fixture.nativeElement.querySelector('.login-form-button');

const uploadFile = fixture.nativeElement.querySelector('.upload-currentPedido');

it('Deberia coincidir el texto del boton Alta en el acordeon de arriba', () => {
  expect(altaButton.textContent).toContain('Alta');
});

it('Deberia no encontrar el componente para subir un file', () => {
  expect(uploadFile).toBeNull() 
});

// Luego agregar un test de Service !!