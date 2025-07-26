import { createFilterQueryStringSchema } from '@lonestone/nzoth/server';
import { tagsSchema } from 'src/modules/tags/contracts/tags.contract';
import z from 'zod';

export const linkSchema = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  tags: tagsSchema.optional(),
  generated: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).openapi({
  title: 'LinkSchema',
  description: 'Schema for link item',
});

export type Link = z.infer<typeof linkSchema>;

export const linksSchema = z.array(linkSchema).openapi({
  title: 'LinksSchema',
  description: 'Schema for links',
});

export type Links = z.infer<typeof linksSchema>;

export const linksFilteringSchema = createFilterQueryStringSchema(['tags']);

export type LinksFiltering = z.infer<typeof linksFilteringSchema>;

export const createLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).openapi({
  title: 'CreateLinkSchema',
  description: 'Schema for create link item',
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export const updateLinkSchema = z.object({
  url: z.string().url().optional(),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).openapi({
  title: 'UpdateLinkSchema',
  description: 'Schema for update link item',
});

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
