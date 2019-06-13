import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonePickerComponent } from './phone-picker.component';
import { Dropdown } from 'primeng/primeng';

describe('PhonePickerComponent', () => {
  let component: PhonePickerComponent;
  let fixture: ComponentFixture<PhonePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhonePickerComponent, Dropdown]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(PhonePickerComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
