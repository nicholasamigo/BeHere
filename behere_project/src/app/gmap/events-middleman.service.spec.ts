import { TestBed } from '@angular/core/testing';

import { EventsMiddlemanService } from './events-middleman.service';

describe('EventsMiddlemanService', () => {
  let service: EventsMiddlemanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsMiddlemanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
