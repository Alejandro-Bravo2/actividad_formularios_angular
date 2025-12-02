HTML:
```html
<div class="container">
    <h2>Gestor de Productos</h2>

    <form [formGroup]="productosForm" (ngSubmit)="onSubmit()">
        <!-- Campo Nombre -->
        <div class="form-group">
            <label for="nombre">Nombre del Producto:</label>
            <input type="text" id="nombre" formControlName="nombre" class="form-control" />

            <div
                    class="error"
                    *ngIf="productosForm.get('nombre')?.invalid && productosForm.get('nombre')?.touched"
            >
                <small *ngIf="productosForm.get('nombre')?.errors?.['required']"
                >El campo nombre es requerido</small
                >
                <small *ngIf="productosForm.get('nombre')?.errors?.['minlength']"
                >Mínimo 3 caracteres</small
                >
            </div>
        </div>

        <div class="form-group">
            <label for="descripcion">Descripción:</label>
            <textarea
                    id="descripcion"
                    formControlName="descripcion"
                    class="form-control"
                    rows="3"
            ></textarea>

            <div
                    class="error"
                    *ngIf="
          productosForm.get('descripcion')?.invalid && productosForm.get('descripcion')?.touched
        "
            >
                <small *ngIf="productosForm.get('descripcion')?.errors?.['required']"
                >La descripción es requerida</small
                >
                <small *ngIf="productosForm.get('descripcion')?.errors?.['maxlength']"
                >Máximo 200 caracteres</small
                >
            </div>
        </div>


        <div class="form-group">
            <label for="precio">Precio (€):</label>
            <input type="number" id="precio" formControlName="precio" class="form-control" step="0.01" />

            <div
                    class="error"
                    *ngIf="productosForm.get('precio')?.invalid && productosForm.get('precio')?.touched"
            >
                <small *ngIf="productosForm.get('precio')?.errors?.['required']"
                >El precio es requerido</small
                >
                <small *ngIf="productosForm.get('precio')?.errors?.['min']">Debe ser mayor a 0</small>
            </div>
        </div>

        <!-- Campo Cantidad -->
        <div class="form-group">
            <label for="cantidad">Cantidad:</label>
            <input type="number" id="cantidad" formControlName="cantidad" class="form-control" />

            <div
                    class="error"
                    *ngIf="productosForm.get('cantidad')?.invalid && productosForm.get('cantidad')?.touched"
            >
                <small *ngIf="productosForm.get('cantidad')?.errors?.['required']"
                >La cantidad es requerida</small
                >
                <small *ngIf="productosForm.get('cantidad')?.errors?.['min']">Mínimo 1</small>
            </div>
        </div>

        <div class="form-group">
            <label for="categoria">Categoría:</label>
            <select id="categoria" formControlName="categoria" class="form-control">
                <option value="">Selecciona una categoría</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Ropa">Ropa</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Otros">Otros</option>
            </select>

            <div
                    class="error"
                    *ngIf="productosForm.get('categoria')?.invalid && productosForm.get('categoria')?.touched"
            >
                <small *ngIf="productosForm.get('categoria')?.errors?.['required']"
                >La categoría es requerida</small
                >
            </div>
        </div>

        <button type="submit" [disabled]="productosForm.invalid">Agregar Producto</button>
    </form>

    <div *ngIf="productosRegistrados.length > 0">
        <h2>Productos Ingresados</h2>
        <table class="tabla-productos">
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Categoría</th>
            </tr>
            </thead>
            <tbody>
            <tr *ngFor="let producto of productosRegistrados">
                <td>{{ producto.nombre }}</td>
                <td>{{ producto.descripcion }}</td>
                <td>{{ producto.precio | currency : 'EUR' : 'symbol' : '1.2-2' }}</td>
                <td>{{ producto.cantidad }}</td>
                <td>{{ producto.categoria }}</td>
                <td>
                    <button (click)="eliminarProducto(producto.id)" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>
            </tbody>
        </table>

        <p class="total">
            <strong
            >Total del Inventario: {{ calcularTotal() | currency : 'EUR' : 'symbol' : '1.2-2' }}</strong
            >
        </p>
    </div>
</div>


```

Typescript:
```typescript
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

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
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class ProductosComponent {
  productosRegistrados: any[] = [];
  mensajeExito: string = 'Producto agregado exitosamente';
  productosForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productosForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      categoria: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.productosForm.valid) {
      const nuevoProducto = {
        id: this.productosRegistrados.length + 1,
        ...this.productosForm.value,
      };
      this.productosRegistrados.push(nuevoProducto);
      console.log('Productos:', this.productosRegistrados);
      this.productosForm.reset();
    } else {
      console.log('Formulario inválido');
    }
  }

  eliminarProducto(id: number) {
    this.productosRegistrados = this.productosRegistrados.filter((p) => p.id !== id);
  }

  calcularTotal(): number {
    return this.productosRegistrados.reduce((total, p) => total + p.precio * p.cantidad, 0);
  }
}

```