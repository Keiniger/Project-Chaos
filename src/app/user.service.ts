import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Characters } from "./characters";

@Injectable({ providedIn: 'root' })
export class UserService { 

  constructor(public characters: Characters){}
  private messageSource = new BehaviorSubject<Object>({});
  store = this.messageSource.asObservable();

  characterSelected;
  nameSelected;

  storeCharacter(character){
    this.characterSelected = character;
  }

  storeName(name){
    this.nameSelected = name;
  }

  getCharacter(){
    return this.characterSelected
  }

  getCharacterById(id){
    let char = this.characters.getCharacterList().find(elem => elem.id == id)
    return char;
  }

}
