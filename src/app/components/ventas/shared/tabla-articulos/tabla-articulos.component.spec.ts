import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaArticulosComponent } from './tabla-articulos.component';

describe('TablaArticulosComponent', () => {
  let component: TablaArticulosComponent;
  let fixture: ComponentFixture<TablaArticulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaArticulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
