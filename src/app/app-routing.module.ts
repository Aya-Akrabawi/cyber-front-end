import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlsComponent } from './pages/controls/controls.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { DomainsComponent } from './pages/domains/domains.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SubdomainsComponent } from './pages/subdomains/subdomains.component';

const routes: Routes = [
  {
    path: 'admin/sign-up', 
    component: SignUpComponent,
    // canActivate: [AdminGuard]
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'create-account',
    component: CreateAccountComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'domains/:domainId/:domainName',
    component: SubdomainsComponent
  },
  {
    path: 'domains',
    component: DomainsComponent
  },
  {
    path: 'controls/:subDomainID',
    component: ControlsComponent
  },
  {
    path: 'tasks/new/:controlID',
    component: NewTaskComponent
  },
  { path: '**', redirectTo: 'domains' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
