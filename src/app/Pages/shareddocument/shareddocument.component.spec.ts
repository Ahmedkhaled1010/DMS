import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareddocumentComponent } from './shareddocument.component';

describe('ShareddocumentComponent', () => {
  let component: ShareddocumentComponent;
  let fixture: ComponentFixture<ShareddocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareddocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShareddocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
