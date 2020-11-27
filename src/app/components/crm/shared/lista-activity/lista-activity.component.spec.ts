import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaActivityComponent } from './lista-activity.component';

describe('ListaActivityComponent', () => {
  let component: ListaActivityComponent;
  let fixture: ComponentFixture<ListaActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
