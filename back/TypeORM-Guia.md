# Guía de Implementación de TypeORM en AppMedicos

## Introducción

Este documento proporciona una guía sobre cómo implementar TypeORM como ORM en el proyecto AppMedicos y ofrece consejos para continuar con el desarrollo.

## Estructura Implementada

Se deben crear los siguientes componentes:

1. **Módulo de Base de Datos**: Configuración central de TypeORM
2. **Entidades**: Definición de entidades User y Appointment
3. **Integración con Módulos Existentes**: Actualización del servicio y controlador de usuarios

## Configuración de la Base de Datos

El archivo `src/database/database.module.ts` debe contener la configuración principal de TypeORM:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'password',
  database: 'appmedicos',
  entities: [User, Appointment],
  synchronize: true,
})
```

**Importante**: Debes modificar los valores de conexión (host, puerto, usuario, contraseña) según tu entorno local. Ten en cuenta que el puerto predeterminado para PostgreSQL es 5432, no 3306 (que es para MySQL).

## Entidades Implementadas

### Usuario (User)

La entidad `User` define la estructura de la tabla de usuarios con campos básicos y una relación con las citas médicas:

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Appointment, appointment => appointment.user)
  appointments: Appointment[];
}
```

### Cita (Appointment)

La entidad `Appointment` define la estructura de las citas médicas y establece una relación con el usuario:

```typescript
@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column()
  hora: string;

  @Column()
  motivo: string;

  @Column({ default: 'Pendiente' })
  estado: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.appointments)
  @JoinColumn({ name: 'userId' })
  user: User;
}
```

## Cómo Continuar el Desarrollo

### 1. Crear un Módulo para Citas

Siguiendo el patrón implementado para usuarios, puedes crear un módulo completo para gestionar citas:

```bash
nest generate module appointments
nest generate controller appointments
nest generate service appointments
```

Luego implementa los métodos CRUD en el servicio utilizando el repositorio de TypeORM:

```typescript
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  findOne(id: number): Promise<Appointment> {
    return this.appointmentRepository.findOne({ where: { id } });
  }

  create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(createAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  // Más métodos...
}
```

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

### 4. Mejorar las Relaciones entre Entidades

Puedes expandir las relaciones entre entidades añadiendo nuevas como:

- Médicos (Doctors)
- Especialidades (Specialties)
- Historias Clínicas (MedicalRecords)

Ejemplo de relación muchos a muchos con TypeORM:

```typescript
@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToMany(() => Specialty)
  @JoinTable()
  specialties: Specialty[];
}

@Entity()
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
}
```

### 5. Implementar Migraciones

Para entornos de producción, es recomendable utilizar migraciones en lugar de `synchronize: true`:

```bash
npm install typeorm-extension
```

Configura las migraciones en tu `package.json`:

```json
"scripts": {
  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
  "migration:generate": "npm run typeorm -- migration:generate -n",
  "migration:run": "npm run typeorm -- migration:run",
  "migration:revert": "npm run typeorm -- migration:revert"
}
```

Y actualiza tu configuración de TypeORM:

```typescript
TypeOrmModule.forRoot({
  // ... otras configuraciones
  synchronize: false, // Desactivar en producción
  migrationsRun: true, // Ejecutar migraciones automáticamente
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
})
```

## Consejos Adicionales

1. **Seguridad**: Nunca almacenes contraseñas en texto plano. Utiliza bcrypt para hashear las contraseñas.

2. **Variables de Entorno**: Mueve la configuración de la base de datos a variables de entorno utilizando el paquete `@nestjs/config`.

3. **Transacciones**: TypeORM proporciona un API de transacciones más intuitivo:

```typescript
await this.dataSource.transaction(async manager => {
  await manager.save(user);
  await manager.save(appointment);
});
```

4. **Logging**: Configura el logging de TypeORM para depurar consultas SQL durante el desarrollo:

```typescript
TypeOrmModule.forRoot({
  // ... otras configuraciones
  logging: true,
  logger: 'file', // 'advanced-console', 'simple-console', 'file', 'debug'
})
```

5. **Índices**: Añade índices a las columnas frecuentemente consultadas para mejorar el rendimiento:

```typescript
@Entity()
export class User {
  // ... otros campos
  
  @Index()
  @Column({ unique: true })
  email: string;
}
```

## Ejemplo de Consulta con Relaciones

Para obtener un usuario con sus citas:

```typescript
async getUserWithAppointments(id: number) {
  return this.userRepository.findOne({
    where: { id },
    relations: ['appointments']
  });
}
```

Para consultas más complejas, puedes utilizar QueryBuilder:

```typescript
async getUserWithAppointmentsAndDoctors(id: number) {
  return this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.appointments', 'appointment')
    .leftJoinAndSelect('appointment.doctor', 'doctor')
    .where('user.id = :id', { id })
    .getOne();
}
```

## Ventajas de TypeORM sobre Sequelize

1. **Mejor integración con TypeScript**: TypeORM está diseñado específicamente para TypeScript, lo que proporciona mejor inferencia de tipos y autocompletado.

2. **Decoradores más intuitivos**: Los decoradores de TypeORM son más descriptivos y fáciles de entender.

3. **API más limpia**: Las operaciones CRUD y las consultas son más intuitivas y requieren menos código.

4. **Soporte para múltiples bases de datos**: TypeORM soporta más bases de datos que Sequelize, incluyendo MongoDB.

5. **Migraciones más robustas**: El sistema de migraciones de TypeORM es más completo y fácil de usar.

## Conclusión

TypeORM proporciona una forma robusta y tipada de interactuar con la base de datos en tu aplicación NestJS. Esta implementación te permite trabajar con entidades relacionales de manera más intuitiva y expandir la funcionalidad según las necesidades de tu aplicación.
