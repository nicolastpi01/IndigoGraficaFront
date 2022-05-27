import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoService } from 'src/app/services/pedido.service';
import { NuevoComponent } from './nuevo.component';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';


TestBed.configureTestingModule({
  declarations: [ NuevoComponent ],
  providers: [
    { provide: ComponentFixtureAutoDetect, useValue: true }
  ]
});

it('should display original title', () => {
  // Hooray! No `fixture.detectChanges()` needed
  //expect(h1.textContent).toContain(comp.title);
});


let pedidoServiceStub: Partial<PedidoService>;

  pedidoServiceStub = {
    //isLoggedIn: true,
    //user: { name: 'Test User' },
  };


TestBed.configureTestingModule({
  declarations: [ NuevoComponent ],
// providers: [ UserService ],  // NO! Don't provide the real service!
                               // Provide a test-double instead
  providers: [ { provide: PedidoService, useValue: pedidoServiceStub } ],
});

const fixture = TestBed.createComponent(NuevoComponent);
const comp = fixture.componentInstance;

// UserService from the root injector
const pedidoService = TestBed.inject(PedidoService);

//  get the "welcome" element by CSS selector (e.g., by class name)
const el = fixture.nativeElement.querySelector('.upload-currentPedido');

/*
describe('NuevoComponent', () => {
  let component: NuevoComponent;
  let fixture: ComponentFixture<NuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/