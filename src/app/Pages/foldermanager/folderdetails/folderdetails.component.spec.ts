import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderdetailsComponent } from './folderdetails.component';

describe('FolderdetailsComponent', () => {
  let component: FolderdetailsComponent;
  let fixture: ComponentFixture<FolderdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FolderdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
