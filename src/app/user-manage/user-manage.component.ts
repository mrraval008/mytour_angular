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
  public userModel = {photo:"",name:""};
  public isAdmin = false;

  ngOnInit() {
    this.getUserById();
  }

  getUserById(){
      this.userService.getMe().subscribe((response) => {

        if (response["status"] == "success") {
          if (response.data) {
            let _response = response.data;
            if (_response.data) {
              this.userModel = _response.data;
              if(_response.data.role == "admin"){
                this.isAdmin = true;
              }
            }
          }
        }
        this.showLoader = false;
      }, (error) => {
        console.log(error);
        this.showLoader = false;
      })
  }
}
