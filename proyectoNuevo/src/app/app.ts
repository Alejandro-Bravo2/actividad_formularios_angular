import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Registro } from "./registro/registro";
import { User } from "./user/user";
import {Games} from './games/games';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, User, CommonModule, Registro, Games],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App {
  protected readonly title = signal('proyectoNuevo');
  titulo = "Alejandro";
}

