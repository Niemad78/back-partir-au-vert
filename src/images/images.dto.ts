export type ImageDto = {
  nom: string;
  themeId?: string;
  activiteId?: string;
  publicationId?: string;
  partenaireId?: string;
};

export type LinkImage = {
  activiteId?: string;
  themeId?: string;
  publicationId?: string;
  partenaireId?: string;
};

export type ImageOutput = {
  id: string;
  nom: string;
};
