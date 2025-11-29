export type ThemeDto = {
  nom: string;
  imageId?: string;
};

export type ThemeService = {
  nom: string;
};

export type ThemeOutput = {
  id: string;
  nom: string;
  image?: {
    id: string;
    nom: string;
  } | null;
};
