import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule, Dropdown } from 'primeng/primeng';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PhonePickerComponent } from './components/phone-picker/phone-picker.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AppComponent, PhonePickerComponent, Dropdown],
  imports: [
    BrowserModule,
    DropdownModule,
    ButtonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
