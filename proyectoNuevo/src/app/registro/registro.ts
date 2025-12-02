import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  usuariosRegistrados: any[] = [];
  mensajeExito: string = '';
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      const formValues = this.registroForm.value;

      if (formValues.password === formValues.confirmPassword) {
        this.usuariosRegistrados.push({...formValues});
        this.mensajeExito = `¡Bienvenido, ${formValues.nombre}!`;
        this.registroForm.reset();
        console.log('Usuarios registrados:', this.usuariosRegistrados);
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }
}
