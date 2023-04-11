import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDComponent } from './card-d.component';

describe('CardDComponent', () => {
  let component: CardDComponent;
  let fixture: ComponentFixture<CardDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
