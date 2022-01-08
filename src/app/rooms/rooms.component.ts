import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { timingSafeEqual } from 'crypto';
import { BattleSystem } from '../battleSystem.service';
import { Characters } from '../characters';
import { UserService } from '../user.service';

@Component({
  selector: 'rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  mySuscription: any;

  constructor(private characters: Characters, private db: AngularFirestore, private userService: UserService, private battleSystem: BattleSystem, public router: Router) {}

  currentRoomName;
  currentRooms = [];
  loading;
  waitingForSomeone = false;
  roomCreated;
  foundSomeone;

  ngOnInit() {
    if (!this.userService.getCharacter()) {
      this.router.navigate(['/'])
      return
    }
    
    this.getBattles()
  }

  ngOnDestroy(){
    /*
    if(this.waitingForSomeone){
      this.db.collection('rooms').doc(this.roomCreated).delete().then(function(docRef) {
        this.waitingForSomeone = false;
        this.roomCreated = null;
        this.foundSomeone = false;
      })
    }
    */
  }

  getBattles() {
    this.loading = true;
    this.currentRooms = []
    this.db.collection('rooms').get().subscribe((response) => {
      response.forEach((doc) => {

        let pid = doc.data()['playerChar']

        this.currentRooms.push({
          id: doc.id,
          vs: this.userService.getCharacterById(pid),
          data: doc.data()
        })

      })
      
      this.loading = false;
    })
  }

  createRoom() {
    let that = this;
    this.mySuscription = this.db.collection("rooms").add({
      name: this.currentRoomName,
      status: "waiting",
      playerChar: this.userService.getCharacter().id,
    }).then(function(docRef) {
      that.waitingForSomeone = true;
      that.roomCreated = docRef.id;
      docRef.onSnapshot(async doc => {
        if(doc.data()['status'] == 'found'){
          console.log('found!')
          that.foundSomeone = true;
          that.battleSystem.setBattleId(that.roomCreated,'player')

          that.db.collection('rooms').doc(docRef.id).update({
            status: 'playing',
          })

        }
        else{
          console.log('room is gone sadly')
          that.mySuscription.unsubscribe();
        }
      })
    })
  }

  joinRoom(room) {
    let that = this;

    let docRef = this.db.collection("rooms").doc(room.id);

    docRef.get().subscribe((doc) => {
      if (doc.exists && (doc.data()['status']!='playing' || doc.data()['status']!='finished')) {

        that.battleSystem.setBattleId(room.id,'enemy')

        this.db.collection('rooms').doc(room.id).update({
          status: 'found',
          enemyChar: this.userService.getCharacter().id,
        }).then(function(docRef) {
          console.log()
        })

      } else {
        this.loading = false;
      }
    })
  }

  cancel(){
    let that = this;
    this.db.collection('rooms').doc(this.roomCreated).delete().then(function(docRef) {
      that.waitingForSomeone = false;
      that.roomCreated = null;
      that.foundSomeone = false;
    })
  }

  singlePlayer(){
    this.battleSystem.setAIGame()
    this.router.navigate(['/battle']);
  }


}
