import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListaSNComponent } from './modal-lista-sn.component';

describe('ModalListaSNComponent', () => {
  let component: ModalListaSNComponent;
  let fixture: ComponentFixture<ModalListaSNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListaSNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListaSNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
