# Guía de Implementación de Sequelize en AppMedicos

## Introducción

Este documento proporciona una guía sobre cómo se ha implementado Sequelize como ORM en el proyecto AppMedicos y ofrece consejos para continuar con el desarrollo.

## Estructura Implementada

Se han creado los siguientes componentes:

1. **Módulo de Base de Datos**: Configuración central de Sequelize
2. **Modelos**: Definición de entidades User y Appointment
3. **Integración con Módulos Existentes**: Actualización del servicio y controlador de usuarios

## Configuración de la Base de Datos

El archivo `src/database/database.module.ts` contiene la configuración principal de Sequelize:

```typescript
SequelizeModule.forRoot({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'appmedicos',
  models: [User, Appointment],
  autoLoadModels: true,
  synchronize: true,
})
```

**Importante**: Debes modificar los valores de conexión (host, puerto, usuario, contraseña) según tu entorno local.

## Modelos Implementados

### Usuario (User)

El modelo `User` define la estructura de la tabla de usuarios con campos básicos y una relación con las citas médicas.

### Cita (Appointment)

El modelo `Appointment` define la estructura de las citas médicas y establece una relación con el usuario.

## Cómo Continuar el Desarrollo

### 1. Crear un Módulo para Citas

Siguiendo el patrón implementado para usuarios, puedes crear un módulo completo para gestionar citas:

```bash
nest generate module appointments
nest generate controller appointments
nest generate service appointments
```

Luego implementa los métodos CRUD en el servicio utilizando el modelo Appointment.

### 2. Implementar Validación de Datos

Utiliza class-validator y class-transformer para validar los datos de entrada:

```bash
npm install class-validator class-transformer
```

Crea DTOs (Data Transfer Objects) para validar los datos de entrada:

```typescript
// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
```

### 3. Implementar Autenticación

Para añadir autenticación, puedes utilizar Passport y JWT:

```bash
npm install @nestjs/passport passport passport-local @nestjs/jwt passport-jwt
npm install -D @types/passport-local @types/passport-jwt
```

### 4. Mejorar las Relaciones entre Modelos

Puedes expandir las relaciones entre modelos añadiendo nuevas entidades como:

- Médicos (Doctors)
- Especialidades (Specialties)
- Historias Clínicas (MedicalRecords)

### 5. Implementar Migraciones

Para entornos de producción, es recomendable utilizar migraciones en lugar de `synchronize: true`:

```bash
npm install sequelize-cli
```

Crea un archivo `.sequelizerc` en la raíz del proyecto:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src/database/config', 'config.js'),
  'models-path': path.resolve('src/models'),
  'seeders-path': path.resolve('src/database/seeders'),
  'migrations-path': path.resolve('src/database/migrations')
};
```

## Consejos Adicionales

1. **Seguridad**: Nunca almacenes contraseñas en texto plano. Utiliza bcrypt para hashear las contraseñas.

2. **Variables de Entorno**: Mueve la configuración de la base de datos a variables de entorno utilizando el paquete `@nestjs/config`.

3. **Transacciones**: Utiliza transacciones para operaciones que involucren múltiples cambios en la base de datos.

4. **Logging**: Configura el logging de Sequelize para depurar consultas SQL durante el desarrollo.

5. **Índices**: Añade índices a las columnas frecuentemente consultadas para mejorar el rendimiento.

## Ejemplo de Consulta con Relaciones

Para obtener un usuario con sus citas:

```typescript
async getUserWithAppointments(id: number) {
  return this.userModel.findByPk(id, {
    include: [Appointment]
  });
}
```

## Conclusión

Sequelize proporciona una forma robusta de interactuar con la base de datos en tu aplicación NestJS. Esta implementación básica te permite comenzar a trabajar con modelos relacionales y expandir la funcionalidad según las necesidades de tu aplicación.