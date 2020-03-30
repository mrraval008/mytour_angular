import { Component, OnInit,ElementRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { HelperService } from 'src/app/helper.service';

import { map } from 'rxjs/internal/operators/map';

import {  FileUploader } from 'ng2-file-upload';
declare var toastr: any;


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

  constructor(
    public route: ActivatedRoute, 
    public userService: UserService, 
    public helperService: HelperService, 
    public router: Router,
  ) {}
  public userModel = { email: "",password:"",updatedPassword:"" ,updatedPasswordConfirm:"",photo:"",name:"",role:""};
  @Input() public userDialogConfig;
  public userId;
  public showLoader = false;
  public passwordModel = {password:"",updatedPassword:"",updatedPasswordConfirm:""};
  public authToken = this.helperService.getLocalStorageData("authToken");
  public UserPhotoURL = 'http://127.0.0.1:3000/api/v1/users/updateMe';
  public uploader:FileUploader = new FileUploader({url: this.UserPhotoURL,autoUpload: true,allowedFileType: ['image'],headers: [{ name: 'authorization', value: 'Bearer '+this.authToken}],itemAlias: 'photo'});

  public isSelfUser = true; 

  ngOnInit() {
    this.showLoader = true;

    if (this.userDialogConfig) {
      console.log(this.userDialogConfig)
      this.isSelfUser = false;
      this.showLoader = false;
      this.userModel = this.userDialogConfig;
      this.userId = this.userDialogConfig._id
    } else {
      this.getUser()
    }

    //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file)=> { 
      this.showLoader = true;
      file.withCredentials = false; 
    };
  
    //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        this.showLoader = false;
        toastr.success('Image Uploaded Successfully');
        console.log("ImageUpload:uploaded:", item, status, response);
    };

    toastr.options = this.helperService.getToastOption();
    

  }

  getUser(){
      this.userService.getMe().subscribe((response) => {

        if (response["status"] == "success") {
          if (response.data) {
            let _response = response.data;
            if (_response.data) {
              this.userModel = _response.data;
            }
          }
        }
        this.showLoader = false;
      }, (error) => {
        console.log(error);
        this.showLoader = false;
      })
  }

  updateContactInfo() {
    this.showLoader = true;
    if(this.isSelfUser){
      this.updateMe();
    }else{
      this.updateUser();
    }
   
  }

  updateMe(){
    this.userService.updateMe(this.userModel).subscribe((response) => {
      if (response["status"] == "success") {
        toastr.success('User Updated Successfully');
        this.showLoader = false;
      }
    }, (error) => {
      console.log(error);
      this.showLoader = false;
    })
  }

  updateUser() {
    this.userService.updateUser(this.userId,this.userModel).subscribe((response) => {
      if (response["status"] == "success") {
        toastr.success('User Updated Successfully');
        this.showLoader = false;
      }
    }, (error) => {
      console.log(error);
      this.showLoader = false;
    })
  }

  updatePassword() {
    this.showLoader = true;
    this.passwordModel["email"] = this.userModel.email;
    this.userService.updatePassword(this.passwordModel).subscribe((response) => {
      if (response["status"] == "success") {
        toastr.success('Password Updated Successfully');
        this.helperService.clearLocaleStorage();
        this.router.navigate(['/welcome/login']);
        this.showLoader = false;
      }
    }, (error) => {
      console.log(error);
      this.showLoader = false;
    })
  }
}
