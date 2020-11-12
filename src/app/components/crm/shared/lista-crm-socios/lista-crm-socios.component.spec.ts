import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCRMSociosComponent } from './lista-crm-socios.component';

describe('ListaCRMSociosComponent', () => {
  let component: ListaCRMSociosComponent;
  let fixture: ComponentFixture<ListaCRMSociosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaCRMSociosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCRMSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
