import type { ImageOutput } from 'src/images/images.dto';

export type PartenaireCreation = {
  nom: string;
  imageId?: string;
};

export type PartenaireOutput = {
  id: string;
  nom: string;
  image?: ImageOutput | null;
  createdAt: Date;
  updatedAt: Date;
};
