import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HeaderComponent } from './components/header/header.component';
import { FormErrorsComponent } from './components/form-errors/form-errors.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { DomainsComponent } from './pages/domains/domains.component';
import { SubdomainsComponent } from './pages/subdomains/subdomains.component';
import { ControlsComponent } from './pages/controls/controls.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubmitTaskComponent } from './pages/submit-task/submit-task.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { NewAnnouncementComponent } from './pages/new-announcement/new-announcement.component';
import { IssuesComponent } from './pages/issues/issues.component';
import { NewIssueComponent } from './pages/new-issue/new-issue.component';
import { NewPrerequisiteComponent } from './pages/new-prerequisite/new-prerequisite.component';
import { NewEvidenceComponent } from './pages/new-evidence/new-evidence.component';
import { EvidencesPrerequisiteComponent } from './pages/evidences-prerequisite/evidences-prerequisite.component';
import { NewMeetingComponent } from './pages/new-meeting/new-meeting.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {FileInputAccessorModule} from "file-input-accessor";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { AuthInterceptor } from './interceptors/auth.interceptor';

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
    ControlsComponent,
    NewTaskComponent,
    TasksComponent,
    SubmitTaskComponent,
    MeetingsComponent,
    AnnouncementsComponent,
    NewAnnouncementComponent,
    IssuesComponent,
    NewIssueComponent,
    NewPrerequisiteComponent,
    NewEvidenceComponent,
    EvidencesPrerequisiteComponent,
    NewMeetingComponent,
    DashboardComponent,
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
    NgxDatatableModule,
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot(),
    FileInputAccessorModule,
    Ng2GoogleChartsModule,
    // CsvModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
