import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoService } from 'src/app/services/pedido.service';
import { NuevoComponent } from './nuevo.component';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';

let fixture : ComponentFixture<NuevoComponent>;
let app : NuevoComponent;
let dbe: any;

let initialPanelState :Array<{active: boolean, name: string, disabled: boolean}> = [
    {
      active: true,
      name: 'Datos',
      disabled: false
    },
    {
      active: false,
      disabled: true,
      name: 'Archivos'
    }
  ]

describe('NuevoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NuevoComponent
      ],
      imports: [RouterTestingModule,  HttpClientTestingModule],
      providers: [
        { provide: FormBuilder},
        { provide: PedidoService },
        { provide: NzMessageService },
        { provide: Overlay },
    ]
    }).compileComponents()
    fixture = TestBed.createComponent(NuevoComponent)
    app = fixture.componentInstance
    fixture.detectChanges()
    dbe = fixture.debugElement.nativeElement
  })
    
  it("Valida el contenido del texto del boton de alta de Form. por defecto", () => {
    app.panels = initialPanelState;
    fixture.detectChanges()
    const el = dbe.querySelector(`[data-testid="buttonAlta"]`)
    expect(el.textContent).toBe("Alta ");
  })

  it("Valida el contenido del texto del boton de alta de Form. cuando esta cargando", () => {
    app.panels = initialPanelState;
    app.loadingAlta = true;
    fixture.detectChanges()
    const el = dbe.querySelector(`[data-testid="buttonAlta"]`)
    expect(el.textContent).toBe("Espere... ");
  })
  

  it("Verifico que no esta definido el icono de subir un archivo en el acordeon de Mis Pedidos", () => {
    app.panels = initialPanelState;
    fixture.detectChanges()
    const el = dbe.querySelector(`[data-testid="iconUpload"]`)
    expect(el).toBeNull();
  })

  
  it("Verifica que el boton de limpiar esta definido en el formulario de Alta Pedido", () => {
    //const algo = fixture.debugElement.nativeElement.querySelector('#shan')
    app.panels = initialPanelState;
    fixture.detectChanges()
    const el = dbe.querySelector(`[data-testid="buttonClear"]`)
    expect(el).toBeDefined();
  })
  



})

