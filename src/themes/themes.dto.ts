export type ThemeDto = {
  nom: string;
};

export type ThemeOutput = ThemeDto & {
  id: string;
  image?: {
    id: string;
    nom: string;
  } | null;
};
