import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaarticulosComponent } from './listaarticulos.component';

describe('ListaarticulosComponent', () => {
  let component: ListaarticulosComponent;
  let fixture: ComponentFixture<ListaarticulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaarticulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaarticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
