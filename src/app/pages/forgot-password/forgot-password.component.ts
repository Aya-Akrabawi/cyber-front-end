import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    reason: new FormControl('forgotpassword')
  });
  submitLoading = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.controls.email.invalid) {
      this.form.controls.email.markAsTouched();
      return;
    }
  }
}
