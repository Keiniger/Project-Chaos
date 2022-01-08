import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { BehaviorSubject, of } from "rxjs";
import { Characters } from "./characters";
import { UserService } from "./user.service";
import { UtilsService } from "./utils";

@Injectable({ providedIn: 'root' })

export class BattleSystem {

  constructor(private characters: Characters, private router: Router, private db: AngularFirestore, private userService: UserService, public utilsService: UtilsService) { }
  private messageSource = new BehaviorSubject<Object>({});
  store = this.messageSource.asObservable();
  battle;
  currentTurn;
  delay = ms => new Promise(res => setTimeout(res, ms));
  battleId;
  playerSide;
  AIControlled = false;

  setBattleId(id, side) {
    this.battleId = id;
    this.playerSide = side;
    this.router.navigate(['/battle'])
  }

  setAIGame() {
    this.AIControlled = true;
  }

  realGame() {
    return !this.AIControlled;
  }


  setBattle(battle) {
    this.battle = battle
  }

  getBattleId() {
    return { id: this.battleId, side: this.playerSide };
  }

  getRandomCharacter() {
    let list = this.characters.getCharacterList()
    let randomNumber = Math.round(Math.random() * (3 - 0) + 0)

    while (list[randomNumber].name == this.userService.getCharacter().name) {
      randomNumber = Math.round(Math.random() * (3 - 0) + 0)
    }

    return list[randomNumber]
  }

  async buildTurn(abilityList, user) {


    if (abilityList.length == 0) {
      this.battle.log.push({ turn: this.battle.turnCount, text: user.name + " skipped turn" })
    }

    /*
    user.abilities.forEach(ability => {
      if (ability.current_cooldown > 0) {
        ability.current_cooldown -= 1;
      }
    });
    */

    abilityList.forEach(ability => {
      user.currentActions.push(user.class.prototype.executeAbility(ability, user, this.battle))
      //this.userAbility(ability.name, user).current_cooldown = ability.cooldown;
    })

    user.currentActions = user.currentActions.flat()

    await this.playOnlineTurn(user);

    //this.battle.toUse = []
  }

  async executeActions() {

    for (let index = 0; index < this.battle.state.length; index++) {

      let ev = this.battle.state[index];
      console.log(ev)
      let hasDamagePot = ev.issuer.potions.includes('damagepot') ? 2 : 0;
      let multiplyModifiers = this.utilsService.damageSent(ev.issuer) * this.utilsService.damageRecieved(ev.objective);
      let objectiveIsDodgingIncoming = this.utilsService.isDodging(ev.objective) && !ev.isSelf

      let issuerIsStunned = this.utilsService.isStunned(ev.issuer)
      let isDodgingStatus = ev.type == 'status' && (objectiveIsDodgingIncoming || issuerIsStunned)
      
      if (!objectiveIsDodgingIncoming && !issuerIsStunned) {

        if (!ev.isSecondary) {
          this.battle.log.push({ turn: this.battle.turnCount, text: ev.issuer.name + " used " + ev.ability.name })
        }

        switch (ev.type) {
          case 'damage':
            let am = !ev.ignoreModifiers ? (ev.amount + hasDamagePot) * multiplyModifiers: ev.amount
            ev.objective.chealth -= Math.round(am)
            this.battle.log.push({ turn: this.battle.turnCount, text: ev.ability.name + " caused " + Math.round(am) + " damage to " + ev.objective.name })
            break;

          case 'heal':
            ev.objective.chealth += ev.amount;
            this.battle.log.push({ turn: this.battle.turnCount, text: ev.objective.name + " was healed by " + ev.amount })
            break;

          case 'status':
            ev.objective.crowdControl.push({ effect: ev.effect, turnsActive: ev.turnsActive, objective: ev.objective, issuer: ev.issuer, amount: ev.amount })
            this.battle.log.push({ turn: this.battle.turnCount, text: ev.objective.name + " is " + this.utilsService.translateEffect(ev.effect, ev.amount) + "!" })
            break;

          default:
            break;
        }
      }

      if (this.utilsService.isDodging(ev.objective) && !ev.isSelf && !ev.isSecondary) {
        this.battle.log.push({
          turn: this.battle.turnCount, text: ev.issuer.name +
            " used " +
            ev.ability.name +
            " but " + ev.objective.name +
            " dodged! "
        })
      }

      if (this.utilsService.isStunned(ev.issuer)) {
        this.battle.log.push({ turn: this.battle.turnCount, text: ev.issuer.name + " wanted to use " + ev.ability.name + " but couldn't move! " })
      }

      if (ev.objective.chealth < 0) {
        this.battle.isOver = ev.issuer;
        return;
      }
      
      await this.delay(isDodgingStatus || ev.isSecondary ? 0 : 3000);

    }

    this.battle.player.currentActions = []
    this.battle.enemy.currentActions = []

    this.executeSE()

    //this.battle.allAbilities = [...this.battle.player.abilities]

  }

  executeSE() {
    let speeds = this.getSpeeds()
    let state = speeds.fastest.crowdControl.concat(speeds.slowest.crowdControl)

    for (let index = 0; index < state.length; index++) {

      const cc = state[index];
      let multiplyModifiers = this.utilsService.damageSent(cc.issuer) * this.utilsService.damageRecieved(cc.objective);

      switch (cc.effect) {
        case 'bleed':
          let am = cc.amount * multiplyModifiers
          cc.objective.chealth -= Math.round(am)
          this.battle.log.push({ turn: this.battle.turnCount, text: cc.objective.name + " is bleeding and lost " + Math.round(am) + " health." })
          break;

        case 'mana':
          cc.objective.ap += cc.amount
          this.battle.log.push({ turn: this.battle.turnCount, text: cc.objective.name + " gained some mana!" })
          break;

        default:
          break;
      }
    }

  }

  userAbility(abilityName, user) {
    return user.abilities.find(ability => ability.name == abilityName && !ability.current_cooldown)
  }

  anyEvent(event, objective) {
    return this.battle.state.find(status => (status.objective == objective) && (status.type == event))
  }

  fabricateAITurn() {
    let allAbilities = this.battle.enemy.class.prototype.getAbilities().length;
    let randomAbility = this.battle.enemy.class.prototype.getAbilities()[Math.round(Math.random() * (allAbilities - 1))]
    this.buildTurn([randomAbility], this.battle.enemy)
  }

  async playOnlineTurn(user) {

    if (this.playerSide == 'enemy') {

      await this.db.collection('rooms').doc(this.battleId).update({
        enemyMove: JSON.stringify(this.battle.toUse),
        enemyPotions: JSON.stringify(user.potions)
      });

    }

    if (this.playerSide == 'player') {

      await this.db.collection('rooms').doc(this.battleId).update({
        playerMove: JSON.stringify(this.battle.toUse),
        playerPotions: JSON.stringify(user.potions)
      });

    }
    
    if(this.battle.player.potions.includes('redpot')){
      const index = this.battle.player.potions.indexOf('redpot');
      this.battle.player.potions.splice(index, 1);
    }

    if(this.battle.player.potions.includes('bluepot')){
      const index = this.battle.player.potions.indexOf('bluepot');
      this.battle.player.potions.splice(index, 1);
    }

  }

  async cleanOnlineTurn() {

    let variable = this.playerSide == 'player' ? 'enemyMove' : 'playerMove'
    let variablePotions = this.playerSide == 'player' ? 'enemyPotions' : 'playerPotions'

    if(this.playerSide == 'player'){

      await this.db.collection('rooms').doc(this.battleId).update({
        enemyMove: null,
        playerPotions: JSON.stringify(this.battle.player.potions)
      }).then(function(docRef) {
        return 'go'
      })
    }

    if(this.playerSide == 'enemy'){
      await this.db.collection('rooms').doc(this.battleId).update({
        playerMove: null,
        enemyPotions: JSON.stringify(this.battle.player.potions)
      }).then(function(docRef) {
        return 'go'
      })
    }
  }


  unfoldTurn() {

    let speeds = this.getSpeeds()

    this.battle.state = speeds.fastest.currentActions.concat(speeds.slowest.currentActions)

    this.battle.state = this.battle.state.flat()

    this.battle.state.sort((a, b) => (a.priority < b.priority ? 1 : -1))

    //this.executeActions()
  }

  getSpeeds() {
    let fastest;
    let slowest

    let playerSpeed = this.battle.player.speed * this.speedModifiers(this.battle.player)
    let enemySpeed = this.battle.enemy.speed * this.speedModifiers(this.battle.enemy)

    if (playerSpeed > enemySpeed) {
      fastest = this.battle.player;
      slowest = this.battle.enemy;
    }

    if (playerSpeed < enemySpeed) {
      slowest = this.battle.player
      fastest = this.battle.enemy;
    }


    return { fastest: fastest, slowest: slowest }
  }

  speedModifiers(user) {
    let totalModifierValue = 1;

    user.crowdControl.forEach(cc => {
      if (cc.effect == "slow") {
        totalModifierValue = totalModifierValue * cc.amount
      }
    });

    if(user.potions.includes('speedpot')){
      totalModifierValue = totalModifierValue * 1.5
    }

    return totalModifierValue
  }

  cleanState() {
    let indexToDelete = []

    this.battle.state = []
    this.battle.player.crowdControl.forEach((cc, index) => {

      if (cc.turnsActive == 1) {
        this.battle.player.crowdControl.splice(index, 1)
      }

      else {
        cc.turnsActive -= 1
      }

    })

    this.battle.enemy.crowdControl.forEach((cc, index) => {

      if (cc.turnsActive == 1) {
        this.battle.enemy.crowdControl.splice(index, 1)
      }

      else {
        cc.turnsActive -= 1
      }

    })

    for (let i = indexToDelete.length - 1; i >= 0; i--) {
      this.battle.state.splice(indexToDelete[i], 1);
    }
  }


}
