import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: 'yx23zch9', 
  dataset: 'production',  
  apiVersion: '2025-07-21', 
  useCdn: true, 
});
