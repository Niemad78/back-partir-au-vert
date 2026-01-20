export type ImageDto = {
  nom: string;
  themeId?: string;
  activiteId?: string;
  publicationId?: string;
  partenaireId?: string;
  equipeId?: string;
  articleId?: string;
};

export type LinkImage = {
  activiteId?: string;
  themeId?: string;
  publicationId?: string;
  partenaireId?: string;
  equipeId?: string;
  articleId?: string;
};

export type ImageOutput = {
  id: string;
  nom: string;
};
