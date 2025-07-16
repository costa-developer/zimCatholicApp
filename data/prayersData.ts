// /data/prayersData.ts

export const prayerCategories = [
  {
    id: 'youth-guides',
    title: 'Youth & Guides Prayers',
    subcategories: [
      { id: 'sacred-heart-youth', title: 'Sacred Heart Youth Prayers' },
      { id: 'simon-peter-youth', title: 'Simon Peter Youth Prayers' },
      // add more subcategories here
    ],
  },
  {
    id: 'traditional',
    title: 'Traditional Prayers',
    subcategories: [
      { id: 'our-father', title: 'Our Father' },
      { id: 'hail-mary', title: 'Hail Mary' },
      // more traditional prayers here as subcategories or direct prayers list
    ],
  },
  {
    id: 'rosary',
    title: 'Rosary Prayers',
    subcategories: [
      { id: 'joyful-mysteries', title: 'Joyful Mysteries' },
      { id: 'sorrowful-mysteries', title: 'Sorrowful Mysteries' },
      { id: 'glorious-mysteries', title: 'Glorious Mysteries' },
      { id: 'luminous-mysteries', title: 'Luminous Mysteries' },
    ],
  },
  // ...other main categories
];
