import { SalaryModel } from '../salary-service/salary.model';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee-service/employee.service';
import { UserService } from '../user-service/user.service';
import { SalaryService } from '../salary-service/salary.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: []
})
export class ReportComponent implements OnInit {
  private userSalaries: Array<SalaryModel>;
  private loading = false;
  private userName: string;
  private userEmail: string;
  private decryptionError: string;
  private isUserSignedIn: boolean;
  private isCorrectUserDomain: boolean;
  private isEmployeeRegistered: boolean;
  private isPrivateKeyFound: boolean;
  private isIncorrectKeyUploaded: boolean;
  private privateKeyInput: HTMLInputElement;

  constructor(private userService: UserService,
              private salaryService: SalaryService,
              private employeeService: EmployeeService) {
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

  initialize() {
    this.isPrivateKeyFound = localStorage.getItem('privateKey') !== null;
    this.userName = this.userService.getUserName();
    this.userEmail = this.userService.getUserEmail();
    this.isUserSignedIn = this.userService.isUserSignedIn();
    this.isCorrectUserDomain = this.userService.isCorrectUserDomain();
    this.employeeService.isEmployeeRegistered(this.userEmail, isRegistered => {
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
      this.decryptionError = '';
      this.userSalaries = salary;
      this.loading = false;
    }, error => {
      if (this.privateKeyInput) {
        this.privateKeyInput.value = '';
      }
      this.decryptionError = error;
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
        this.isIncorrectKeyUploaded = false;
        localStorage.setItem('privateKey', fileReader.result);
        this.isPrivateKeyFound = true;
        this.getSalary();
      } else {
        this.privateKeyInput.value = '';
        this.isIncorrectKeyUploaded = true;
        this.loading = false;
      }
    };

    fileReader.readAsText(file);
  }

}
