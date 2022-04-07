import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { HttpService } from 'src/app/services/http.service';

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
    password: new FormControl('', [Validators.required]),
  });
  modalContent = '';

  constructor(
    private http: HttpService,
    private modalService: NgbModal,
    private notificationService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('tokenMNQ')) {
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
    this.modalContent = ` خلافاَ للإعتقاد السائد فإن لوريم إيبسوم ليس نصاَ عشوائياً، بل إن له جذور في الأدب اللاتيني الكلاسيكي منذ العام
    45 قبل الميلاد، مما يجعله أكثر من 2000 عام في القدم. قام البروفيسور "ريتشارد ماك لينتوك" (Richard McClintock)
    وهو بروفيسور اللغة اللاتينية في جامعة هامبدن-سيدني في فيرجينيا بالبحث عن أصول كلمة لاتينية غامضة في نص لوريم
    إيبسوم وهي "consectetur"، وخلال تتبعه لهذه الكلمة في الأدب اللاتيني اكتشف المصدر الغير قابل للشك. فلقد اتضح أن
    كلمات نص لوريم إيبسوم تأتي من الأقسام 1.10.32 و 1.10.33 من كتاب "حول أقاصي الخير والشر" (de Finibus Bonorum et
    Malorum) للمفكر شيشيرون (Cicero) والذي كتبه في عام 45 قبل الميلاد. هذا الكتاب هو بمثابة مقالة علمية مطولة في
    نظرية الأخلاق، وكان له شعبية كبيرة في عصر النهضة. السطر الأول من لوريم إيبسوم "Lorem ipsum dolor sit amet.."
    يأتي من سطر في القسم 1.20.32 من هذا الكتاب.

    للمهتمين قمنا بوضع نص لوريم إبسوم القياسي والمُستخدم منذ القرن الخامس عشر في الأسفل. وتم أيضاً توفير الأقسام
    1.10.32 و 1.10.33 من "حول أقاصي الخير والشر" (de Finibus Bonorum et Malorum) لمؤلفه شيشيرون (Cicero) بصيغها
    الأصلية، مرفقة بالنسخ الإنكليزية لها والتي قام بترجمتها هـ.راكهام (H. Rackham) في عام 1914.`;

    this.modalService.open(content, { centered: true }).result.then((result) => {
      localStorage.setItem('NDAAcceptMNQ', 'true')
    });
  }
}
