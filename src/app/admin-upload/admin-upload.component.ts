import { SalaryService } from '../salary-service/salary.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-upload',
  templateUrl: './admin-upload.component.html',
  styleUrls: ['./admin-upload.component.css']
})
export class AdminUploadComponent implements OnInit {
  submittingResults: Array<string>;
  loading = false;

  constructor(private salaryService: SalaryService) {}

  ngOnInit() {
  }

  submitData(textarea: HTMLTextAreaElement) {
    this.submittingResults = new Array<string>();
    this.submittingResults.push('=== Results ===');
    this.loading = true;
    this.salaryService.pushSalary(textarea.value)
      .subscribe(result => {
        this.submittingResults.push(result);
        this.submittingResults.sort();
        this.loading = false;
      });
  }
}
