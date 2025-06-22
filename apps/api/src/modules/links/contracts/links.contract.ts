import z from 'zod';

export const linkSchema = z.object({
  id: z.string(),
  url: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).openapi({
  title: 'LinkSchema',
  description: 'Schema for link item',
});

export type Link = z.infer<typeof linkSchema>;

export const linksSchema = z.array(linkSchema);

export type Links = z.infer<typeof linksSchema>;

export const createLinkSchema = z.object({
  url: z.string(),
}).openapi({
  title: 'CreateLinkSchema',
  description: 'Schema for create link item',
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
