import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users.service';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User;
  constructor(private _userService: UsersService,
    private _router: Router) { }

  ngOnInit() {
    this._userService.user()
      .subscribe(
        usr => this.user = usr,
        err => console.log(err));
  }

  logout() {
    this._userService.logout();
    this._router.navigate(['/login']);
  }

}
