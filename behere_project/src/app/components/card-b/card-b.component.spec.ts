import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBComponent } from './card-b.component';

describe('CardBComponent', () => {
  let component: CardBComponent;
  let fixture: ComponentFixture<CardBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
