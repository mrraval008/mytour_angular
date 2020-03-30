import { Component, OnInit } from '@angular/core';
import { DialogConfig } from 'src/app/dialog/dialog-config';
import { DialogRef } from 'src/app/dialog/dialog-ref';

@Component({
  selector: 'app-user-profile-dialog-wrapper',
  templateUrl: './user-profile-dialog-wrapper.component.html',
  styleUrls: ['./user-profile-dialog-wrapper.component.css']
})
export class UserProfileDialogWrapperComponent implements OnInit {

  constructor(
     public dialogConfig: DialogConfig,
    public dialog: DialogRef) { }

  public userDialogConfig

  ngOnInit() {
    if(this.dialogConfig.data.userData){
      this.userDialogConfig = this.dialogConfig.data.userData
    }
  }

}
