import { TestBed } from '@angular/core/testing';

import { DocumentdetailsService } from './documentdetails.service';

describe('DocumentdetailsService', () => {
  let service: DocumentdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
