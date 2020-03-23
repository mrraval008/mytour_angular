import { Component, OnInit } from '@angular/core';
import { DialogConfig } from 'src/app/dialog/dialog-config';
import { DialogRef } from 'src/app/dialog/dialog-ref';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  constructor(public config: DialogConfig,public dialog: DialogRef) { }
  
    ngOnInit() {
    }
    onClose() {
      this.dialog.close('some value')
    }
}
