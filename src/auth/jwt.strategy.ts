import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {

    console.log(
      'JWT SECRET EN STRATEGY:',
      process.env.JWT_SECRET,
    );

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: process.env.JWT_SECRET!,
    });
  }


async validate(payload: any) {

  console.log('========== VALIDATE JWT ==========');
  console.log(payload);

  return {
    id_usuario: payload.id_usuario,
    email: payload.email,

    // estándar actual
    id_empresa: payload.id_empresa,

    // compatibilidad con módulos existentes
    empresa: payload.id_empresa,

    rol: payload.rol,
  };
}
}