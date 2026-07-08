import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
  ) {}


  canActivate(
    context: ExecutionContext,
  ): boolean {

    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );


    // Si la ruta no tiene @Roles(), permite acceso
    if (!requiredRoles) {
      return true;
    }


    const request =
      context.switchToHttp().getRequest();


    const user = request.user;


    console.log('====== ROLES GUARD ======');
    console.log('USER:', user);
    console.log('REQUIRED ROLES:', requiredRoles);
console.log(
  "AUTORIZADO:",
  requiredRoles.includes(user.rol)
);

    // Si no hay usuario autenticado
    if (!user) {
      return false;
    }


    return requiredRoles.includes(user.rol);
  }
}