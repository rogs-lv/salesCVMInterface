import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActividadesComponent } from './crm-actividades.component';

describe('CrmActividadesComponent', () => {
  let component: CrmActividadesComponent;
  let fixture: ComponentFixture<CrmActividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmActividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
