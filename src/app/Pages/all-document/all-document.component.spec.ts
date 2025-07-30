import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDocumentComponent } from './all-document.component';

describe('AllDocumentComponent', () => {
  let component: AllDocumentComponent;
  let fixture: ComponentFixture<AllDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
