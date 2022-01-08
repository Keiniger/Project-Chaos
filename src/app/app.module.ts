import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CombatSceneComponent } from './combatScene/combatScene.component';
import { FormsModule } from '@angular/forms';
import { BattleSystem } from './battleSystem.service';
import { PickCharacterComponent } from './pickCharacter/pickCharacter.component';
import { Characters } from './characters';
import { UserService } from './user.service';
import {DragDropModule} from '@angular/cdk/drag-drop'; 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage/';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { RoomsComponent } from './rooms/rooms.component';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShopDialog } from './combatScene/shopDialog/shopDialog.component';
import {MatDialogModule} from '@angular/material/dialog'; 
import { RoomDialog } from './pickCharacter/roomDialog/roomDialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox'; 

@NgModule({
  declarations: [
    AppComponent,
    CombatSceneComponent,
    PickCharacterComponent,
    RoomsComponent,
    ShopDialog,
    RoomDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatCheckboxModule

  ],
  providers: [BattleSystem,Characters,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
