import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CombatSceneComponent } from './combatScene/combatScene.component';
import { PickCharacterComponent } from './pickCharacter/pickCharacter.component';
import { RoomsComponent } from './rooms/rooms.component';


const routes: Routes = [
  { path: '', component: PickCharacterComponent },
  { path: 'battle', component: CombatSceneComponent },
  { path: 'rooms', component: RoomsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
