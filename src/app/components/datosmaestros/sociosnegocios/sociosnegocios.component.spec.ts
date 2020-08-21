import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosnegociosComponent } from './sociosnegocios.component';

describe('SociosnegociosComponent', () => {
  let component: SociosnegociosComponent;
  let fixture: ComponentFixture<SociosnegociosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SociosnegociosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SociosnegociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
