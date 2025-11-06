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
};
