import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsateListComponent } from './esate-list.component';

describe('EsateListComponent', () => {
  let component: EsateListComponent;
  let fixture: ComponentFixture<EsateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
