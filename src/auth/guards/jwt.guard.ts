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
  const payload = await this.jwtService.verifyAsync(token);

  console.log("JWT OK:", payload);

  request.user = payload;

  return true;
} catch (error) {
  console.error("JWT ERROR:", error);
  throw error;
}

  }

}