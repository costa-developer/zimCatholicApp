// schemas/schematypes/hymn.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'hymn',
  title: 'Hymn',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'Unknown',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Advent', value: 'advent' },
          { title: 'Ordinary Time', value: 'ordinary' },
          { title: 'Easter', value: 'easter' },
          { title: 'Christmas', value: 'christmas' },
          { title: 'Lent', value: 'lent' },
          { title: 'Pentecost', value: 'pentecost' },
        ],
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'lyrics',
      title: 'Lyrics',
      type: 'text',
      rows: 20,
      validation: (Rule) => Rule.required(),
    }),
  ],
});
