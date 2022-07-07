import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async createUser(user: User) {
    return this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();
  }

  async findUserByEmail(email: string) {
    return this.usersRepository
      .createQueryBuilder()
      .where('email = :email', { email })
      .getOne();
  }

  async addTokenToUser(userId: number, tokenId: string) {
    return this.usersRepository
      .createQueryBuilder()
      .relation(User, 'tokenList')
      .of(userId)
      .add(tokenId);
  }
}
