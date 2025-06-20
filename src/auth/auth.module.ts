import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; 
import { UserType } from 'src/user-type/entities/user-type.model';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    forwardRef(() => UsersModule), 
    PassportModule,
    TypeOrmModule.forFeature([UserType]), 
    JwtModule.register({
      secret: 'Santinoco123',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
  exports: [AuthService, JwtModule] // Agregar esta línea para exportar AuthService en el módulo AuthModule en app.module.ts
})
export class AuthModule {}
