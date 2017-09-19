import { Component, Inject } from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-error-dialog',
  template: `<p md-dialog-title>Error</p>
                <div md-dialog-content>
                  <p>{{data.message}}</p>
                </div>
                <md-dialog-actions>
                  <span class="spacer"></span>
                  <button md-raised-button md-dialog-close color="primary">OK</button>
                </md-dialog-actions>`
})
export class ErrorDialogComponent {

  constructor(@Inject(MD_DIALOG_DATA) public data: any) { }

}
