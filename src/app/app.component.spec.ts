import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  //let comp: AppComponent;
  //let fixture: ComponentFixture<AppComponent>;
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
    }).compileComponents().then(() => {
      //fixture = TestBed.createComponent(AppComponent);
      
      //comp = fixture.componentInstance; //AppComponent text instance

      //de = fixture.debugElement.query(By.css('form'));

      //el = de.nativeElement;
    });
  });

  it("Debe tener titulo 'indigo' ", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('indigo');
  });

  it("Debe renderizar 'Índigo Gráfica' en el tag h1", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Índigo Gráfica');
  });

  it("Está logueado entonces no debe renderizar el botón de 'Ingresar' ", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    
    component.isLoggedIn = true;
    fixture.detectChanges()
    const compiled = fixture.debugElement.query(By.css('[data-testid="ingresar"]'));
    expect(compiled).toBeNull();
  });

});

