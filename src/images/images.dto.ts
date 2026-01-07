export type ImageDto = {
  nom: string;
  themeId?: string;
  activiteId?: string;
  publicationId?: string;
};

export type LinkImage = {
  activiteId?: string;
  themeId?: string;
  publicationId?: string;
};

export type ImageOutput = {
  id: string;
  nom: string;
};
