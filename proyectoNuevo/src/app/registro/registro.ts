import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  usuario = {
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  usuariosRegistrados: any[] = [];
  mensajeExito: string = '';

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.usuario.password === this.usuario.confirmPassword) {
        this.usuariosRegistrados.push({...this.usuario});
        this.mensajeExito = `¡Bienvenido, ${this.usuario.nombre}!`;
        form.resetForm();
        console.log('Usuarios registrados:', this.usuariosRegistrados);
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }
}
