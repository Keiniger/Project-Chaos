import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })

export class Warrior {

  executeAbility(ability, user, battle) {

    console.log(ability)
    let randomCritChance = 0
    let event = [];
    let nightEvent = [];

    switch (ability.name) {
      case 'Sword Slash':
        event = [{ type: 'damage', amount: 5 * (randomCritChance > 70 ? 2 : 1), objective: user.combatant }]
        nightEvent = [{ type: 'damage', amount: 5 * (randomCritChance > 70 ? 2 : 1), objective: user.combatant }]
        break;

      case 'Low kick':
        event = [

          { type: 'damage', amount: Math.round(user.combatant.health * 0.04), objective: user.combatant },
          { type: 'status', turnsActive: 1, objective: user.combatant, effect: 'stun', isSecondary: true }]

          nightEvent = [
          
          { type: 'damage', amount: Math.round(user.combatant.health * 0.04), objective: user.combatant },
          { type: 'status', turnsActive: 1, objective: user.combatant, effect: 'stun', isSecondary: true }]

        break;

      case 'God of war':
        event = [{ type: 'status', turnsActive: 2, objective: user, effect: 'damage_dealt', amount: 1.8 }]
        nightEvent = [{ type: 'status', turnsActive: 2, objective: user, effect: 'damage_dealt', amount: 1.4 }]

        break;

      case 'Enchanted Sword':
        event = [{ type: 'damage', amount: this.getGatheringDamage(user, battle) * 2, objective: user.combatant }]
        nightEvent = [{ type: 'damage', amount: 5 * (randomCritChance > 70 ? 2 : 1), objective: user.combatant }]

        break;

      case 'You Think Im Done?':
        event = [{ type: 'heal', amount: Math.round(user.combatant.health * 0.5 / user.combatant.chealth), objective: user },
        { type: 'status', turnsActive: 2, objective: user.combatant, effect: 'damage_dealt', amount: 0.8, isSecondary: true }]
        nightEvent = [{ type: 'damage', amount: 5 * (randomCritChance > 70 ? 2 : 1), objective: user.combatant }]

        break;

      case 'Decimating Strike':
        event = [{ type: 'damage', amount: 8 * (randomCritChance > 70 ? 2 : 1), objective: user.combatant },
        {type: 'status' , turnsActive: 3 , objective: user.combatant , effect: 'bleed', isSecondary: true, amount: 1 }]

        nightEvent = [{ type: 'damage', amount: 8 * (randomCritChance > 70 ? 2 : 1), objective: user.combatant },
        {type: 'status' , turnsActive: 3 , objective: user.combatant , effect: 'bleed', isSecondary: true, amount: 1 }]

        break;

      case 'Counter-strike':
        event = [{type: 'status' , turnsActive: 1 , objective: user , effect: 'dodge'},
        {type: 'damage', amount: 5, objective: user.combatant }]

        nightEvent = [{type: 'damage', amount: 5, objective: user.combatant }]
        break;

      default:
        console.log('Attack not defined!')
        break;
    }

    event.forEach(evt => {
      evt.ability = ability
      evt.issuer = user
      evt.isSelf = evt.objective === user;
      evt.priority = ability.priority
    });

    nightEvent.forEach(evt => {
      evt.ability = ability
      evt.issuer = user
      evt.isSelf = evt.objective === user;
      evt.priority = ability.priority
    });

    return battle.dayCycle == 'day' ? event : nightEvent
  }

  calculateBlood(event, user) {
    let randomCritChance = Math.random() * 100;
    randomCritChance > 85 ? event.push({ type: 'status', turnsActive: 3, objective: user.combatant, effect: 'bleed', isSecondary: true, amount: 2 }) : null;
  }


  getGatheringDamage(user, battle) {

    let actionCost = 0;
    let currentMana = this.mana(user.ap,battle.turnCount)

    user.currentActions.forEach(action => {
      console.log(action)

      actionCost += action.ability.cost;
    });



    return currentMana - actionCost;
  }

  mana(ap, cant) {
    if (cant <= 3){
      return ap
    }
    else{
      return Math.round((cant / 2) + ap - (cant % 2) - 0.6)
    }
  }


  getAbilities() {

    let abilities = [
      {
        name: 'Sword Slash',
        cooldown: 2,
        cost: 2,
        priority: 0,
        description: 'Deals 5 damage',
        image: '../../assets/abilityicons/sword_slash.jpeg',
        npriority: 0,
        ncost: 2
      },
      {
        name: 'Sword Slash',
        cooldown: 2,
        cost: 2,
        priority: 0,
        description: 'Deals 5 damage',
        image: '../../assets/abilityicons/sword_slash.jpeg',
        npriority: 0,
        ncost: 2
      },
      {
        name: 'Low kick',
        cooldown: 3,
        cost: 4,
        priority: 0,
        description: 'Deals a 10% of the enemy maximum health and stuns the target',
        image: '../../assets/abilityicons/low_kick.jpeg',
        type: 'physical',
        npriority: 0,
        ncost: 4
      },
      {
        name: 'God of war',
        cooldown: 4,
        cost: 3,
        priority: 0,
        description: 'Gains 80% more damage. Goes down to 40% at night',
        image: '../../assets/abilityicons/god_of_war.jpeg',
        type: 'physical',
        npriority: 0,
        ncost: 4
      },
      /*
      {
        name: 'Enchanted Sword',
        cooldown: 4,
        cost: 1,
        priority: 0,
        description: 'Deals double the amount of mana you didnt spend this turn',
        image: '../../assets/abilityicons/enchanted_sword.jpeg',
        type: 'physical'
      },
      */
      {
        name: 'You Think Im Done?',
        cooldown: 6,
        cost: 5,
        priority: -1,
        description: 'Always goes last. Heals more when low HP. The target deals 20% less damage',
        image: '../../assets/abilityicons/im_done.jpeg',
        type: 'physical',
        npriority: -1,
        ncost: 5
      },
      {
        name: 'Counter-strike',
        cooldown: 4,
        cost: 3,
        priority: 1,
        description: "Deals 6 damage and avoids this round attacks. At night the dodge effect doesn't apply",
        image: '../../assets/abilityicons/counter_strike.jpeg',
        type: 'physical',
        npriority: 1,
        ncost: 3
      },
      {
        name: 'Decimating Strike',
        cooldown: 4,
        cost: 4,
        priority: 0,
        description: 'Deals 8 damage and makes the target bleed for 3 turns',
        image: '../../assets/abilityicons/decimating_strike.jpeg',
        type: 'physical',
        npriority: 0,
        ncost: 4
      },
    ]

    return abilities
  }

}
