// app/sanity.ts
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'yx23zch9', // ✅ Your actual Sanity project ID
  dataset: 'production',
  apiVersion: '2024-01-01', // ✅ A recent API version
  useCdn: true,
})
