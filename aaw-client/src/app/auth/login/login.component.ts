import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { Router } from '@angular/router';
import { UsersService } from '../../users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public showPassword: boolean;


  constructor(private usersService: UsersService,
    private router: Router) {
  }

  ngOnInit() {
    this.showPassword = false;
    this.usersService.user().subscribe(usr => {
      if (usr) {
        this.router.navigate([`/${usr.type}`]);
      }
    });

  }

  submit(state) {
    if (state) {
      this.usersService.login(this.user)
        .subscribe(response => {
          this.usersService.registerLogin(response.data.token, this.user.rememberMe)
            .subscribe(usr => {
              this.router.navigate([`/${usr.type}`]);
            });
        }, (error: HttpErrorResponse) => console.log(error));
    }
  }

}
