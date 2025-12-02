import { Component } from '@angular/core';
import {Games} from '../games/games';
import {CommonModule} from '@angular/common';
import {Comments} from '../comments/comments';

@Component({
  selector: 'app-user',
  imports: [
    Games, CommonModule, Comments
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})

export class User {
  username = 'alejandro';
  is_logged = false;
  protected readonly alert = alert;

  favGame = '';

  getFavorite(gameName : string){
    console.log("Guardando el valor del nombre del juego")
    this.favGame = gameName;
  }


  greet(){
    alert("Esto es una alerta ")
  }

}

