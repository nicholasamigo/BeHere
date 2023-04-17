import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAComponentNoEdit } from './card-a-noedit.component';

describe('CardAComponent', () => {
  let component: CardAComponentNoEdit;
  let fixture: ComponentFixture<CardAComponentNoEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAComponentNoEdit ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAComponentNoEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
