import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewdocumentComponent } from './reviewdocument.component';

describe('ReviewdocumentComponent', () => {
  let component: ReviewdocumentComponent;
  let fixture: ComponentFixture<ReviewdocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewdocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
