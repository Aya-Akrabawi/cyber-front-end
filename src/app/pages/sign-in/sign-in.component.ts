import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  @ViewChild('content') content: any;
  submitLoading = false;
  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^.(?=.*[a-z])(?=.*[0-9])(?=.*[~!@#$%^&*()_-]).*$/), Validators.minLength(8)]),
  });
  modalContent = '';

  constructor(
    private http: HttpService,
    private modalService: NgbModal,
    private notificationService: NotificationsService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (this.userService.isAuthUser) {
      this.router.navigate(['/domains']);
    }
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return
    }
    this.submitLoading = true;
    const value = this.signInForm.value;
    const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(value.email + ':' + value.password) });
    
    this.http.postReq('/signin', {}, {headers: headers}).subscribe( res => {
      this.submitLoading = false;
      localStorage.setItem('tokenMNQ', res.token);
      
      let jwtParsed = this.parseJwt(res.token);       
      localStorage.setItem('userRoleMNQ', jwtParsed.user_role);
      localStorage.setItem('userIDMNQ', jwtParsed.user_id);
      
      const NDAAccept = localStorage.getItem('NDAAcceptMNQ');
      if(!NDAAccept) {
        this.openNDA(this.content)
      }
      this.router.navigate(['/domains']);
    }, err => {
      this.submitLoading = false;
      this.notificationService.error('', err.error);
    })
  }

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

  openNDA(content: any) {
    this.modalContent = ` ???????????? ???????????????? ???????????? ?????? ?????????? ???????????? ?????? ???????? ?????????????????? ???? ???? ???? ???????? ???? ?????????? ???????????????? ?????????????????? ?????? ??????????
    45 ?????? ???????????????? ?????? ?????????? ???????? ???? 2000 ?????? ???? ??????????. ?????? ???????????????????? "?????????????? ?????? ????????????" (Richard McClintock)
    ?????? ???????????????? ?????????? ?????????????????? ???? ?????????? ????????????-?????????? ???? ???????????????? ???????????? ???? ???????? ???????? ?????????????? ?????????? ???? ???? ??????????
    ???????????? ?????? "consectetur"?? ?????????? ?????????? ???????? ???????????? ???? ?????????? ???????????????? ?????????? ???????????? ?????????? ???????? ????????. ???????? ???????? ????
    ?????????? ???? ?????????? ???????????? ???????? ???? ?????????????? 1.10.32 ?? 1.10.33 ???? ???????? "?????? ?????????? ?????????? ??????????" (de Finibus Bonorum et
    Malorum) ???????????? ?????????????? (Cicero) ?????????? ???????? ???? ?????? 45 ?????? ??????????????. ?????? ???????????? ???? ???????????? ?????????? ?????????? ?????????? ????
    ?????????? ???????????????? ???????? ???? ?????????? ?????????? ???? ?????? ????????????. ?????????? ?????????? ???? ?????????? ???????????? "Lorem ipsum dolor sit amet.."
    ???????? ???? ?????? ???? ?????????? 1.20.32 ???? ?????? ????????????.

    ???????????????? ???????? ???????? ???? ?????????? ?????????? ?????????????? ???????????????????? ?????? ?????????? ???????????? ?????? ???? ????????????. ?????? ?????????? ?????????? ??????????????
    1.10.32 ?? 1.10.33 ???? "?????? ?????????? ?????????? ??????????" (de Finibus Bonorum et Malorum) ???????????? ?????????????? (Cicero) ????????????
    ???????????????? ?????????? ???????????? ???????????????????? ?????? ?????????? ?????? ???????????????? ????.???????????? (H. Rackham) ???? ?????? 1914.`;

    this.modalService.open(content, { centered: true }).result.then((result) => {
      localStorage.setItem('NDAAcceptMNQ', 'true')
    });
  }
}
