import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })

export class Ranger {

  executeAbility(ability, user, battle) {

    let randomCritChance = 0;
    let event = [];
    let nightEvent = [];

    switch (ability.name) {
      case 'Swift Arrow':
        event = [{ type: 'damage', amount: 5 * (randomCritChance > 70 ? 2 : 1), objective: user.combatant }]
        nightEvent = [{ type: 'damage', amount: 5 * (randomCritChance > 70 ? 2 : 1), objective: user.combatant }]
        break;

      case 'Incapacitate':

        event = [
          { type: 'damage', amount: 3, objective: user.combatant },
          { type: 'status', turnsActive: 3, objective: user.combatant, effect: 'slow', amount: 0.7, isSecondary: true}]

        nightEvent = [
          { type: 'damage', amount: 3, objective: user.combatant },
          { type: 'status', turnsActive: 3, objective: user.combatant, effect: 'slow', amount: 0.7, isSecondary: true}]

        break;

      case 'Enchanted Arrow':
        event = [{ type: 'damage', amount: this.getGatheringDamage(user, battle) * 2, objective: user.combatant }]
        nightEvent = [{ type: 'damage', amount: this.getGatheringDamage(user, battle) * 2, objective: user.combatant }]

        break;

      case 'Focus':
        event = [{type: 'status' , turnsActive: 2, objective: user , effect: 'damage_dealt', 
        amount: 1.5}]

        nightEvent = [{type: 'status' , turnsActive: 2, objective: user , effect: 'damage_dealt', 
        amount: 1.5}]
        break;

      case 'Spotted Weakness':
        event = [{ type: 'damage', amount: 8, objective: user.combatant, ignoreModifiers: true}]
        nightEvent = [{ type: 'damage', amount: 8, objective: user.combatant, ignoreModifiers: true}]
        break;

      case 'Precise Shot':
        event = [{ type: 'damage', amount: 7, objective: user.combatant }]
        nightEvent = [{ type: 'damage', amount: 7, objective: user.combatant }]
        break;

      case "Tactical Position":
        event = [{type: 'status' , turnsActive: 1 , objective: user , effect: 'dodge' }]
        nightEvent = [{type: 'status' , turnsActive: 1 , objective: user , effect: 'dodge' },
        {type: 'status' , turnsActive: 2, objective: user , effect: 'damage_dealt', 
        amount: 1.4}
      ]
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

  getGatheringDamage(user, battle) {

    let actionCost = 0;
    let currentMana = this.mana(user.ap,battle.turnCount)
    console.log(user)
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
        name: 'Swift Arrow',
        cooldown: 4,
        cost: 3,
        priority: 0,
        description: '30% chance of dealing double damage',
        image: '../../assets/abilityicons/gathering_strength.jpeg',
        npriority: 0,
        ncost: 3
      },
      {
        name: 'Swift Arrow',
        cooldown: 4,
        cost: 3,
        priority: 0,
        description: '30% chance of dealing double damage',
        image: '../../assets/abilityicons/gathering_strength.jpeg',
        npriority: 0,
        ncost: 3
      },
      {
        name: 'Incapacitate',
        cooldown: 3,
        cost: 4,
        priority: 0,
        description: 'Slows the target by 30%',
        image: '../../assets/abilityicons/knee_shot.jpeg',
        npriority: 0,
        ncost: 4
      },
      /*
      {
        name: 'Enchanted Arrow',
        cooldown: 3,
        cost: 1,
        priority: 0,
        description: 'Deals double the amount of mana not spent this turn',
        image: '../../assets/abilityicons/headshot.jpeg'
      },
      */
      {
        name: 'Focus',
        cooldown: 3,
        cost: 4,
        priority: 1,
        description: 'Increases your damage by 50%',
        image: '../../assets/abilityicons/focus.jpeg',
        npriority: 1,
        ncost: 3
      },
      {
        name: 'Tactical Position',
        cooldown: 4,
        cost: 3,
        priority: 1,
        description: 'Avoids this round attacks. At night, also deals 30% bonus damage for two turns and strikes first',
        image: '../../assets/abilityicons/tactical_position.jpeg',
        npriority: 1,
        ncost: 3
      },
      {
        name: 'Spotted Weakness',
        cooldown: 3,
        cost: 4,
        priority: 1,
        description: 'This attack ignores damage modifiers and always goes first',
        image: '../../assets/abilityicons/spotted_weakness.jpeg',
        npriority: 1,
        ncost: 4
      },
      {
        name: 'Precise Shot',
        cooldown: 3,
        cost: 4,
        priority: 0,
        description: 'Deals 7 damage',
        image: '../../assets/abilityicons/warning_shot.jpeg',
        npriority: 0,
        ncost: 4
      },
    ]

    return abilities
  }

}
