import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerFacturaComponent } from './ver-factura.component';

describe('VerFacturaComponent', () => {
  let component: VerFacturaComponent;
  let fixture: ComponentFixture<VerFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerFacturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
