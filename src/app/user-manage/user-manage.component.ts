import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { HelperService } from 'src/app/helper.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {

  constructor(public userService: UserService, private helperService: HelperService) { }
  public showLoader = true;
  public userId;
  public userModel: any;
  public isAdmin = false;

  ngOnInit() {
    this.getCurrentUser();

  }

  getCurrentUser() {
    this.userModel = this.userService.getCurrentUserData();
    if (this.helperService.isEmpty(this.userModel)) {
      let counter = 0;
      let userData = {};
      let timer = setInterval(() => {
        counter++;
        userData = this.userService.getCurrentUserData();
        if (!this.helperService.isEmpty(userData) || counter > 10) {
          clearInterval(timer)
          this.userModel = userData;
          if (this.userModel.role == "admin") {
            this.isAdmin = true;
          }
        }
      }, 500)
    }else{
      if (this.userModel.role == "admin") {
        this.isAdmin = true;
      }
    }

    this.showLoader = false;
  }
}
