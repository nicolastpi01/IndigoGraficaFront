import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionNoEncontradaComponent } from './seccion-no-encontrada.component';

describe('SeccionNoEncontradaComponent', () => {
  let component: SeccionNoEncontradaComponent;
  let fixture: ComponentFixture<SeccionNoEncontradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeccionNoEncontradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionNoEncontradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
