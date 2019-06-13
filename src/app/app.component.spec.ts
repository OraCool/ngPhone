import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { PhonePickerComponent } from './components/phone-picker/phone-picker.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, PhonePickerComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });
  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it("should have as title 'ngPhone'", () => {
    expect(app.title).toEqual('ngPhone');
  });

  it('should render phone component', () => {
    const phoneFixture = TestBed.createComponent(PhonePickerComponent);
    const phone = phoneFixture.debugElement.componentInstance;
    expect(phone).toBeTruthy();
  });
});
