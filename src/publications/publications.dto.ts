import { TypePublication } from '@prisma/client';
import { ImageOutput } from 'src/images/images.dto';

export type PublicationCreation = {
  titre: string;
  contenu: string;
  type: TypePublication;
};

export type PublicationModification = PublicationCreation;

export type PublicationAjoutImage = {
  imageIds?: string[];
};

export type PublicationOutput = {
  id: string;
  titre: string;
  contenu: string;
  type: TypePublication;
  images?: ImageOutput[];
};
