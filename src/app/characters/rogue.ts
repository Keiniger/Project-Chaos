import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })

export class Rogue {

  executeAbility(ability, user, battle) {

    
    let event = [];
    let nightEvent = [];

    switch (ability.name) {
      case 'Dagger Throw':
        event = [{type: 'damage' , amount: 3 , objective: user.combatant }]
        nightEvent = [{type: 'damage' , amount: 5 , objective: user.combatant }]
        break;

      case 'Evasive movement':
        event = [{type: 'status' , turnsActive: 1 , objective: user , effect: 'dodge' }]
        nightEvent = [{type: 'status' , turnsActive: 1 , objective: user , effect: 'dodge' }]
        break;

      case 'Laceration':
        event = [{type: 'damage' , amount: 7 , objective: user.combatant},{type: 'status' , turnsActive: 3 , objective: user.combatant , effect: 'bleed', isSecondary: true, amount: 2 }]
        nightEvent = [{type: 'damage' , amount: 8 , objective: user.combatant},{type: 'status' , turnsActive: 3 , objective: user.combatant , effect: 'bleed', isSecondary: true, amount: 2 }]
        break;

      case 'Decisive impact':
        event = [{type: 'damage' , amount:  Math.round((user.health/user.chealth) * 2) , objective: user.combatant}]
        nightEvent = [{type: 'damage' , amount:  Math.round((user.health/user.chealth) * 2) , objective: user.combatant}]

        break;

      case 'Fast dash':
        event = [{type: 'damage' , amount:  6, objective: user.combatant}]
        nightEvent = [{type: 'damage' , amount:  8, objective: user.combatant}]

        break;

      case 'Backstab':
        event = [{type: 'damage' , amount:  8, objective: user.combatant}]
        nightEvent = [{type: 'damage' , amount:  10, objective: user.combatant}]
        break;

      case 'Scent of blood':
        event = [{type: 'status' , turnsActive: 2, objective: user , effect: 'damage_dealt', amount: 1.6}]
        nightEvent = [{type: 'status' , turnsActive: 2, objective: user , effect: 'damage_dealt', amount: 1.8}]
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

  getAbilities(){

    let abilities = [
      {
        name: 'Dagger Throw',
        cooldown: 2,
        cost: 1,
        ncost: 1,
        priority: 0,
        npriority: 0,
        description: 'Throws a dagger that deals 3 damage. Deals 5 damage at night',
        image: '../../assets/abilityicons/flurry_daggers.jpeg',
        type: 'ranged'
      },
      {
        name: 'Dagger Throw',
        cooldown: 2,
        cost: 1,
        ncost: 1,
        priority: 0,
        npriority: 0,
        description: 'Throws a dagger that deals 3 damage. Deals 5 damage at night',
        image: '../../assets/abilityicons/flurry_daggers.jpeg',
        type: 'ranged'
      },
      {
        name: 'Evasive movement',
        cooldown: 3,
        cost: 5,
        ncost: 3,
        priority: 1,
        npriority: 1,
        description: 'Rogue blends in with the shadows to avoid the next turn of attacks',
        image: '../../assets/abilityicons/evasive_movement.jpeg'
      },
      {
        name: 'Fast dash',
        cooldown: 3,
        cost: 4,
        ncost: 3,
        priority: 1,
        npriority: 1,
        description: 'Always goes first. Deals 5 damage. Deals 8 at night',
        image: '../../assets/abilityicons/fast_dash.jpeg',
        type: 'physical'
      },
      {
        name: 'Decisive impact',
        cooldown: 4,
        cost: 4,
        ncost: 4,
        priority: 0,
        npriority: 0,
        description: 'Deals more damage when low on health.',
        image: '../../assets/abilityicons/decisive_impact.jpeg',
        type: 'physical'
      },
      {
        name: 'Laceration',
        cooldown: 3,
        cost: 3,
        ncost: 2,
        priority: 0,
        npriority: 1,
        description: 'Deals 7 damage and makes the enemy bleed for 2 damage for 3 turns. Deals 8 damage and always strikes first at night',
        image: '../../assets/abilityicons/laceration.jpeg',
        type: 'physical'
      },
      {
        name: 'Backstab',
        cooldown: 2,
        cost: 2,
        ncost: 2,
        priority: 0,
        npriority: 0,
        description: 'Deals 8 damage. Deals 10 damage at night',
        image: '../../assets/abilityicons/backstab.jpeg',
        type: 'physical'
      },
      {
        name: 'Scent of blood',
        cooldown: 4,
        cost: 5,
        ncost: 3,
        priority: 1,
        npriority: 1,
        description: 'Get a 60% damage amplify. Goes up to 80% at night',
        image: '../../assets/abilityicons/scent_blood.jpeg',
        type: 'physical'
      },

    ]

    return abilities
  }


}
