import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOppComponent } from './lista-opp.component';

describe('ListaOppComponent', () => {
  let component: ListaOppComponent;
  let fixture: ComponentFixture<ListaOppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaOppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaOppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
