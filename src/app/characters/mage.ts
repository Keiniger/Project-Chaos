import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })

export class Mage {

  executeAbility(ability, user, battle) {
    let randomCritChance = 0;
    console.log(ability)

    let event = [];
    let nightEvent = [];

    switch (ability.name) {
      case 'Dark pulse':
        event = [{ type: 'damage', amount: 5 , objective: user.combatant }]
        nightEvent = [{ type: 'damage', amount: 10, objective: user.combatant }]
        break;

      case 'Will of the thorns':

        event = [{ type: 'damage', amount: 4, objective: user.combatant },
        { type: 'status', turnsActive: 1, objective: user.combatant, effect: 'stun', isSecondary: true }]

        nightEvent = [{ type: 'damage', amount: 4, objective: user.combatant },
        { type: 'status', turnsActive: 1, objective: user.combatant, effect: 'stun', isSecondary: true }]
        break;

      case 'Song Of The Crows':
        event = [{ type: 'damage', amount: Math.round((user.combatant.health / user.combatant.chealth) * 2), objective: user.combatant }]
        nightEvent = [{ type: 'damage', amount: Math.round((user.combatant.health / user.combatant.chealth) * 2), objective: user.combatant }]
        break;

      case 'The Void Has Spoken':
        event = [
          { type: 'damage', amount: 6, objective: user.combatant },
          { type: 'status', turnsActive: 2, objective: user.combatant, effect: 'bleed', amount: 2, isSecondary: true }]

        nightEvent = [
          { type: 'damage', amount: 7, objective: user.combatant },
          { type: 'status', turnsActive: 2, objective: user.combatant, effect: 'bleed', amount: 2, isSecondary: true }]

        break;

      case 'Whitered Rose':
        event = [{type: 'status', turnsActive: 2, objective: user.combatant, effect: 'damage_dealt', amount: 0.7 }]
        nightEvent = [{type: 'status', turnsActive: 2, objective: user.combatant, effect: 'damage_dealt', amount: 0.4 }]
        break;

      case 'Replenish':
        event = [
          { type: 'status', turnsActive: 1, objective: user, effect: 'mana', amount: 1 },
        ]
        nightEvent = [{ type: 'status', turnsActive: 1, objective: user, effect: 'mana', amount: 1 }]
        break;

      case 'Pray':
        event = [{ type: 'heal', amount: 10, objective: user , isSelf: true}]
        nightEvent = [{ type: 'heal', amount: 20, objective: user , isSelf: true}]

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

  getAbilities() {

    let abilities = [
      {
        name: 'Dark pulse',
        cooldown: 2,
        cost: 3,
        priority: 0,
        description: 'Deals 4 damage. Double damage at night',
        image: '../../assets/abilityicons/dark_pulse.jpeg',
        npriority: 0,
        ncost: 2
      },
      {
        name: 'Dark pulse',
        cooldown: 2,
        cost: 3,
        priority: 0,
        description: 'Deals 4 damage. Double damage at night',
        image: '../../assets/abilityicons/dark_pulse.jpeg',
        npriority: 0,
        ncost: 2
      },
      {
        name: 'Will of the thorns',
        cooldown: 3,
        cost: 5,
        priority: 1,
        description: 'Deals 4 damage and stuns the target for the remaining of the turn',
        image: '../../assets/abilityicons/stranglethorns2.jpeg',
        npriority: 1,
        ncost: 2
      },
      {
        name: 'Song Of The Crows',
        cooldown: 2,
        cost: 5,
        priority: 0,
        description: 'Deals more damage the lower the enemy current health is',
        image: '../../assets/abilityicons/song_crows.jpeg',
        npriority: 0,
        ncost: 5
      },
      {
        name: 'Whitered Rose',
        cooldown: 3,
        cost: 4,
        priority: 1,
        description: 'Reduces enemy damage by 30%. (60% at night)',
        image: '../../assets/abilityicons/stranglethorns.jpeg',
        npriority: 1,
        ncost: 3
      },
      {
        name: 'The Void Has Spoken',
        cooldown: 3,
        cost: 7,
        priority: 1,
        description: 'Deals 6 damage and makes the target bleed. Deals 7 damage at night',
        image: '../../assets/abilityicons/void_spoken.jpeg',
        npriority: 0,
        ncost: 4
      },
      {
        name: 'Replenish',
        cooldown: 4,
        cost: 6,
        priority: 0,
        description: 'Gives 1 mana point',
        image: '../../assets/abilityicons/replenish.jpeg',
        npriority: 0,
        ncost: 6
      },
      {
        name: 'Pray',
        cooldown: 4,
        cost: 5,
        priority: 1,
        description: 'Always goes first. Restore 10 HP. Restores double the amount at night',
        image: '../../assets/abilityicons/pray.jpeg',
        npriority: 1,
        ncost: 3
      },
    ]

    return abilities
  }

}
