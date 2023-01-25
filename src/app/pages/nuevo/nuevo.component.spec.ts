import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoService } from 'src/app/services/pedido.service';
import { NuevoComponent } from './nuevo.component';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NzModalService } from 'ng-zorro-antd/modal';

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
  let fixture : ComponentFixture<NuevoComponent>;
  let cmp : NuevoComponent;
  let dbe: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,  HttpClientTestingModule],
      declarations: [
        NuevoComponent
      ],
      providers: [
        { provide: FormBuilder},
        { provide: PedidoService },
        { provide: NzMessageService },
        { provide: Overlay },
        { provide: NzModalService },
    ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NuevoComponent);
      cmp = fixture.componentInstance;
      dbe = fixture.debugElement.nativeElement; 
    });
  })

  it("Valida el contenido del texto del boton de alta de Form. por defecto", () => {
    fixture.detectChanges();
    cmp.isLoggedIn = true;
    cmp.panels = initialPanelState;
    fixture.detectChanges();
    const el = dbe.querySelector(`[data-testid="buttonAlta"]`)
    expect(el.textContent).toBe("Alta ");
  })

  it("Valida el contenido del texto del boton de alta de Form. cuando esta cargando", () => {
    cmp.panels = initialPanelState;
    cmp.loadingAlta = true;
    fixture.detectChanges()
    const el = dbe.querySelector(`[data-testid="buttonAlta"]`)
    expect(el.textContent).toBe("Espere... ");
  })
  

  it("Verifico que no esta definido el icono de subir un archivo en el acordeon de Mis Pedidos", () => {
    cmp.panels = initialPanelState;
    fixture.detectChanges()
    const el = dbe.querySelector(`[data-testid="iconUpload"]`)
    expect(el).toBeNull();
  })

  it("Verifica que el boton de limpiar esta definido en el formulario de Alta Pedido", () => {
    //const algo = fixture.debugElement.nativeElement.querySelector('#shan')
    cmp.panels = initialPanelState;
    fixture.detectChanges()
    const el = dbe.querySelector(`[data-testid="buttonClear"]`)
    expect(el).toBeDefined();
  })
  
})

