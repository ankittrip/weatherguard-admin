import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET as string,
//     });
//   }

//   async validate(payload: any) {
//     return {
//       userId: payload.sub,
//       email: payload.email,
//       status: payload.status,
//       name: payload.name,
//     };
//   }
// }


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    console.log('JWT_SECRET =', process.env.JWT_SECRET);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: any) {
    console.log('JWT PAYLOAD =', payload);

    return {
      userId: payload.sub,
      email: payload.email,
      status: payload.status,
      name: payload.name,
    };
  }
}