import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, share, find } from 'rxjs/operators';
import { ICountry } from '../models';

type countryType = {
  name: string;
  alpha2Code: string;
  callingCodes: string[];
};
@Injectable({
  providedIn: 'root'
})
export class CountryCodesService {
  public countries: Observable<ICountry[]>;
  public country: Observable<ICountry>;
  constructor(private httpClient: HttpClient) {
    this.countries = this._countries.asObservable();
    this.country = this._country.asObservable();
  }
  private _countries = new BehaviorSubject<ICountry[]>([]);
  private _country = new BehaviorSubject<ICountry>(null);
  getCountryCodes(): Observable<ICountry[]> {
    const request: Observable<ICountry[]> = this.httpClient
      .get(
        'https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;callingCodes'
      )
      .pipe(
        map((res: countryType[]) =>
          res.map((item: countryType) => {
            return {
              name: item.name,
              code: item.alpha2Code.toLowerCase(),
              callingCode: item.callingCodes[0]
            };
          })
        ),
        catchError(err => throwError(err)),
        share()
      );
    request.subscribe((countries: ICountry[]) => {
      this._countries.next(countries);
    });
    return request;
  }
  setCurrentCountry(countryCallingCode: string) {
    const result = this._countries.pipe(
      map(x => x.find(y => y.callingCode === countryCallingCode))
    );

    result.subscribe((country: ICountry) => {
      this._country.next(country);
    });
  }
}
