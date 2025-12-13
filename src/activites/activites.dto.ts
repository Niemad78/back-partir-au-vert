import { ImageOutput } from 'src/images/images.dto';
import { ThemeOutput } from 'src/themes/themes.dto';

export type ActiviteCreation = {
  nom: string;
  description: string;
  prix: number;
  ville: string;
  departement: number;
  nbPersonnesMax: number;
  themeId: string;
};

export type ActiviteModification = ActiviteCreation;

export type ActiviteAjoutImage = {
  imageIds?: string[];
};

export type ActiviteOutput = {
  id: string;
  nom: string;
  description: string;
  prix: number;
  ville: string;
  departement: number;
  nbPersonnesMax: number;
  theme: ThemeOutput;
  images?: ImageOutput[];
};
