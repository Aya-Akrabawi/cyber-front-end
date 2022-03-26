import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HeaderComponent } from './components/header/header.component';
import { FormErrorsComponent } from './components/form-errors/form-errors.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DomainsComponent } from './pages/domains/domains.component';
import { SubdomainsComponent } from './pages/subdomains/subdomains.component';
import { ControlsComponent } from './pages/controls/controls.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    HeaderComponent,
    FormErrorsComponent,
    SignInComponent,
    CreateAccountComponent,
    ForgotPasswordComponent,
    DomainsComponent,
    SubdomainsComponent,
    ControlsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    SimpleNotificationsModule.forRoot({
      position:["top", "right" ],
      timeOut: 4000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      clickIconToClose: true,
      // preventDuplicates: true
    }),
    NgxDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
