import { EmployeeService } from '../employee-service/employee.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user-service/user.service';
import * as saver from 'file-saver';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: []
})
export class RegistrationComponent implements OnInit, OnDestroy {
  private loading = false;
  private isJustRegistered = false;
  private userName: string;
  private userEmail: string;
  private isUserSignedIn: boolean;
  private isCorrectUserDomain: boolean;
  private isEmployeeRegistered: boolean;
  private privateKey: string;

  constructor(private userService: UserService,
              private employeeService: EmployeeService) {}

  ngOnInit() {
    const initialize = () => {
      this.userName = this.userService.getUserName();
      this.userEmail = this.userService.getUserEmail();
      this.isUserSignedIn = this.userService.isUserSignedIn();
      this.isCorrectUserDomain = this.userService.isCorrectUserDomain();
      this.employeeService.isEmployeeRegistered(this.userEmail).then(isRegistered => {
        this.isEmployeeRegistered = isRegistered;
        this.loading = false;
      });
    };

    this.loading = true;
    if (this.userService.isUserSignedIn() && !this.userService.isAdminSignedIn()) {
      initialize();
    } else {
      this.userService.signInWithGoogleRedirect().then(() => {
        initialize();
      });
    }
  }

  ngOnDestroy() {
    this.employeeService.unsubscribe();
  }

  signOut() {
    this.userService.signOut();
  }

  generateKeyPair() {
    this.loading = true;
    this.employeeService.registerEmployee(this.userName, this.userEmail).then(privateKey => {
      this.isEmployeeRegistered = true;
      this.isJustRegistered = true;
      this.privateKey = privateKey;
      this.loading = false;
    });
  }

  downloadPrivateKey() {
    saver.saveAs(new Blob([this.privateKey], {type: 'text/plain;charset=utf-8'}),
                 'privateKey.txt');
  }

}
