import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAComponent } from './card-a.component';

describe('CardAComponent', () => {
  let component: CardAComponent;
  let fixture: ComponentFixture<CardAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
