import { Component, Inject } from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styles: ['.dialog-content {font-family: arial}']
})
export class ErrorDialogComponent {

  constructor(@Inject(MD_DIALOG_DATA) public data: any) { }

}
