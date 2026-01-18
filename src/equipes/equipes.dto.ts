import { ImageOutput } from 'src/images/images.dto';

export type EquipeCreation = {
  nom: string;
  description: string;
  imageId?: string;
};

export type EquipeService = {
  nom: string;
  description: string;
};

export type EquipeOutput = {
  id: string;
  nom: string;
  description: string;
  image?: ImageOutput | null;
};
