import z from 'zod';

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
}).openapi({
  title: 'TagSchema',
  description: 'Schema for tag item',
});

export type Tag = z.infer<typeof tagSchema>;

export const tagsSchema = z.array(tagSchema).openapi({
  title: 'TagsSchema',
  description: 'Schema for tags',
});

export type Tags = z.infer<typeof tagsSchema>;

export const createTagsSchema = z.object({
  names: z.array(z.string().min(2)),
}).openapi({
  title: 'CreateTagsSchema',
  description: 'Schema for create tag item',
});

export type CreateTagsInput = z.infer<typeof createTagsSchema>;

export const updateTagSchema = z.object({
  name: z.string().min(2),
}).openapi({
  title: 'UpdateTagsSchema',
  description: 'Schema for update tag item',
});

export type UpdateTagInput = z.infer<typeof updateTagSchema>;
