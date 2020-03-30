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

  constructor(public userService:UserService,public helperService:HelperService,public router:Router) { }
  public userData = {photo:"",name:"",role:""}
  
  ngOnInit() {
    this.userService.getMe().subscribe((response)=>{
      if(response["status"] == "success"){
        
          if(response.data){
            let _response = response.data;
            if(_response.data){
               this.userData = _response.data;
            }
          }
      }
    },(error)=>{
      console.log(error)
    })
  }
  onLogOut(){
    this.helperService.clearLocaleStorage();
    this.router.navigate(["/welcome/home"])
  }

}
