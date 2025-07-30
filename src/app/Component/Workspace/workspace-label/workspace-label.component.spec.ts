import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceLabelComponent } from './workspace-label.component';

describe('WorkspaceLabelComponent', () => {
  let component: WorkspaceLabelComponent;
  let fixture: ComponentFixture<WorkspaceLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceLabelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkspaceLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
