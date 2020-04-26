import { Component, OnInit } from '@angular/core';
import { DialogService } from './../dialog/dialog.service'
import { EditComponent } from './../edit/edit.component'
import { UserService } from 'src/app/user.service';
import { UserProfileDialogWrapperComponent } from 'src/app/user-profile-dialog-wrapper/user-profile-dialog-wrapper.component';
import { HelperService } from 'src/app/helper.service';

declare var toastr: any;

@Component({
  selector: 'app-user-cube',
  templateUrl: './user-cube.component.html',
  styleUrls: ['./user-cube.component.css']
})
export class UserCubeComponent implements OnInit {

  constructor(public dialog: DialogService,public userService : UserService,private helperService:HelperService) {
  }

  public defaultSearchCriterion = JSON.stringify({sortVal:"name"})
  public dialogRef;
  public userList :any;
  public showLoader = true;
  public sortItmeList = this.helperService.getUserSortItemList();
  

  ngOnInit() {
      this.getUserList(this.defaultSearchCriterion);
      toastr.options = this.helperService.getToastOption();
  }

  getUserList(searchCriterion){
    this.showLoader = true;
    this.userService.getUserList(searchCriterion).subscribe(response=>{
      this.showLoader = false
      if (response["status"] == "success") {
        if (response.data.data) {
          this.userList = response.data.data;
        }
      }
    },error=>{
      this.showLoader = false
      toastr.error(error.error.message)
    })
  }

  onEditClick(user){
    this.dialogRef = this.dialog.open(UserProfileDialogWrapperComponent,{
      data: { userData: user,dialogTitle:"Manage User"}})


    this.dialogRef.afterClosed.subscribe(result => {
        console.log('Dialog closed', result)
      })
  }

  searchCriterionChanged(searchCriterion){
    this.getUserList(searchCriterion[0])
  }

  onDeleteClick(user){
    this.showLoader = true;
    this.userService.deleteUser(user._id).subscribe((response)=>{
      this.showLoader = false;
      let userIndex = this.userList.findIndex(elem => elem._id == user._id);
      this.userList.splice(userIndex,1)
      toastr.success("User Removed succesfully");
    },error=>{
      this.showLoader = false;
      toastr.error(error.error.message)
    })
  }

  

}
