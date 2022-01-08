import { Mage } from "./characters/mage";
import { Ranger } from "./characters/ranger";
import { Rogue } from "./characters/rogue";
import { Warrior } from "./characters/warrior";
import { Injectable } from "@angular/core";

const characterList = [{
    id: 1,
    name: 'Rogue',
    health: 75,
    speed: 10,
    damage: 5,
    picture: '../assets/rogue.jpeg',
    ap: 5,
    class: Rogue,
    winPhrase: "I wonder how much money I'll get for your head",
  },
  {
    id: 2,
    name: 'Warrior',
    health: 90,
    speed: 7,
    damage: 3,
    picture: '../assets/warrior.jpeg',
    ap: 5,
    class: Warrior,
    winPhrase: "The gods have made their choice. I'm the winner."

  },
  {
    id: 3,
    name: 'Mage',
    health: 80,
    speed: 4,
    damage: 4,
    picture: '../assets/mage.jpeg',
    ap: 7,
    class: Mage,
    winPhrase: "I hear thee, my sovereigns. Our time has come."

  },
  {
    id: 4,
    name: 'Ranger',
    health: 80,
    speed: 5,
    damage: 4,
    picture: '../assets/ranger.jpeg',
    ap: 6,
    class: Ranger,
    winPhrase: "You fought well. Let's do it again anytime soon"

  },
  /*
  {
    id: 5,
    name: 'Sora',
    health: 35,
    speed: 1,
    damage: 4,
    picture: '../assets/sora.jpeg',
    ap: 7,
    class: Rogue,
  },
  {
    id: 5,
    name: 'Swordsman',
    health: 45,
    speed: 5,
    damage: 4,
    picture: '../assets/sorcerer.jpeg',
    ap: 9,
    class: Rogue,
  }*/]

@Injectable()
export class Characters{

  getCharacterList(){
    return characterList;
  }

}
