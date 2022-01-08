import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })

export class UtilsService {

  
damageSent(user) {

  let totalModifierValue = 1;

  user.crowdControl.forEach(cc => {
    if (cc.effect == "damage_dealt") {
      totalModifierValue = totalModifierValue * cc.amount
    }
  });

  return totalModifierValue
}


damageRecieved(user) {

  let totalModifierValue = 1;

  user.crowdControl.forEach(cc => {
    if (cc.effect == "damage_recieved") {
      totalModifierValue = totalModifierValue * cc.amount
    }
  });
  
  return totalModifierValue
}

translateEffect(effect,amount) {

  switch (effect) {
    case "dodge":
      return "dodging this round attacks"
      break;

    case "stun":
      return "stunned"
      break;

    case "slow":
      return "slowed"
      break;

    case "bleed":
      return "bleeding"
      break;

    case "slow":
      return "slowed"
      break;

    case "mana":
      return "accumulating power"
      break;

    case "damage_dealt":
      if(amount > 1){
        return "dealing more damage"
      }
      else{
        return "dealing less damage"
      }
      break;

    case "damage_recieve":
      if(amount > 1){
        return "recieving less damage"
      }
      else{
        return "recieving more damage"
      }
      break;

    default:
      break;
  }

}


isDodging(user) {
  let found = user.crowdControl.find(elem => elem.effect == 'dodge')
  if (found) return true
  return false
}

isStunned(user) {
  let found = user.crowdControl.find(elem => elem.effect == 'stun')
  if (found) return true
  return false
}

playGrabSound() {
  let audio = new Audio();
  audio.src = "../../../assets/grabcard.mp3";
  audio.volume = 0.3;
  audio.load();
  audio.play()
}

playAttackSound() {
  let audio = new Audio();
  audio.src = "../../../assets/hit.mp3";
  audio.volume = 0.3;
  audio.load();
  audio.play()
}
playHealSound() {
  let audio = new Audio();
  audio.src = "../../../assets/magic.wav";
  audio.volume = 0.3;
  audio.load();
  audio.play()
}

playWelcomeSound() {
  let audio = new Audio();
  audio.src = "../../../assets/welcome.mp3";
  audio.volume = 0.8;
  audio.load();
  audio.play()
}

playCoinSound() {
  let audio = new Audio();
  audio.src = "../../../assets/buySomething.mp3";
  audio.volume = 0.8;
  audio.load();
  audio.play()
}

playButtonClick() {
  let audio = new Audio();
  audio.src = "../../../assets/buttonClick.wav";
  audio.volume = 0.2;
  audio.load();
  audio.play()
}

playShieldSound() {
  let audio = new Audio();
  audio.src = "../../../assets/shield.mp3";
  audio.volume = 0.2;
  audio.load();
  audio.play()
}


}
