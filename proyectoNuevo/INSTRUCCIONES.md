# Actividades Prácticas: Formularios en Angular

Este proyecto contiene todas las actividades de formularios en Angular solicitadas.

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar el proyecto:
```bash
ng serve
```

3. Abrir en el navegador: http://localhost:4200

## Actividades Implementadas

### Actividad 1: Formulario Template-Driven - Registro de Usuario Básico
**Ruta:** `/registro`

Características:
- Formulario dirigido por plantilla con ngModel
- Validación bidireccional de datos
- Validadores HTML integrados (required, minlength, email)
- Mensajes de error personalizados
- Lista de usuarios registrados
- Validación de confirmación de contraseña

### Actividad 2: Formulario Reactivo - Gestión de Productos
**Ruta:** `/productos`

Características:
- FormBuilder para crear formularios
- Validadores síncronos (required, minLength, maxLength, min, max)
- Gestión de inventario de productos
- Tabla con lista de productos
- Función para eliminar productos
- Cálculo automático del total del inventario
- Formato de moneda en euros

### Actividad 3: Validadores Personalizados y FormArray - Factura
**Ruta:** `/factura`

Características:
- FormArray para detalles dinámicos
- Validador personalizado para número de factura (formato FAC-XXXXXX)
- Agregar y eliminar detalles de factura dinámicamente
- Cálculo de subtotal con descuentos
- Cálculo de IVA (21%)
- Cálculo de total
- Formato de fecha y moneda

### Actividad 4: Validación Asincrónica - Registro Avanzado
**Ruta:** `/registro-avanzado`

Características:
- Servicio de validadores asíncronos
- Validación de email único (simula llamada a API)
- Validación de username reservado (usernames que empiezan con "admin")
- Indicadores de carga durante validación
- Estados pendientes del formulario
- Validación de términos y condiciones
- Simulación de envío a servidor

### Actividad 5: FormGroup Anidados - Perfil de Usuario
**Ruta:** `/perfil-usuario`

Características:
- FormGroup anidado para información personal
- FormArray para múltiples direcciones
- Validación de patrones (teléfono, código postal)
- Cálculo automático de edad
- Selección de tipo de dirección
- Mínimo una dirección requerida
- Resumen dinámico del perfil
- Validación de grupos de formularios

## Conceptos Técnicos Cubiertos

1. **Template-Driven Forms**
   - ngModel
   - Referencias de template (#variable)
   - Validadores HTML

2. **Reactive Forms**
   - FormBuilder
   - FormGroup
   - FormControl
   - FormArray

3. **Validación**
   - Validadores síncronos integrados
   - Validadores personalizados síncronos
   - Validadores asíncronos
   - Validación de grupos

4. **Gestión de Estado**
   - Estados de formulario (valid, invalid, pending, touched, pristine)
   - Acceso programático a controles
   - Detección de cambios

5. **Buenas Prácticas**
   - Componentes standalone
   - CommonModule y ReactiveFormsModule
   - Separación de lógica y presentación
   - Mensajes de error personalizados
   - Estilos CSS modulares

## Estructura del Proyecto

```
src/app/
├── registro/               # Actividad 1
├── productos/              # Actividad 2
├── factura/                # Actividad 3
├── registro-avanzado/      # Actividad 4
├── perfil-usuario/         # Actividad 5
├── validators.ts           # Servicio de validadores asíncronos
└── app.routes.ts          # Configuración de rutas
```

## Navegación

El proyecto incluye un menú de navegación en la parte superior para acceder a cada actividad fácilmente.
