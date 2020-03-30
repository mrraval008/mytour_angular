import { Component, OnInit } from '@angular/core';
import { DialogService } from './../dialog/dialog.service'
import { EditComponent } from './../edit/edit.component'
import { UserService } from 'src/app/user.service';
import { UserProfileDialogWrapperComponent } from 'src/app/user-profile-dialog-wrapper/user-profile-dialog-wrapper.component';
@Component({
  selector: 'app-user-cube',
  templateUrl: './user-cube.component.html',
  styleUrls: ['./user-cube.component.css']
})
export class UserCubeComponent implements OnInit {

  constructor(public dialog: DialogService,public userService : UserService) {
  }

  public defaultSearchCriterion = JSON.stringify({sortVal:"name"})
  public dialogRef;
  public userList = "";
  public showLoader = true;
  public sortItmeList = ["Name","Role"]
  

  ngOnInit() {
      this.getUserList(this.defaultSearchCriterion);
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
        console.log(error)
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
    this.getUserList(searchCriterion)
  }

  onDeleteClick(user){
    
  }

  

}
