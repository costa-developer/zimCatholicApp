export const getAllHymnsQuery = `*[_type == "hymn"] {
    _id,
    title,
    author,
    category,
    lyrics
  }`;
  