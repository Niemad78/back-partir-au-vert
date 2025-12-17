export type ImageDto = {
  nom: string;
  themeId?: string;
  activiteId?: string;
};

export type LinkImage = {
  activiteId?: string;
  themeId?: string;
};

export type ImageOutput = {
  id: string;
  nom: string;
};
