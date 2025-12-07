import { Routes } from '@angular/router';
import { Registro } from './registro/registro';
import { Productos } from './productos/productos';
import { Factura } from './factura/factura';
import { RegistroAvanzado } from './registro-avanzado/registro-avanzado';
import { PerfilUsuario } from './perfil-usuario/perfil-usuario';

export const routes: Routes = [
  { path: '', redirectTo: '/registro', pathMatch: 'full' },
  { path: 'registro', component: Registro },
  { path: 'productos', component: Productos },
  { path: 'factura', component: Factura },
  { path: 'registro-avanzado', component: RegistroAvanzado },
  { path: 'perfil-usuario', component: PerfilUsuario }
];
