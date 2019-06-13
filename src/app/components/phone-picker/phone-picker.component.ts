import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, skip, switchMap, takeUntil, map } from 'rxjs/operators';
import { ICountry } from 'src/app/models/interfaces/country';
import { CountryCodesService } from 'src/app/services/country-codes.service';
import { IDropDownCountry } from 'src/app/models';

const autoValidate = (time, selector) => source$ =>
  source$.pipe(
    debounceTime(time),
    switchMap((...args: any[]) =>
      selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
    )
  );

@Component({
  selector: 'phone-picker',
  templateUrl: './phone-picker.component.html',
  styleUrls: ['./phone-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhonePickerComponent),
      multi: true
    }
  ]
})
export class PhonePickerComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() defaultCallingCode = '1';
  @Output() onCallClick = new EventEmitter<string>();
  inputText: string;
  phone$ = new BehaviorSubject<string>('');
  results$ = this.phone$.pipe(
    autoValidate(500, phone => this.phoneHandler(phone))
  );
  isValid$ = this.phone$.pipe(autoValidate(500, phone => this.validate(phone)));
  countries: IDropDownCountry[];
  selectedCountry: string;
  currentPhone: PhoneNumber;
  disabled: boolean;
  constructor(public countriesService: CountryCodesService) {}

  private ngUnsubscribe$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.countriesService
      .getCountryCodes()
      .pipe(
        map(x => {
          return x.map((item: ICountry) => {
            return {
              label: item.name,
              value: item.callingCode,
              country: item
            };
          });
        })
      )
      .subscribe(dropModel => (this.countries = dropModel));
    this.results$.subscribe();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }
  writeValue(phoneNumber: string): void {
    if (phoneNumber) {
      const phone = parsePhoneNumberFromString(phoneNumber);
      if (phone) {
        this.currentPhone = phone;
      }
    }
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  phoneHandler(phone: string): Observable<PhoneNumber> {
    let phoneCorrected = phone.startsWith('+')
      ? phone
      : `+${this.selectedCountry ? this.selectedCountry : ''}${phone}`;
    let phoneNumber = parsePhoneNumberFromString(phoneCorrected);
    if (!phoneNumber) {
      phoneCorrected = phone.startsWith('+') ? phone : `+${phone}`;
      phoneNumber = parsePhoneNumberFromString(phoneCorrected);
    }
    if (phoneNumber) {
      this.currentPhone = phoneNumber;
      this.selectCountry(phoneNumber.countryCallingCode as string);
    }

    return of(phoneNumber);
  }
  validate(phone: string): Observable<boolean> {
    const phoneCorrected = phone.startsWith('+')
      ? phone
      : `+${this.selectedCountry ? this.selectedCountry : ''}${phone}`;
    const phoneNumber = parsePhoneNumberFromString(phoneCorrected);

    return of(phoneNumber ? !phoneNumber.isValid() : false);
  }
  selectCountry(countryCallingCode: string) {
    this.selectedCountry = this.countries.find(
      x => x.value === countryCallingCode
    ).value;
    this.countriesService.setCurrentCountry(countryCallingCode);
  }
  setCountry(event: any) {
    if (this.inputText) {
      this.inputText = this.inputText.replace('+', '');
    }
    this.selectCountry(event.value);
  }
  onCallClickHandler() {
    this.onCallClick.emit(this.currentPhone.nationalNumber.toString());
  }
}
