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
    this.userService.signOut();
  }

  signIn() {
    this.userService.signInWithGoogleRedirect();
  }

}
