export type ActiviteFormData = {
  nom: string;
  description: string;
  prix: string;
  ville: string;
  departement: string;
  nbPersonnesMax: string;
  themeId: string;
  images: Array<Express.Multer.File>;
};

export type ActiviteDto = {
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
