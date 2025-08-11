import { faker } from '@faker-js/faker';

export function generateTestLink() {
  const ownerId = faker.string.uuid();
  return {
    id: faker.string.uuid(),
    url: faker.internet.url(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    ownerId,
    tags: Array.from({ length: 2 }, () => ({ id: faker.string.uuid(), name: faker.word.sample() })),
    image: faker.image.url(),
    generated: faker.datatype.boolean(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
}

export function generateTestLinks(count: number) {
  return Array.from({ length: count }, () => generateTestLink());
}

export function generateTestLinkInput() {
  return {
    url: faker.internet.url(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    tags: Array.from({ length: 2 }, () => faker.word.sample()),
  };
}
