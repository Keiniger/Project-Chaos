import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BattleSystem } from '../battleSystem.service';
import { Characters } from '../characters';
import { UserService } from '../user.service';
import { RoomDialog } from './roomDialog/roomDialog.component';

@Component({
  selector: 'pick-character',
  templateUrl: './pickCharacter.component.html',
  styleUrls: ['./pickCharacter.component.scss']
})
export class PickCharacterComponent implements OnInit {

  constructor(private characters: Characters, private dialog: MatDialog, private userService: UserService, private db: AngularFirestore, private battleSystem: BattleSystem,
    public router: Router) { }

  characterList = []
  characterSelected;
  abilities = []
  yourName;
  abilitiesSelected = []
  seeAllRooms = false;
  currentRoomName;
  currentRooms = [];
  loading;
  waitingForSomeone = false;
  roomCreated;
  foundSomeone;
  mySuscription;
  roomListShow = false;

  ngOnInit() {
    this.yourName = localStorage.getItem('nameSelected')
    this.characterList = this.characters.getCharacterList()

    this.getBattles();
  }

  pickCharacter(character) {
    this.characterSelected = character;
    this.getAbilities()
  }

  getAbilities() {
    this.abilities = this.characterSelected.class.prototype.getAbilities()
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  seeRooms() {
    this.characterSelected.abilities = this.abilities;
    this.userService.storeCharacter(this.characterSelected)
    this.seeAllRooms = true;
    localStorage.setItem('nameSelected', this.yourName)
    this.userService.storeName(this.yourName)
  }

  getBattles() {
    this.currentRooms = []
    this.db.collection('rooms').get().subscribe((response) => {
      response.forEach((doc) => {

        let pid = doc.data()['playerChar']

        this.currentRooms.push({
          id: doc.id,
          vs: this.userService.getCharacterById(pid),
          data: doc.data(),
        })

      })

      this.loading = false;
    })
  }

  createRoom(name, isPrivate) {
    this.currentRoomName = name;
    let that = this;
    this.mySuscription = this.db.collection("rooms").add({
      name: name,
      isPrivate: isPrivate,
      status: "waiting",
      playerChar: this.userService.getCharacter().id,
      hoster: this.yourName
    }).then(function (docRef) {
      that.waitingForSomeone = true;
      that.roomCreated = docRef.id;
      docRef.onSnapshot(async doc => {
        if (doc.data()['status'] == 'found') {

          that.foundSomeone = true;
          that.battleSystem.setBattleId(that.roomCreated, 'player')

          that.db.collection('rooms').doc(docRef.id).update({
            status: 'playing',
          })

        }
        else {
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
      if (doc.exists && (doc.data()['status'] != 'playing' || doc.data()['status'] != 'finished')) {

        that.battleSystem.setBattleId(room.id, 'enemy')

        this.db.collection('rooms').doc(room.id).update({
          status: 'found',
          enemyChar: this.userService.getCharacter().id,
        }).then(function (docRef) {
          console.log()
        })

      } else {
        this.loading = false;
      }
    })
  }

  cancel() {
    let that = this;
    this.db.collection('rooms').doc(this.roomCreated).delete().then(function (docRef) {
      that.waitingForSomeone = false;
      that.roomCreated = null;
      that.foundSomeone = false;
    })
  }

  singlePlayer() {
    this.battleSystem.setAIGame()
    this.router.navigate(['/battle']);
  }

  multiPlayer() {
    this.roomListShow = true;
    this.loading = true;
    this.getBattles();
  }

  openCreateDialog() {

    const dialogRef = this.dialog.open(RoomDialog, {
      width: '20%',
      disableClose: false,
      data: { type: 'create', params: {} }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.createRoom(result.params.roomName, result.params.isPrivate)
      }

    });

  }

  openJoinDialog() {

    const dialogRef = this.dialog.open(RoomDialog, {
      width: '20%',
      disableClose: false,
      data: { type: 'join', params: {} }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.joinRoom(result.params.roomToJoin)
      }

    });

  }



}
