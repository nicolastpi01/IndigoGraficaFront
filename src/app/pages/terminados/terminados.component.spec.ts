import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminadosComponent } from './terminados.component';

describe('TerminadosComponent', () => {
  let component: TerminadosComponent;
  let fixture: ComponentFixture<TerminadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
