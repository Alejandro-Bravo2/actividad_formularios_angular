import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface DatosPerfilUsuario {
  informacionPersonal: {
    nombre: string;
    apellido: string;
    telefono: string;
    fechaNacimiento: string;
  };
  direcciones: Array<{
    tipo: string;
    calle: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
  }>;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css'
})
export class PerfilUsuario implements OnInit {
  perfilForm!: FormGroup;
  tiposDireccion = ['Residencial', 'Laboral', 'Otra'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.perfilForm = this.fb.group({
      informacionPersonal: this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        telefono: ['', [Validators.required, Validators.pattern(/^\d{9,}$/)]],
        fechaNacimiento: ['', Validators.required]
      }),
      direcciones: this.fb.array([])
    });

    this.agregarDireccion();
  }

  get informacionPersonal() {
    return this.perfilForm.get('informacionPersonal') as FormGroup;
  }

  get direcciones() {
    return this.perfilForm.get('direcciones') as FormArray;
  }

  crearFormDireccion(): FormGroup {
    return this.fb.group({
      tipo: ['Residencial', Validators.required],
      calle: ['', [Validators.required, Validators.minLength(5)]],
      ciudad: ['', [Validators.required, Validators.minLength(2)]],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      pais: ['España', Validators.required]
    });
  }

  agregarDireccion() {
    this.direcciones.push(this.crearFormDireccion());
  }

  eliminarDireccion(index: number) {
    if (this.direcciones.length > 1) {
      this.direcciones.removeAt(index);
    } else {
      alert('Debe mantener al menos una dirección');
    }
  }

  calcularEdad(): number {
    const fechaNacimiento = this.informacionPersonal.get('fechaNacimiento')?.value;
    if (!fechaNacimiento) return 0;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      const perfil: DatosPerfilUsuario = this.perfilForm.value;
      console.log('Perfil guardado:', perfil);
      alert(`¡Perfil de ${perfil.informacionPersonal.nombre} actualizado exitosamente!`);
    }
  }

  generarResumen(): string {
    if (!this.perfilForm.valid) return '';

    const info = this.informacionPersonal.value;
    const edad = this.calcularEdad();
    const numDirecciones = this.direcciones.length;

    return `${info.nombre} ${info.apellido}, ${edad} años, ${numDirecciones} dirección(es) registrada(s)`;
  }
}
