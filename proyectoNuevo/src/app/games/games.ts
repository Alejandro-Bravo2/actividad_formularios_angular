import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-games',
  imports: [
    CommonModule
  ],
  templateUrl: './games.html',
  styleUrl: './games.css',
})

export class Games {
  games = [
    {
      id: 1,
      name: "GTA 5"
    },
    {
      id: 2,
      name: "The witcher"
    },
    {
      id: 3,
      name: "Elden ring"
    }]


  @Input() username = "AlejajandroUsuario";

  @Output() addFavoriteEvent = new EventEmitter<string>();

  fav(gameName: string) {
    console.log("Juego clickeado:", gameName)
    console.log("PASO 1: La función fav() se ejecutó")
    console.log("PASO 2: El juego es:" + gameName)

    this.addFavoriteEvent.emit(gameName);
    console.log("Ya hice el emit()")
  }

}
