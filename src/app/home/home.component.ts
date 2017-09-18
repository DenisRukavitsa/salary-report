import { UserService } from '../user-service/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService) {}

  ngOnInit() {
  }

}
