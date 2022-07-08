import { User } from '../../entities/User';
import { faker } from '@faker-js/faker';

export const getUser = (id?: number) => {
  const user = new User();
  user.id = id || faker.datatype.number({ min: 1 });
  user.email = 'test@test.com';
  user.password = 'testpassword';
  user.createdAt = new Date();
  user.updatedAt = new Date();
  return user;
};
