export type Category = {
  id: string;
  name: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  thumbnail: string;
  description: string;
  link: string;
  categoryIds: string[];
  createdAt: string;
};

export type SiteSettings = {
  headerImageUrl: string;
};
