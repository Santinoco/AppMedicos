import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Auth header missing');
    const [, token] = authHeader.split(' ');
    try {
      const decoded = this.jwtService.verify(token); 
      request.user = decoded; // Adjunta el usuario al request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}