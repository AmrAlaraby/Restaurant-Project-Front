import { TestBed } from '@angular/core/testing';

import { BranchStockService } from './branch-stock-service';

describe('BranchStockService', () => {
  let service: BranchStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
