import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDocumentViewComponent } from './shared-document-view.component';

describe('SharedDocumentViewComponent', () => {
  let component: SharedDocumentViewComponent;
  let fixture: ComponentFixture<SharedDocumentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedDocumentViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
