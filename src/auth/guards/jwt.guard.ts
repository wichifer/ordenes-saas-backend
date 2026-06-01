import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request =
      context.switchToHttp().getRequest();

    const authHeader =
      request.headers.authorization;

    console.log(
      'AUTH HEADER =>',
      authHeader,
    );

    if (!authHeader) {

      throw new UnauthorizedException(
        'Token requerido',
      );

    }

    const token =
      authHeader.replace(
        'Bearer ',
        '',
      );

  console.log(
  'JWT SECRET =>',
  process.env.JWT_SECRET,
);

    try {
console.log(
  'JWT SERVICE =>',
  this.jwtService,
);
      const payload =
        await this.jwtService.verifyAsync(
          token,
        );

      console.log(
        'PAYLOAD =>',
        payload,
      );

      request.user = payload;

      return true;

    } catch (error) {

      console.log(
        'ERROR JWT =>',
        error,
      );

      throw new UnauthorizedException(
        'Token inválido',
      );

    }

  }

}