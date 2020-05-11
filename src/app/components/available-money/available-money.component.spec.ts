import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableMoneyComponent } from './available-money.component';

describe('AvailableMoneyComponent', () => {
  let component: AvailableMoneyComponent;
  let fixture: ComponentFixture<AvailableMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
