import { UserService } from '../user-service/user.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-admin',
  template: `<app-admin-upload *ngIf="userService.isAdminSignedIn() &&
                                     !userService.isChangingUser()"></app-admin-upload>
             <app-admin-login *ngIf="!userService.isAdminSignedIn() &&
                                     !userService.isChangingUser()"></app-admin-login>`,
  styles: []
})
export class AdminComponent implements OnInit {

  constructor(public userService: UserService) {
    this.userService.isAdminPart = true;
  }

  ngOnInit() {
  }

}
