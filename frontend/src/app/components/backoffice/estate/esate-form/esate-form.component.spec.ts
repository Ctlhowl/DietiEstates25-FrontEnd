import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsateFormComponent } from './esate-form.component';

describe('EsateFormComponent', () => {
  let component: EsateFormComponent;
  let fixture: ComponentFixture<EsateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
