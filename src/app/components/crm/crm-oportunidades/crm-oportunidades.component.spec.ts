import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmOportunidadesComponent } from './crm-oportunidades.component';

describe('CrmOportunidadesComponent', () => {
  let component: CrmOportunidadesComponent;
  let fixture: ComponentFixture<CrmOportunidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmOportunidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmOportunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
