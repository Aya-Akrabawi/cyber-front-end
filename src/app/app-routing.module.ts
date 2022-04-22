import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PreventExternalAuditorGuard } from './guards/prevent-external-auditor.guard';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { AuditorsTaskComponent } from './pages/auditors-task/auditors-task.component';
import { ControlsComponent } from './pages/controls/controls.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DomainsComponent } from './pages/domains/domains.component';
import { EvidencesPrerequisiteComponent } from './pages/evidences-prerequisite/evidences-prerequisite.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { IssuesComponent } from './pages/issues/issues.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { NewAnnouncementComponent } from './pages/new-announcement/new-announcement.component';
import { NewEvidenceComponent } from './pages/new-evidence/new-evidence.component';
import { NewIssueComponent } from './pages/new-issue/new-issue.component';
import { NewMeetingComponent } from './pages/new-meeting/new-meeting.component';
import { NewPrerequisiteComponent } from './pages/new-prerequisite/new-prerequisite.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SubdomainsComponent } from './pages/subdomains/subdomains.component';
import { SubmitTaskComponent } from './pages/submit-task/submit-task.component';
import { TasksComponent } from './pages/tasks/tasks.component';

const routes: Routes = [
  {
    path: 'admin/sign-up', 
    component: SignUpComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'create-account',
    component: CreateAccountComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'domains/:domainId/:domainName',
    component: SubdomainsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'domains',
    component: DomainsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'controls/:subDomainID',
    component: ControlsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks/new/:controlID',
    component: NewTaskComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path: 'tasks/:employeeId',
    component: TasksComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'submit-task/:taskId',
    component: SubmitTaskComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path:'auditor-task/:taskId/:auditorType',
    component: AuditorsTaskComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'meetings',
    component: MeetingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'announcements',
    component: AnnouncementsComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path: 'new-announcement',
    component: NewAnnouncementComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path: 'issues',
    component: IssuesComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path: 'new-issue',
    component: NewIssueComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path: 'new-prerequisite/:subDomainId',
    component: NewPrerequisiteComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path: 'new-evidence/:subDomainId',
    component: NewEvidenceComponent,
    canActivate: [AuthGuard, PreventExternalAuditorGuard]
  },
  {
    path: 'evidences-prerequisites/:subDomainId',
    component: EvidencesPrerequisiteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new-meeting',
    component: NewMeetingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'domains' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
