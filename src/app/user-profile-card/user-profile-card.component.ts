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
    let counter = 0
    if (this.helperService.isEmpty(this.userData)) {
      let timer = setInterval(() => {
        counter++
        if (!this.helperService.isEmpty(this.userService.getCurrentUserData()) || counter > 10) {
          this.userData = this.userService.getCurrentUserData();
          clearInterval(timer)
        }
      }, 500)
    }
  }
  onLogOut() {
    this.helperService.clearLocaleStorage();
    this.router.navigate(["/welcome/home"])
  }

}
