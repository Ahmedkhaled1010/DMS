import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDocItemComponent } from './create-doc-item.component';

describe('CreateDocItemComponent', () => {
  let component: CreateDocItemComponent;
  let fixture: ComponentFixture<CreateDocItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDocItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDocItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
