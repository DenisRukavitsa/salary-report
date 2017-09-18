import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service/user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  emailControl: AbstractControl;
  passwordControl: AbstractControl;
  errorPassword = '';
  errorEmail = '';
  loading = false;

  constructor(formBuilder: FormBuilder,
              private userService: UserService) {
    this.loginForm = formBuilder.group({
      'emailControl': ['', Validators.required],
      'passwordControl': ['', Validators.required]
    });

    this.emailControl = this.loginForm.controls['emailControl'];
    this.passwordControl = this.loginForm.controls['passwordControl'];
  }

  signIn() {
    if (this.emailControl.hasError('required') || this.passwordControl.hasError('required')) {
      return;
    }
    if ((this.passwordControl.value as string).length < 6) {
      this.passwordControl.setErrors({});
      this.errorPassword = 'Password can\'t be less that 6 chars';
      return;
    }

    this.loading = true;
    this.userService.signInWithEmail(this.emailControl.value, this.passwordControl.value).then(a => {
      this.passwordControl.setErrors(null);
      this.emailControl.setErrors(null);
      this.errorEmail = '';
      this.errorPassword = '';
      this.loading = false;
    }, error => {
      this.loading = false;
      switch (error.message) {
        case 'The email address is badly formatted.':
          this.emailControl.setErrors({});
          this.errorEmail = 'Please specify a valid email';
          break;
        case 'There is no user record corresponding to this identifier. The user may have been deleted.':
          this.emailControl.setErrors({});
          this.errorEmail = 'No user is found for provided email';
          break;
        case 'The password is invalid or the user does not have a password.':
          this.passwordControl.setErrors({});
          this.errorPassword = 'Password is incorrect';
          break;
      }
    });
  }

  ngOnInit() {
  }

}
