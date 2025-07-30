import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldermanagerComponent } from './foldermanager.component';

describe('FoldermanagerComponent', () => {
  let component: FoldermanagerComponent;
  let fixture: ComponentFixture<FoldermanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoldermanagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoldermanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
