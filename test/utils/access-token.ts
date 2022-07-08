import * as jwt from 'jsonwebtoken';
import { User } from '../../src/entities/User';

export class AccessToken {
  private _token: string;

  private constructor(user: User) {
    const payload = {
      id: user.id,
      agent: 'agent',
    };

    this._token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}h`,
    });
  }

  static of(user: User) {
    const token = new AccessToken(user);
    return token;
  }

  get bearerForm() {
    return `bearer ${this._token}`;
  }

  get authorizationHeaderForm() {
    return {
      Authorization: this.bearerForm,
    };
  }
}
