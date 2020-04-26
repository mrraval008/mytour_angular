import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { HelperService } from 'src/app/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.css']
})
export class UserProfileCardComponent implements OnInit {

  constructor(public userService: UserService, public helperService: HelperService, public router: Router) { }
  public userData: any

  ngOnInit() {
    this.userData = this.userService.getCurrentUserData();
    if (this.helperService.isEmpty(this.userData)) {
      let counter = 0;
      let userData = {};
      let timer = setInterval(() => {
        counter++;
        userData = this.userService.getCurrentUserData();
        if (!this.helperService.isEmpty(userData) || counter > 10) {
          clearInterval(timer)
          this.userData = userData;
        }
      }, 500)
    }
  }
  onLogOut() {
    this.helperService.clearLocaleStorage();
    this.router.navigate(["/welcome/home"])
  }

}
