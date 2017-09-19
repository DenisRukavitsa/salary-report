import { Subscription } from 'rxjs/Rx';
import { SalaryService } from '../salary-service/salary.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-upload',
  templateUrl: './admin-upload.component.html',
  styleUrls: ['./admin-upload.component.css']
})
export class AdminUploadComponent implements OnInit, OnDestroy {
  submittingResults: Array<string>;
  loading = false;
  subscription: Subscription;

  constructor(private salaryService: SalaryService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.salaryService.unsubscribe();
  }

  submitData(textarea: HTMLTextAreaElement) {
    this.submittingResults = new Array<string>();
    this.submittingResults.push('=== Results ===');
    this.loading = true;
    this.subscription = this.salaryService.pushSalary(textarea.value)
      .subscribe(result => {
        this.submittingResults.push(result);
        this.submittingResults.sort();
        this.loading = false;
      });
  }
}
