import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { SalaryModel } from '../salary-service/salary.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeService } from '../employee-service/employee.service';
import { UserService } from '../user-service/user.service';
import { SalaryService } from '../salary-service/salary.service';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit, OnDestroy {
  private userSalaries: Array<SalaryModel>;
  private loading = false;
  private userName: string;
  private userEmail: string;
  private isUserSignedIn: boolean;
  private isCorrectUserDomain: boolean;
  private isEmployeeRegistered: boolean;
  private isPrivateKeyFound: boolean;
  private privateKeyInput: HTMLInputElement;

  constructor(private userService: UserService,
              private salaryService: SalaryService,
              private employeeService: EmployeeService,
              private dialog: MdDialog) {
    this.userSalaries = new Array();
  }

  ngOnInit() {
    this.loading = true;
    if (this.userService.isUserSignedIn() && !this.userService.isAdminSignedIn()) {
      this.initialize();
    } else {
      this.userService.signInWithGoogleRedirect().then(() => {
        this.initialize();
      });
    }
  }

  ngOnDestroy() {
    this.salaryService.unsubscribe();
    this.employeeService.unsubscribe();
  }

  initialize() {
    this.isPrivateKeyFound = localStorage.getItem('privateKey') !== null;
    if (!this.isPrivateKeyFound) {
      this.openErrorDialog(`There is no private key in the local storage of your browser.
                            Please upload your private key.`);
    }

    this.userName = this.userService.getUserName();
    this.userEmail = this.userService.getUserEmail();
    this.isUserSignedIn = this.userService.isUserSignedIn();
    this.isCorrectUserDomain = this.userService.isCorrectUserDomain();

    this.employeeService.isEmployeeRegistered(this.userEmail).then(isRegistered => {
      this.isEmployeeRegistered = isRegistered;
      if (this.isPrivateKeyFound) {
        this.getSalary();
      } else {
        this.loading = false;
      }
    });
  }

  getSalary() {
    this.salaryService.getSalaryByEmployee(this.userName, localStorage.getItem('privateKey')).then(salary => {
      this.isPrivateKeyFound = true;
      this.userSalaries = salary;
      this.loading = false;
    }, error => {
      if (this.privateKeyInput) {
        this.privateKeyInput.value = '';
      }
      this.openErrorDialog(`An error occurred during decrypting the data.
                            Usually this happens when incorrect private key was used for decrypting.
                            Please upload your private key.`);
      this.loading = false;
    });
  }

  privateKeyUploaded($event) {
    this.privateKeyInput = $event.srcElement;
    const file = $event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = (event) => {
      this.loading = true;
      const privateKey = fileReader.result as string;
      if (privateKey.startsWith('-----BEGIN RSA PRIVATE KEY-----') &&
          privateKey.includes('-----END RSA PRIVATE KEY-----') &&
          privateKey.length === 1702) {
        localStorage.setItem('privateKey', fileReader.result);
        this.isPrivateKeyFound = true;
        this.getSalary();
      } else {
        this.privateKeyInput.value = '';
        this.loading = false;
        this.openErrorDialog(`The uploaded key doesn\'t look like a valid one.
                              Please check it and try once more.`);
      }
    };

    fileReader.readAsText(file);
  }

  openErrorDialog(message: string) {
    this.isPrivateKeyFound = false;
    this.dialog.open(ErrorDialogComponent, {
      data: {message: message},
      width: '600px'
    });
  }

}
