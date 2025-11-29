export type ActiviteDto = {
  nom: string;
  description: string;
  prix: number;
  ville: string;
  departement: number;
  nbPersonnesMax: number;
  themeId: string;
  imageIds?: string[];
};

export type ActiviteService = {
  nom: string;
  description: string;
  prix: number;
  ville: string;
  departement: number;
  nbPersonnesMax: number;
  themeId: string;
};

export type ActiviteOutput = ActiviteDto & {
  id: string;
  images?: { id: string; nom: string }[];
};
