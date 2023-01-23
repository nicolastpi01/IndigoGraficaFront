import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TokenStorageServiceMock } from './mocks/token-storage.service.mock';
import { TokenStorageService } from './services/token-storage.service';

describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  //let de: DebugElement;
  //let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: TokenStorageService, useClass: TokenStorageServiceMock }
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp = fixture.componentInstance; 
    });
  });

  it("Debe tener titulo 'indigo' ", () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('indigo');
  });

  it("Debe renderizar 'Índigo Gráfica' en el tag h1", () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Índigo Gráfica');
  });

  it("Está logueado entonces no debe renderizar el botón de 'Ingresar' ", () => {
    fixture.detectChanges();
    comp.isLoggedIn = true; // Modifico la variable que tiene en cuenta para mostar o no el botón
    fixture.detectChanges()
    const compiled = fixture.debugElement.query(By.css('[data-testid="ingresar"]'));
    expect(compiled).toBeNull();
  });

  it("Está logueado entonces debe renderizar el botón de 'Cerrar sesión' ", () => {
    fixture.detectChanges();    
    comp.isLoggedIn = true; // Modifico la variable que tiene en cuenta para mostar o no el botón
    fixture.detectChanges()
    const compiledBtnCerrarSesion = fixture.debugElement.query(By.css('[data-testid="btnCerrarSesion"]'));
    expect(compiledBtnCerrarSesion).toBeDefined();
  });

  // Desde el service stub se pre-carga el Token, y el rol del Usuario y el nombre
  it("Está logueado y es 'Editor' con nombre de usuario 'userStub' entonces debe renderizar 'userStub - Editor", () => {
    comp.ngOnInit();
    fixture.detectChanges();
    const compiled = fixture.debugElement.query(By.css('[data-testid="describeUserName"]')).nativeElement;
    expect(compiled.textContent).toContain('userStub - Editor');
  });

});

