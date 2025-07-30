import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacemodelComponent } from './workspacemodel.component';

describe('WorkspacemodelComponent', () => {
  let component: WorkspacemodelComponent;
  let fixture: ComponentFixture<WorkspacemodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspacemodelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkspacemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
