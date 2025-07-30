import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedDocumentComponent } from './deleted-document.component';

describe('DeletedDocumentComponent', () => {
  let component: DeletedDocumentComponent;
  let fixture: ComponentFixture<DeletedDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
