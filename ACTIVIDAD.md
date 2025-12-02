# Actividades Prácticas: Formularios en Angular 20

## Actividad 1: Formulario Template-Driven - Registro de Usuario Básico

### Descripción
Crear un formulario dirigido por plantilla para el registro de un nuevo usuario. Este es el primer contacto con formularios en Angular y te permitirá entender cómo las directivas de Angular vinculan datos bidireccionales.

### Objetivos de Aprendizaje
- Usar la directiva `ngModel` para vinculación bidireccional de datos
- Implementar validación básica con directivas HTML
- Mostrar mensajes de error usando validadores integrados
- Capturar y procesar datos del formulario
- Utilizar signals para gestión de estado reactivo

### Práctica 1: Formulario de Registro

**Archivo: registro.component.ts**

```typescript
import { Component, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario = {
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  usuariosRegistrados = signal<any[]>([]);
  mensajeExito = signal<string>('');

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.usuario.password === this.usuario.confirmPassword) {
        this.usuariosRegistrados.update(usuarios => [...usuarios, {...this.usuario}]);
        this.mensajeExito.set(`¡Bienvenido, ${this.usuario.nombre}!`);
        form.resetForm();
        console.log('Usuarios registrados:', this.usuariosRegistrados());
      } else {
        alert('Las contraseñas no coinciden');
      }
    }
  }
}
```

**Archivo: registro.component.html**

```html
<div class="registro-container">
  <h2>Formulario de Registro</h2>
  <form #registroForm="ngForm" (ngSubmit)="onSubmit(registroForm)">
    <div class="form-group">
      <label for="nombre">Nombre Completo:</label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        [(ngModel)]="usuario.nombre"
        required
        minlength="3"
        #nombre="ngModel"
        class="form-control"
      />
      @if (nombre.invalid && nombre.touched) {
        <div class="error-message">
          @if (nombre.errors?.['required']) {
            <small>El nombre es requerido</small>
          }
          @if (nombre.errors?.['minlength']) {
            <small>Mínimo 3 caracteres</small>
          }
        </div>
      }
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        [(ngModel)]="usuario.email"
        required
        email
        #email="ngModel"
        class="form-control"
      />
      @if (email.invalid && email.touched) {
        <div class="error-message">
          @if (email.errors?.['required']) {
            <small>El email es requerido</small>
          }
          @if (email.errors?.['email']) {
            <small>Formato de email inválido</small>
          }
        </div>
      }
    </div>

    <div class="form-group">
      <label for="password">Contraseña:</label>
      <input
        type="password"
        id="password"
        name="password"
        [(ngModel)]="usuario.password"
        required
        minlength="6"
        #password="ngModel"
        class="form-control"
      />
      @if (password.invalid && password.touched) {
        <div class="error-message">
          @if (password.errors?.['required']) {
            <small>La contraseña es requerida</small>
          }
          @if (password.errors?.['minlength']) {
            <small>Mínimo 6 caracteres</small>
          }
        </div>
      }
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirmar Contraseña:</label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        [(ngModel)]="usuario.confirmPassword"
        required
        class="form-control"
      />
    </div>

    <button type="submit" [disabled]="registroForm.invalid">Registrarse</button>
  </form>

  @if (mensajeExito()) {
    <div class="mensaje-exito">{{ mensajeExito() }}</div>
  }

  <div class="usuarios-registrados">
    <h3>Usuarios Registrados</h3>
    @for (user of usuariosRegistrados(); track user.email) {
      <div class="usuario-item">{{ user.nombre }} - {{ user.email }}</div>
    }
  </div>
</div>
```

**Conceptos clave abordados:** Directivas `ngModel`, validadores HTML integrados, referencias de template, ciclo de vida del formulario, binding bidireccional, **signals** para estado reactivo, **sintaxis de control flow moderna** (`@if`, `@for`).

---

## Actividad 2: Formulario Reactivo - Gestión de Productos

### Descripción
Crear un formulario reactivo para gestionar un catálogo de productos. Este enfoque te introduce a FormBuilder, FormGroup y FormControl programáticos, proporcionando mayor control y testabilidad.

### Objetivos de Aprendizaje
- Utilizar FormBuilder para simplificar la creación de formularios
- Implementar validadores síncronos integrados
- Acceder a controles de formulario mediante referencias programáticas
- Gestionar estado del formulario y valores
- Usar signals para gestión de estado de productos

### Práctica 2: Gestor de Productos

**Archivo: productos.component.ts**

```typescript
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  categoria: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productosForm!: FormGroup;
  productos = signal<Producto[]>([]);
  proximoId = signal<number>(1);

  totalInventario = computed(() =>
    this.productos().reduce((total, p) => total + (p.precio * p.cantidad), 0)
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.productosForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      cantidad: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      categoria: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.productosForm.valid) {
      const nuevoProducto: Producto = {
        id: this.proximoId(),
        ...this.productosForm.value
      };

      this.productos.update(productos => [...productos, nuevoProducto]);
      this.proximoId.update(id => id + 1);
      console.log('Productos:', this.productos());
      this.productosForm.reset();
    } else {
      console.log('Formulario inválido');
    }
  }

  obtenerProducto(id: number) {
    return this.productos().find(p => p.id === id);
  }

  eliminarProducto(id: number) {
    this.productos.update(productos => productos.filter(p => p.id !== id));
  }
}
```

**Archivo: productos.component.html**

```html
<div class="productos-container">
  <h2>Gestor de Productos</h2>

  <form [formGroup]="productosForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="nombre">Nombre del Producto:</label>
      <input
        type="text"
        id="nombre"
        formControlName="nombre"
        class="form-control"
      />
      @if (productosForm.get('nombre')?.invalid && productosForm.get('nombre')?.touched) {
        <div class="error-message">
          @if (productosForm.get('nombre')?.errors?.['required']) {
            <small>Requerido</small>
          }
          @if (productosForm.get('nombre')?.errors?.['minlength']) {
            <small>Mínimo 3 caracteres</small>
          }
        </div>
      }
    </div>

    <div class="form-group">
      <label for="descripcion">Descripción:</label>
      <textarea
        id="descripcion"
        formControlName="descripcion"
        class="form-control"
        rows="3"
      ></textarea>
      @if (productosForm.get('descripcion')?.invalid && productosForm.get('descripcion')?.touched) {
        <div class="error-message">
          @if (productosForm.get('descripcion')?.errors?.['required']) {
            <small>Requerido</small>
          }
          @if (productosForm.get('descripcion')?.errors?.['maxlength']) {
            <small>Máximo 200 caracteres</small>
          }
        </div>
      }
    </div>

    <div class="form-group">
      <label for="precio">Precio (¬):</label>
      <input
        type="number"
        id="precio"
        formControlName="precio"
        class="form-control"
        step="0.01"
      />
      @if (productosForm.get('precio')?.invalid && productosForm.get('precio')?.touched) {
        <div class="error-message">
          @if (productosForm.get('precio')?.errors?.['required']) {
            <small>Requerido</small>
          }
          @if (productosForm.get('precio')?.errors?.['min']) {
            <small>Debe ser mayor a 0</small>
          }
        </div>
      }
    </div>

    <div class="form-group">
      <label for="cantidad">Cantidad:</label>
      <input
        type="number"
        id="cantidad"
        formControlName="cantidad"
        class="form-control"
      />
      @if (productosForm.get('cantidad')?.invalid && productosForm.get('cantidad')?.touched) {
        <div class="error-message">
          @if (productosForm.get('cantidad')?.errors?.['required']) {
            <small>Requerido</small>
          }
          @if (productosForm.get('cantidad')?.errors?.['min']) {
            <small>Mínimo 1</small>
          }
        </div>
      }
    </div>

    <div class="form-group">
      <label for="categoria">Categoría:</label>
      <select id="categoria" formControlName="categoria" class="form-control">
        <option value="">Seleccionar...</option>
        <option value="Electrónica">Electrónica</option>
        <option value="Ropa">Ropa</option>
        <option value="Alimentos">Alimentos</option>
        <option value="Otros">Otros</option>
      </select>
      @if (productosForm.get('categoria')?.invalid && productosForm.get('categoria')?.touched) {
        <div class="error-message">
          <small>Requerido</small>
        </div>
      }
    </div>

    <button type="submit" [disabled]="productosForm.invalid">Agregar Producto</button>
  </form>

  <div class="productos-lista">
    <h3>Productos Ingresados</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (producto of productos(); track producto.id) {
          <tr>
            <td>{{ producto.id }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.descripcion }}</td>
            <td>{{ producto.precio | currency:'EUR':'symbol':'1.2-2' }}</td>
            <td>{{ producto.cantidad }}</td>
            <td>
              <button (click)="eliminarProducto(producto.id)">Eliminar</button>
            </td>
          </tr>
        }
      </tbody>
    </table>

    <div class="total-inventario">
      <strong>Total del Inventario:</strong> {{ totalInventario() | currency:'EUR':'symbol':'1.2-2' }}
    </div>
  </div>
</div>
```

**Conceptos clave abordados:** FormBuilder, FormGroup, FormControl, validadores síncronos, acceso programático a controles, gestión de estado del formulario, **signals y computed** para estado reactivo, **sintaxis de control flow moderna**.

---

## Actividad 3: Validadores Personalizados y FormArray

### Descripción
Crear un formulario dinámico que agregue múltiples líneas de detalles de compra utilizando FormArray. Implementarás validadores personalizados para reglas de negocio específicas.

### Objetivos de Aprendizaje
- Crear validadores personalizados síncronos y asíncronos
- Utilizar FormArray para gestionar colecciones dinámicas de controles
- Agregar y eliminar campos dinámicamente
- Validar relaciones entre múltiples campos
- Usar signals y computed para cálculos reactivos

### Práctica 3: Formulario de Factura con Detalles Dinámicos

**Archivo: factura.component.ts**

```typescript
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  facturaForm!: FormGroup;
  impuesto = signal<number>(0.21); // IVA 21%

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.facturaForm = this.fb.group({
      numeroFactura: ['', [Validators.required, this.validarNumeroFactura.bind(this)]],
      cliente: ['', [Validators.required, Validators.minLength(3)]],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      detalles: this.fb.array([])
    });
  }

  validarNumeroFactura(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    if (!valor) return null;

    // Validar formato: FAC-XXXXXX
    const regex = /^FAC-\d{6}$/;
    return regex.test(valor) ? null : { formatoFactura: true };
  }

  get detalles() {
    return this.facturaForm.get('detalles') as FormArray;
  }

  agregarDetalle() {
    const detalleForm = this.fb.group({
      producto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: ['', [Validators.required, Validators.min(0.01)]],
      descuento: [0, [Validators.min(0), Validators.max(100)]]
    });

    this.detalles.push(detalleForm);
  }

  eliminarDetalle(index: number) {
    this.detalles.removeAt(index);
  }

  calcularSubtotal(): number {
    return this.detalles.controls.reduce((total, detalle) => {
      const cantidad = detalle.get('cantidad')?.value || 0;
      const precio = detalle.get('precioUnitario')?.value || 0;
      const descuento = detalle.get('descuento')?.value || 0;
      const descuentoAplicado = (precio * cantidad * descuento) / 100;
      return total + (precio * cantidad - descuentoAplicado);
    }, 0);
  }

  calcularIVA(): number {
    return this.calcularSubtotal() * this.impuesto();
  }

  calcularTotal(): number {
    return this.calcularSubtotal() + this.calcularIVA();
  }

  onSubmit() {
    if (this.facturaForm.valid && this.detalles.length > 0) {
      const factura = {
        ...this.facturaForm.value,
        subtotal: this.calcularSubtotal(),
        iva: this.calcularIVA(),
        total: this.calcularTotal()
      };
      console.log('Factura:', factura);
      alert('Factura guardada correctamente');
    } else {
      alert('Completa todos los campos requeridos y agrega al menos un detalle');
    }
  }
}
```

**Archivo: factura.component.html**

```html
<div class="factura-container">
  <h2>Generador de Facturas</h2>

  <form [formGroup]="facturaForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="numeroFactura">Número de Factura:</label>
      <input
        type="text"
        id="numeroFactura"
        formControlName="numeroFactura"
        class="form-control"
        placeholder="FAC-000001"
      />
      @if (facturaForm.get('numeroFactura')?.invalid && facturaForm.get('numeroFactura')?.touched) {
        <div class="error-message">
          <small>Formato: FAC-XXXXXX (6 dígitos)</small>
        </div>
      }
    </div>

    <div class="form-group">
      <label for="fecha">Fecha:</label>
      <input
        type="date"
        id="fecha"
        formControlName="fecha"
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="cliente">Cliente:</label>
      <input
        type="text"
        id="cliente"
        formControlName="cliente"
        class="form-control"
      />
      @if (facturaForm.get('cliente')?.invalid && facturaForm.get('cliente')?.touched) {
        <div class="error-message">
          <small>Requerido</small>
        </div>
      }
    </div>

    <div class="detalles-section">
      <h3>Detalles de Factura</h3>

      @for (detalle of detalles.controls; track $index) {
        <div [formGroup]="$any(detalle)" class="detalle-item">
          <div class="form-group">
            <label>Producto:</label>
            <input type="text" formControlName="producto" class="form-control" />
          </div>

          <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" formControlName="cantidad" class="form-control" />
          </div>

          <div class="form-group">
            <label>Precio Unitario (¬):</label>
            <input type="number" formControlName="precioUnitario" class="form-control" step="0.01" />
          </div>

          <div class="form-group">
            <label>Descuento (%):</label>
            <input type="number" formControlName="descuento" class="form-control" />
          </div>

          <button type="button" (click)="eliminarDetalle($index)" class="btn-eliminar">Eliminar</button>
        </div>
      }

      <button type="button" (click)="agregarDetalle()" class="btn-agregar">+ Agregar Detalle</button>
    </div>

    <div class="resumen-factura">
      <div class="resumen-linea">
        <span>Subtotal:</span>
        <span>{{ calcularSubtotal() | currency:'EUR':'symbol':'1.2-2' }}</span>
      </div>
      <div class="resumen-linea">
        <span>IVA (21%):</span>
        <span>{{ calcularIVA() | currency:'EUR':'symbol':'1.2-2' }}</span>
      </div>
      <div class="resumen-linea total">
        <span><strong>Total:</strong></span>
        <span><strong>{{ calcularTotal() | currency:'EUR':'symbol':'1.2-2' }}</strong></span>
      </div>
    </div>

    <button type="submit" [disabled]="facturaForm.invalid || detalles.length === 0">
      Guardar Factura
    </button>
  </form>
</div>
```

**Conceptos clave abordados:** Validadores personalizados, FormArray, validación dinámica, operaciones de cálculo, gestión de colecciones de controles, **signals para valores reactivos**, **sintaxis de control flow moderna** con `@for`.

---

## Actividad 4: Validación Asincrónica y Integración con API

### Descripción
Desarrollar un formulario que valide datos de forma asincrónica mediante llamadas simuladas a un servicio backend. Aprenderás patrones de validación moderna y gestión de observables.

### Objetivos de Aprendizaje
- Implementar validadores asíncronos con observables
- Simular llamadas a servicios HTTP
- Mostrar estados de carga durante validación
- Manejar errores de validación asincrónica

### Práctica 4: Validador Asincrónico de Email Único

**Archivo: validators.service.ts**

```typescript
import { Injectable, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  // Simular base de datos de emails registrados
  emailsRegistrados = signal<string[]>(['admin@example.com', 'usuario@example.com', 'test@example.com']);

  validarEmailUnico(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Simular llamada a API con delay de 1 segundo
      return of(this.emailsRegistrados().includes(control.value)).pipe(
        delay(1000),
        map(existe => existe ? { emailExiste: true } : null)
      );
    };
  }

  validarUsernameDisponible(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Simular validación: usernames que comienzan con 'admin' están reservados
      return of(control.value.toLowerCase().startsWith('admin')).pipe(
        delay(800),
        map(reservado => reservado ? { usernameReservado: true } : null)
      );
    };
  }
}
```

**Archivo: registro-avanzado.component.ts**

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidatorsService } from './validators.service';

@Component({
  selector: 'app-registro-avanzado',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro-avanzado.component.html',
  styleUrls: ['./registro-avanzado.component.css']
})
export class RegistroAvanzadoComponent implements OnInit {
  registroForm!: FormGroup;
  enviando = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.registroForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(3)],
        [this.validatorsService.validarUsernameDisponible()]
      ],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.validatorsService.validarEmailUnico()]
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terminos: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.enviando.set(true);

      // Simular envío a servidor
      setTimeout(() => {
        console.log('Registro completado:', this.registroForm.value);
        this.enviando.set(false);
        alert('¡Registro completado exitosamente!');
      }, 2000);
    }
  }

  validarCampo(nombreCampo: string): boolean {
    const control = this.registroForm.get(nombreCampo);
    return control?.invalid && control?.touched || false;
  }

  mostrarCargando(nombreCampo: string): boolean {
    const control = this.registroForm.get(nombreCampo);
    return control?.pending || false;
  }
}
```

**Archivo: registro-avanzado.component.html**

```html
<div class="registro-avanzado-container">
  <h2>Registro Avanzado con Validación Asincrónica</h2>

  <form [formGroup]="registroForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="username">Username:</label>
      <input
        type="text"
        id="username"
        formControlName="username"
        class="form-control"
      />
      @if (mostrarCargando('username')) {
        <div class="loading-message">
          <small>Verificando...</small>
        </div>
      }
      @if (validarCampo('username')) {
        <div class="error-message">
          @if (registroForm.get('username')?.errors?.['required']) {
            <small>Requerido</small>
          }
          @if (registroForm.get('username')?.errors?.['minlength']) {
            <small>Mínimo 3 caracteres</small>
          }
          @if (registroForm.get('username')?.errors?.['usernameReservado']) {
            <small>Username no disponible (reservado)</small>
          }
        </div>
      }
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        formControlName="email"
        class="form-control"
      />
      @if (mostrarCargando('email')) {
        <div class="loading-message">
          <small>Verificando disponibilidad...</small>
        </div>
      }
      @if (validarCampo('email')) {
        <div class="error-message">
          @if (registroForm.get('email')?.errors?.['required']) {
            <small>Requerido</small>
          }
          @if (registroForm.get('email')?.errors?.['email']) {
            <small>Email inválido</small>
          }
          @if (registroForm.get('email')?.errors?.['emailExiste']) {
            <small>Este email ya está registrado</small>
          }
        </div>
      }
      @if (registroForm.get('email')?.pending) {
        <div class="info-message">
          <small>Validando disponibilidad del email...</small>
        </div>
      }
    </div>

    <div class="form-group">
      <label for="password">Contraseña:</label>
      <input
        type="password"
        id="password"
        formControlName="password"
        class="form-control"
      />
      @if (validarCampo('password')) {
        <div class="error-message">
          @if (registroForm.get('password')?.errors?.['required']) {
            <small>Requerida</small>
          }
          @if (registroForm.get('password')?.errors?.['minlength']) {
            <small>Mínimo 8 caracteres</small>
          }
        </div>
      }
    </div>

    <div class="form-group checkbox">
      <label>
        <input type="checkbox" formControlName="terminos" />
        Acepto los términos y condiciones
      </label>
      @if (registroForm.get('terminos')?.invalid && registroForm.get('terminos')?.touched) {
        <div class="error-message">
          <small>Debes aceptar los términos</small>
        </div>
      }
    </div>

    <button type="submit" [disabled]="registroForm.invalid || enviando()">
      {{ enviando() ? 'Registrando...' : 'Crear Cuenta' }}
    </button>

    @if (registroForm.pending) {
      <div class="validating-message">
        <small>Validando información...</small>
      </div>
    }
  </form>
</div>
```

**Conceptos clave abordados:** Validadores asíncronos, AsyncValidatorFn, simulación de observables, manejo de estados de carga, Observable y operadores RxJS, **signals para estado de UI**, **sintaxis de control flow moderna**.

---

## Actividad 5: FormGroup Anidados y Patrón Dinámico Complejo

### Descripción
Desarrollar un formulario complejo con FormGroup anidados para modelar estructuras jerárquicas de datos, como un formulario de perfil de usuario con múltiples direcciones.

### Objetivos de Aprendizaje
- Crear y manipular FormGroup anidados
- Implementar validación a nivel de grupo
- Gestionar complejidad en formularios de múltiples niveles
- Aplicar patrones avanzados de reactividad
- Usar signals y computed para valores derivados

### Práctica 5: Perfil de Usuario Completo con Direcciones Múltiples

**Archivo: perfil-usuario.component.ts**

```typescript
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface PerfilUsuario {
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
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  perfilForm!: FormGroup;
  tiposDireccion = signal<string[]>(['Residencial', 'Laboral', 'Otra']);

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

    // Agregar una dirección por defecto
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
      const perfil: PerfilUsuario = this.perfilForm.value;
      alert(`¡Perfil de ${perfil.informacionPersonal.nombre} actualizado exitosamente!`);
      console.log('Perfil guardado:', perfil);
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
```

**Archivo: perfil-usuario.component.html**

```html
<div class="perfil-usuario-container">
  <h2>Perfil de Usuario Completo</h2>

  <form [formGroup]="perfilForm" (ngSubmit)="onSubmit()">
    <div formGroupName="informacionPersonal" class="seccion-personal">
      <h3>Información Personal</h3>

      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          formControlName="nombre"
          class="form-control"
        />
        @if (informacionPersonal.get('nombre')?.invalid && informacionPersonal.get('nombre')?.touched) {
          <div class="error-message">
            <small>Nombre requerido (mínimo 2 caracteres)</small>
          </div>
        }
      </div>

      <div class="form-group">
        <label for="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          formControlName="apellido"
          class="form-control"
        />
        @if (informacionPersonal.get('apellido')?.invalid && informacionPersonal.get('apellido')?.touched) {
          <div class="error-message">
            <small>Apellido requerido (mínimo 2 caracteres)</small>
          </div>
        }
      </div>

      <div class="form-group">
        <label for="fechaNacimiento">Fecha de Nacimiento:</label>
        <input
          type="date"
          id="fechaNacimiento"
          formControlName="fechaNacimiento"
          class="form-control"
        />
        @if (calcularEdad() > 0) {
          <div class="info-message">
            <small>Edad: {{ calcularEdad() }} años</small>
          </div>
        }
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono:</label>
        <input
          type="tel"
          id="telefono"
          formControlName="telefono"
          class="form-control"
        />
        @if (informacionPersonal.get('telefono')?.invalid && informacionPersonal.get('telefono')?.touched) {
          <div class="error-message">
            <small>Teléfono inválido (mínimo 9 dígitos)</small>
          </div>
        }
      </div>
    </div>

    <div class="seccion-direcciones">
      <h3>Direcciones ({{ direcciones.length }})</h3>

      @for (direccion of direcciones.controls; track $index) {
        <div [formGroup]="$any(direccion)" class="direccion-item">
          <h4>Dirección {{ $index + 1 }}</h4>

          <div class="form-group">
            <label>Tipo:</label>
            <select formControlName="tipo" class="form-control">
              @for (tipo of tiposDireccion(); track tipo) {
                <option [value]="tipo">{{ tipo }}</option>
              }
            </select>
          </div>

          <button type="button" (click)="eliminarDireccion($index)" class="btn-eliminar">
            Eliminar Dirección
          </button>

          <div class="form-group">
            <label>Calle:</label>
            <input type="text" formControlName="calle" class="form-control" />
            @if ($any(direccion).get('calle')?.invalid && $any(direccion).get('calle')?.touched) {
              <div class="error-message">
                <small>Mínimo 5 caracteres</small>
              </div>
            }
          </div>

          <div class="form-group">
            <label>Ciudad:</label>
            <input type="text" formControlName="ciudad" class="form-control" />
          </div>

          <div class="form-group">
            <label>Código Postal:</label>
            <input type="text" formControlName="codigoPostal" class="form-control" />
            @if ($any(direccion).get('codigoPostal')?.invalid && $any(direccion).get('codigoPostal')?.touched) {
              <div class="error-message">
                <small>Formato: 5 dígitos</small>
              </div>
            }
          </div>

          <div class="form-group">
            <label>País:</label>
            <input type="text" formControlName="pais" class="form-control" />
          </div>
        </div>
      }

      <button type="button" (click)="agregarDireccion()" class="btn-agregar">
        + Agregar Otra Dirección
      </button>
    </div>

    @if (perfilForm.valid) {
      <div class="resumen-perfil">
        <h3>Resumen del Perfil</h3>
        <p>{{ generarResumen() }}</p>
      </div>
    }

    <button type="submit" [disabled]="perfilForm.invalid">Guardar Perfil</button>
  </form>
</div>
```

**Conceptos clave abordados:** FormGroup anidados, FormArray avanzado, validación a nivel de grupo, patrones complejos de reactividad, gestión jerárquica de datos, **signals para arrays reactivos**, **computed values**, **sintaxis de control flow moderna** con `@for` y `@if`.

---

## Resumen de Competencias Adquiridas

- Dominio de Template-Driven Forms y Reactive Forms
- Implementación de validadores síncronos y asíncronos
- Gestión de colecciones dinámicas con FormArray
- Diseño de FormGroups anidados para estructuras complejas
- Integración de patrones de validación de negocio
- Manejo de estados de formulario y reactividad
- Uso de **Signals** para gestión de estado reactivo
- Implementación de **Computed Values** para valores derivados
- Aplicación de la nueva **sintaxis de control flow** (`@if`, `@for`, `@switch`)
- Buenas prácticas en diseño de componentes de formulario

---

## Recomendaciones para Profundizar

- Investiga sobre FormControl avanzados y custom validators
- Explora la gestión de estado con **Signals** avanzados
- Practica con validación de cross-field
- Estudia patrones de manejo de errores robusto
- Implementa pruebas unitarias para formularios
- Considera la accesibilidad (WCAG) en tus formularios
- Explora el nuevo sistema de **Signals-based Reactive Forms** (experimental en Angular 20)
- Investiga sobre **Resource API** para manejo de datos asíncronos

---

## Referencias

1. Syncfusion. (2024). Angular Template Driven vs. Reactive Forms.
   https://www.syncfusion.com/blogs/post/angular-template-driven-vs-reactive-forms

2. JavaScript in Plain English. (2024). Latest Angular Best Practices (20242025).
   https://javascript.plainenglish.io/latest-angular-best-practices-2024-2025-caa4e41cf0ab

3. Angular.dev (2025). Official Angular Documentation - Forms.
   https://angular.dev/guide/forms

4. Angular.dev (2025). Signals in Angular.
   https://angular.dev/guide/signals
