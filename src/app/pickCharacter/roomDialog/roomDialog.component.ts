import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BattleSystem } from '../../battleSystem.service';
import { UserService } from '../../user.service';
import { UtilsService } from '../../utils';
import { doc, getDoc } from "firebase/firestore";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'room',
  templateUrl: './roomDialog.component.html',
  styleUrls: ['./roomDialog.component.scss']
})
export class RoomDialog implements OnInit {

  constructor(
    public battleSystem: BattleSystem, private db: AngularFirestore, public userService: UserService, public router: Router, public utilsService: UtilsService,
    public dialogRef: MatDialogRef<RoomDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    
  }

  roomName;

  roomToJoin;
  isPrivate = false;


  ngOnInit() {
    
  }

  closeAndJoin(){
    this.data.params['roomToJoin'] = this.roomName;
    this.dialogRef.close(this.data)
  }

  closeAndCreate(){
    this.data.params['roomName'] = this.roomName;
    this.data.params['isPrivate'] = this.isPrivate;
    this.dialogRef.close(this.data)
  }

}
