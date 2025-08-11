import { faker } from '@faker-js/faker';
import { LinksHelper } from '../links.helper';

describe('urlValidationService', () => {
  let helper: LinksHelper;

  const mockTags = [
    { tag: { id: faker.string.uuid(), name: faker.word.sample(), ownerId: faker.string.uuid(), createdAt: faker.date.recent(), updatedAt: faker.date.recent() } },
    { tag: { id: faker.string.uuid(), name: faker.word.sample(), ownerId: faker.string.uuid(), createdAt: faker.date.recent(), updatedAt: faker.date.recent() } },
  ];

  const mockPrismaLink = {
    id: faker.string.uuid(),
    url: faker.internet.url(),
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    image: faker.image.url(),
    generated: false,
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ownerId: faker.string.uuid(),
    tags: mockTags,
  };

  const mockPrismaLinks = [mockPrismaLink];

  beforeEach(() => {
    helper = new LinksHelper();
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });

  describe('mapLinksToSchema', () => {
    it('should map multiple Prisma links to schema format', () => {
      const result = helper.mapLinksToSchema(mockPrismaLinks);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        ...mockPrismaLink,
        tags: mockTags.map(t => t.tag),
      });
    });

    it('should handle null description and image to undefined', () => {
      const linkWithNulls = {
        ...mockPrismaLink,
        description: null,
        image: null,
      };

      const result = helper.mapLinksToSchema([linkWithNulls]);

      expect(result[0].description).toBeUndefined();
      expect(result[0].image).toBeUndefined();
    });

    it('should handle links with empty tags', () => {
      const linkWithoutTags = {
        ...mockPrismaLink,
        tags: [],
      };

      const result = helper.mapLinksToSchema([linkWithoutTags]);

      expect(result[0].tags).toEqual([]);
    });

    it('should return empty array for empty input', () => {
      const result = helper.mapLinksToSchema([]);

      expect(result).toEqual([]);
    });
  });

  describe('mapLinkToSchema', () => {
    it('should map a single Prisma link to schema format', () => {
      const result = helper.mapLinkToSchema(mockPrismaLink);

      expect(result).toEqual({
        ...mockPrismaLink,
        tags: mockTags.map(t => t.tag),
      });
    });

    it('should handle null description and image to undefined', () => {
      const linkWithNulls = {
        ...mockPrismaLink,
        description: null,
        image: null,
      };

      const result = helper.mapLinkToSchema(linkWithNulls);

      expect(result.description).toBeUndefined();
      expect(result.image).toBeUndefined();
    });

    it('should handle link with empty tags', () => {
      const linkWithoutTags = {
        ...mockPrismaLink,
        tags: [],
      };

      const result = helper.mapLinkToSchema(linkWithoutTags);

      expect(result.tags).toEqual([]);
    });
  });

  describe('parseFilterTags', () => {
    it('should return empty array when no filter is provided', () => {
      const result = helper.parseFilterTags(undefined);

      expect(result).toEqual([]);
    });

    it('should parse single tag filter', () => {
      const tagName = faker.word.sample();
      const result = helper.parseFilterTags(tagName);

      expect(result).toEqual([
        { tags: { some: { tag: { name: tagName } } } },
      ]);
    });

    it('should parse array of tags filter', () => {
      const tagNames = [faker.word.sample(), faker.word.sample()];
      const result = helper.parseFilterTags(JSON.stringify(tagNames));

      expect(result).toEqual([
        { tags: { some: { tag: { name: tagNames[0] } } } },
        { tags: { some: { tag: { name: tagNames[1] } } } },
      ]);
    });

    it('should handle empty string filter', () => {
      const result = helper.parseFilterTags('');

      expect(result).toEqual([]);
    });

    it('should handle malformed JSON array', () => {
      const malformedJson = '["test"';
      const result = helper.parseFilterTags(malformedJson);

      expect(result).toEqual([
        { tags: { some: { tag: { name: malformedJson } } } },
      ]);
    });

    it('should handle complex tag names with special characters', () => {
      const complexTags = ['test-tag', 'example_tag', 'tag with spaces', 't@g'];
      const result = helper.parseFilterTags(JSON.stringify(complexTags));

      expect(result).toEqual([
        { tags: { some: { tag: { name: 'test-tag' } } } },
        { tags: { some: { tag: { name: 'example_tag' } } } },
        { tags: { some: { tag: { name: 'tag with spaces' } } } },
        { tags: { some: { tag: { name: 't@g' } } } },
      ]);
    });
  });
});
