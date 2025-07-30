import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceDataComponent } from './workspace-data.component';

describe('WorkspaceDataComponent', () => {
  let component: WorkspaceDataComponent;
  let fixture: ComponentFixture<WorkspaceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkspaceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
