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
  selector: 'shop',
  templateUrl: './shopDialog.component.html',
  styleUrls: ['./shopDialog.component.scss']
})
export class ShopDialog implements OnInit {



  gold = 0;
  toBuy = []

  redpotValue = 20
  bluepotValue = 20
  speedpotValue = 20
  damagepotValue = 20

  constructor(
    public battleSystem: BattleSystem, private db: AngularFirestore, public userService: UserService, public router: Router, public utilsService: UtilsService,
    public dialogRef: MatDialogRef<ShopDialog>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    
  }

  ngOnInit() {
    this.utilsService.playWelcomeSound()
    console.log(this.data)
    
    this.gold = this.data.currentGold
  }

  close(){
    this.dialogRef.close(this.toBuy)
  }


  buy(pot){

    switch (pot) {
      case 'redpot':
        
        if(this.gold >= this.redpotValue){
          this.gold -= this.redpotValue
          this.utilsService.playCoinSound()
          this.toBuy.push('redpot')
        }

        break;

      case 'bluepot':
        
        if(this.gold >= this.bluepotValue){
          this.gold -= this.bluepotValue
          this.utilsService.playCoinSound()
          this.toBuy.push('bluepot')
        }

        break;

      case 'speedpot':
      
        if(this.gold >= this.speedpotValue){
          this.gold -= this.speedpotValue
          this.utilsService.playCoinSound()
          this.toBuy.push('speedpot')
        }

        break;

      case 'damagepot':
    
        if(this.gold >= this.damagepotValue){
          this.gold -= this.damagepotValue
          this.utilsService.playCoinSound()
          this.toBuy.push('damagepot')
        }

        break;
    
      default:
        break;
    }
  }

}
