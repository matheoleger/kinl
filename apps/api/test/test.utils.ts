import { faker } from '@faker-js/faker';
import { User } from 'prisma/generated/client';

export function generateTestUser(): User {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    refreshToken: faker.string.uuid(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function generateTestUsers(count: number): User[] {
  return Array.from({ length: count }, () => generateTestUser());
}
