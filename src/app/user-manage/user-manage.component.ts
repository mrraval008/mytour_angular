import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {

  constructor( public userService: UserService) { }
  public showLoader = true;
  public userId;
  public userModel : any;
  public isAdmin = false;

  ngOnInit() {
    this.getCurrentUser();

  }

  getCurrentUser(){
    this.userModel =this.userService.getCurrentUserData();
      if(this.userModel.role == "admin"){
        this.isAdmin = true;
    }
    this.showLoader = false;
  }
}
