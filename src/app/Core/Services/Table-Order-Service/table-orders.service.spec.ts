import { TestBed } from '@angular/core/testing';

import { TableOrdersService } from './table-orders.service';

describe('TableOrdersService', () => {
  let service: TableOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
