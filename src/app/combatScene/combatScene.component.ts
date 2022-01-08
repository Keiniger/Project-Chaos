import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BattleSystem } from '../battleSystem.service';
import { UserService } from '../user.service';
import { UtilsService } from '../utils';
import { MatDialog } from '@angular/material/dialog';
import { ShopDialog } from './shopDialog/shopDialog.component';

@Component({
  selector: 'combat-scene',
  templateUrl: './combatScene.component.html',
  styleUrls: ['./combatScene.component.scss']
})
export class CombatSceneComponent implements OnInit {

  constructor(
    public battleSystem: BattleSystem, private db: AngularFirestore, public userService: UserService, public router: Router, public utilsService: UtilsService, public dialog: MatDialog
  ) { }

  @ViewChild("end") MyProp: ElementRef;
  @ViewChild("arr") OtherProp: ElementRef;


  //CONSTANTS
  daysUntilCycleChange = 6;
  initialCardAmount = 5;
  grabbedCardsCost = 2;

  mySuscription;
  player;
  enemy;
  allAbilities = []
  toUse = []
  turnCount = 1
  log = []
  currentShow;
  currentStatus;
  isPlayer;
  msgEvent;
  typeEvent;
  //Players current actions
  playerCA = []
  enemyCA = []
  delay = ms => new Promise(res => setTimeout(res, ms));
  //All current actions
  state = []
  showInfo;
  currentTurnLog = []
  waitingForEnemy;
  showingTurns;
  enemyDamagePopUp;
  playerDamagePopUp;
  formattedLog = []
  realGame = true;
  battleContent;
  loading = true;
  isOver;
  dayCycle = "day";
  amountToGrab = 0;
  alreadySelected = []
  grabbedCards = 0;
  currentPlayerHand = []
  playerDeck = []
  currentGold = 0;

  async ngOnInit() {

    this.enemy = {}
    this.player = {}
    if (!this.userService.getCharacter()) {
      this.router.navigate(['/'])
      return
    }

    this.loading = true;
    this.battleSystem.setBattle(this)

    if (!this.battleSystem.realGame()) {
      this.player = { ...this.userService.getCharacter() }
      this.enemy = { ...this.battleSystem.getRandomCharacter() }

      this.managePlayerData()

      this.loading = false;
    }

    else {


      this.player = { ...this.userService.getCharacter() }

      this.getBattle()
    }
  }

  ngOnDestroy() {
    if (this.mySuscription) {
      this.mySuscription.unsubscribe();
    }
  }

  howMuchUntilNext() {
    return this.daysUntilCycleChange - (this.turnCount % this.daysUntilCycleChange);
  }

  managePlayerData() {
    this.player.combatant = this.enemy
    this.enemy.combatant = this.player

    this.enemy.crowdControl = []
    this.player.crowdControl = []

    this.player.chealth = this.player.health;
    this.enemy.chealth = this.enemy.health;

    this.player.currentActions = []
    this.enemy.currentActions = []

    this.player.potions = []
    this.enemy.potions = []

    //esto deberia venir segun la seleccion
    //this.abilitiesSelected = [...this.player.abilities];
    this.enemy.abilitiesSelected = this.enemy.class.prototype.getAbilities();

    this.player.abilities.forEach(ability => {

      for (let index = 0; index < 4; index++) {
        this.playerDeck.push(ability)
      }

    })

    for (let index = 0; index < this.initialCardAmount; index++) {

      let randomCardSelection = Math.floor(Math.random() * this.playerDeck.length)

      if (this.alreadySelected.includes(randomCardSelection)) {
        index -= 1
        continue;
      }

      this.currentPlayerHand.push(this.playerDeck[randomCardSelection])
      this.alreadySelected.push(randomCardSelection)
    }

  }

  getBattle() {

    let docRef = this.db.collection("rooms").doc(this.battleSystem.getBattleId().id);

    docRef.get().subscribe((doc) => {
      if (doc.exists) {
        this.battleContent = doc.data()

        let variable = this.battleSystem.getBattleId().side == 'player' ? 'enemyChar' : 'playerChar'
        let enemyCharacterId = this.battleContent[variable]
        this.enemy = { ...this.userService.getCharacterById(enemyCharacterId) }
        this.managePlayerData()
        this.loading = false;

      } else {
        this.loading = false;
      }
    })

  }

  refreshStats(resp) {
    this.player = resp.player ? resp.player : this.player
    this.enemy = resp.enemy ? resp.enemy : this.enemy
  }

  isEmptyObject(obj) {
    return Object.keys(obj).length === 0
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.utilsService.playGrabSound()
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


  totalAbilityCost() {
    let sum = 0;
    this.toUse.forEach(element => {
      if (this.dayCycle == 'day') {
        sum += element.cost
      }
      if (this.dayCycle == 'night') {
        sum += element.ncost
      }
    })

    return sum + this.grabbedCards * this.grabbedCardsCost;
  }

  async playTurn() {

    this.showInfo = null;

    this.waitingForEnemy = true;

    this.utilsService.playButtonClick()

    await this.delay(1500);

    this.amountToGrab = this.toUse.length - this.grabbedCards;

    await this.battleSystem.buildTurn(this.toUse, this.player);

    if (!this.battleSystem.realGame()) {
      this.battleSystem.fabricateAITurn()
      this.processTurn()
      this.waitingForEnemy = false;
    }

    else {

      let variable = this.battleSystem.getBattleId().side == 'player' ? 'enemyMove' : 'playerMove'
      let variablePotions = this.battleSystem.getBattleId().side == 'player' ? 'enemyPotions' : 'playerPotions'

      this.mySuscription = this.db.collection("rooms").doc(this.battleSystem.getBattleId().id).valueChanges().subscribe(
        async data => {
          if (data[variable]) {

            if(data[variablePotions]){
              this.enemy.potions = JSON.parse(data[variablePotions])
            }

            if(this.enemy.potions.includes('redpot')){
              this.enemy.chealth +=  7;
              const index = this.enemy.potions.indexOf('redpot');
              this.enemy.potions.splice(index, 1);
            }

            let parsedAbilityList = JSON.parse(data[variable]);

            if (parsedAbilityList.length == 0) {
              this.log.push({ turn: this.turnCount, text: "Enemy skipped turn" })
            }
            parsedAbilityList.forEach(ability => {
              this.enemy.currentActions.push(this.enemy.class.prototype.executeAbility(ability, this.enemy, this))
            })

            console.log(this.turnCount)
            console.log(parsedAbilityList)
            console.log(this.toUse)

            await this.processTurn()
          }
        }
      )
    }
  }

  grabCard() {
    let randomCardSelection = Math.floor(Math.random() * this.playerDeck.length)

    if (this.alreadySelected.includes(randomCardSelection)) {
      this.grabCard()
      return;
    }

    this.currentPlayerHand.push(this.playerDeck[randomCardSelection])
    this.alreadySelected.push(randomCardSelection)
    this.grabbedCards += 1;
    this.utilsService.playGrabSound()
  }

  canGrab() {

    if (this.totalAbilityCost() + 3 > this.player.ap) {
      return false
    }

    return true

  }

  async processTurn() {
    if (this.battleSystem.realGame()) {
      this.mySuscription.unsubscribe();
      await this.battleSystem.cleanOnlineTurn()
    }

    this.showingTurns = true;
    this.waitingForEnemy = false;

    this.battleSystem.unfoldTurn()
    this.battleSystem.executeActions()

    await this.buildGraphState()

    if (this.isOver) {
      this.showTurnLog()

      return;
    }

    this.showingTurns = false;

    this.showTurnLog()
    this.battleSystem.cleanState()

    if (this.turnCount % 2 == 0 && this.turnCount != 2) {
      this.player.ap++
      this.enemy.ap++
    }

    if (this.turnCount % this.daysUntilCycleChange == 0) {
      this.dayCycle == 'day' ? this.dayCycle = 'night' : this.dayCycle = 'day'
    }

    if (this.alreadySelected.length == this.playerDeck.length) {
      this.alreadySelected = [];
    }

    for (let index = 0; index < this.amountToGrab; index++) {

      let randomCardSelection = Math.floor(Math.random() * this.playerDeck.length)

      if (this.alreadySelected.includes(randomCardSelection)) {
        index -= 1
        continue;
      }

      this.currentPlayerHand.push(this.playerDeck[randomCardSelection])
      this.alreadySelected.push(randomCardSelection)
    }

    this.utilsService.playGrabSound()

    this.toUse = []
    this.grabbedCards = 0;

    this.formattedLog = this.log.reduce(function (r, a) {
      r[a.turn] = r[a.turn] || [];
      r[a.turn].push(a);
      return r;
    }, Object.create(null));

    setTimeout(() => {
      this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }, 100);
  }

  showTurnLog() {
    this.turnCount++

    if (this.turnCount % 2 == 0 && this.turnCount != 2) {
      this.player.ap++
      this.enemy.ap++
    }

    this.formattedLog = this.log.reduce(function (r, a) {
      r[a.turn] = r[a.turn] || [];
      r[a.turn].push(a);
      return r;
    }, Object.create(null));

    setTimeout(() => {
      this.MyProp.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }, 100);

    if (this.isOver) {
      this.db.collection('rooms').doc(this.battleSystem.battleId().id).update({
        log: JSON.stringify(this.formattedLog),
        status: 'finished',
      })
    }
  }

  async buildGraphState() {

    for (let index = 0; index < this.state.length; index++) {

      const st = this.state[index];
      let hasDamagePot = st.issuer.potions.includes('damagepot') ? 2 : 0;
      let multiplyModifiers = this.utilsService.damageSent(st.issuer) * this.utilsService.damageRecieved(st.objective)
      let objectiveIsDodgingIncoming = this.utilsService.isDodging(st.objective) && !st.isSelf
      let issuerIsStunned = this.utilsService.isStunned(st.issuer)
      let isDodgingStatus = st.type == 'status' && (objectiveIsDodgingIncoming || issuerIsStunned)

      if (st.isSecondary) {
        continue;
      }

      switch (st.type) {

        case "heal":
          this.currentShow = st.issuer;
          this.currentStatus = st.ability;
          this.msgEvent = st.issuer.name + " recovered some hp ";
          this.utilsService.playHealSound()
          break;

        case "status":
          this.currentShow = st.objective;
          this.currentStatus = st.ability;
          if (st.effect == 'mana') {
            this.msgEvent = st.objective.name + " gained some mana!"
            this.utilsService.playHealSound()
            break;
          }

          if (isDodgingStatus) {
            this.msgEvent = st.issuer.name + " used " + st.ability.name + " but " + st.objective.name + " dodged!"
            this.utilsService.playShieldSound();
            break;
          }

          this.msgEvent = st.objective.name + " is now " + this.utilsService.translateEffect(st.effect, st.amount) + "!"
          break;

        case "damage":
          this.currentShow = st.issuer;
          this.currentStatus = st.ability;
          this.isPlayer = st.issuer.combatant === this.enemy;

          if (issuerIsStunned) {
            this.msgEvent = st.issuer.name + " wanted to used " + st.ability.name + " but couldn't move! "
          }

          if (objectiveIsDodgingIncoming) {
            this.msgEvent = st.issuer.name + " used " + st.ability.name + " but " + st.objective.name + " dodged!"
            this.utilsService.playShieldSound();
          }

          if (!issuerIsStunned && !objectiveIsDodgingIncoming) {
            let am = !st.ignoreModifiers ? (st.amount * multiplyModifiers) + hasDamagePot: st.amount

            this.utilsService.playAttackSound();
            this.msgEvent = st.issuer.name + " used " + st.ability.name
            this.showDamageAnimation(Math.round(am), st.objective)
            if(st.issuer == this.player){
              this.currentGold += Math.round(am/2)
            }
          }

          break;

        default:
          break;
      }

      if (this.isOver) {
        return;
      }

      this.typeEvent = st.type;
      await this.delay(3000);

    }
  }


  async showDamageAnimation(amount, evObjective) {

    let isPlayer = evObjective != this.enemy;

    if (isPlayer) {
      this.playerDamagePopUp = amount;
    }

    else {
      this.enemyDamagePopUp = amount;
    }

    await this.delay(2000);

    this.playerDamagePopUp = null;
    this.enemyDamagePopUp = null;
  }

  generateTurnList() {
    return Object.keys(this.formattedLog);
  }

  getLogTurn(turn) {
    return this.formattedLog[turn]
  }

  time: number = 0;
  interval;

  openTooltip(evt, card) {

    clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.time++;

      if (this.time == 2) {
        this.showInfo = evt;
      }

    }, 50)

  }

  closeTooltip(evt, card) {
    this.time = 0;
    clearInterval(this.interval);
    this.showInfo = null;
  }

  getUserBuffs(player) {

    let buffList = []

    if (!player.crowdControl) {
      return
    }

    player.crowdControl.forEach(cc => {

      switch (true) {
        case cc.effect == 'damage_dealt' && cc.amount > 1:
          cc.icon = '../../assets/abilityicons/damage_dealt.jpeg'
          cc.descrip = 'Deals ' + (cc.amount * 100 - 100) + '% more damage for ' + cc.turnsActive + ' turns'
          buffList.push(cc)
          break;

        case cc.effect == 'speed' && cc.amount > 1:
          cc.icon = '../../assets/abilityicons/speed.jpeg'
          cc.descrip = 'You are ' + (cc.amount * 100 - 100) + '% faster for ' + cc.turnsActive + ' turns'
          buffList.push(cc)
          break;

        case cc.effect == 'dodge':
          cc.icon = '../../assets/abilityicons/dodge.jpeg'
          cc.descrip = 'Dodges incoming abilities for ' + cc.turnsActive + ' turns'
          buffList.push(cc)
          break;

        default:
          break;
      }
    })

    return buffList
  }

  getUserDebuffs(player) {
    let buffList = []
    if (!player.crowdControl) {
      return
    }
    player.crowdControl.forEach(cc => {

      switch (true) {
        case cc.effect == 'damage_dealt' && cc.amount < 1:
          cc.icon = '../../assets/abilityicons/less_damage.jpeg'
          cc.descrip = 'Deals ' + (cc.amount * 100 - 100) + '% less damage for ' + cc.turnsActive + ' turns'
          buffList.push(cc)
          break;

        case cc.effect == 'speed' && cc.amount < 1:
          cc.icon = '../../assets/abilityicons/speed.jpeg'
          cc.descrip = 'You are ' + (cc.amount * 100 - 100) + '% faster for ' + cc.turnsActive + ' turns'
          buffList.push(cc)
          break;

        case cc.effect == 'stun':
          cc.icon = '../../assets/abilityicons/stunned.jpeg'
          cc.descrip = 'Cant cast abilities for ' + cc.turnsActive + ' turns'
          buffList.push(cc)
          break;

        case cc.effect == 'bleed':
          cc.icon = '../../assets/abilityicons/bleed.jpeg'
          cc.descrip = 'Loses ' + cc.amount + ' health for ' + cc.turnsActive + ' turns'
          buffList.push(cc)
          break;

        default:
          break;
      }
    })

    return buffList
  }

  seeShop() {
    const dialogRef = this.dialog.open(ShopDialog, {
      width: '60%',
      disableClose: true,
      data: {currentGold: this.currentGold},
    });

    dialogRef.afterClosed().subscribe(result => {
      
      result.forEach(element => {
        this.player.potions.push(element)
        this.currentGold -= 20;
      });

      if(result.includes('redpot')){
        this.player.chealth += 7;
      }

      if(result.includes('bluepot')){
        this.player.ap += 2;
      }
      
    });

  }


}
