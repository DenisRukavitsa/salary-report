import { UserService } from '../user-service/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService) {}

  ngOnInit() {
  }

  signOut() {
    try {
      this.userService.signOut();
    } catch (Error) {
      console.log('!!!');
    }
  }

  signIn() {
    this.userService.signInWithGoogleRedirect();
  }

}
