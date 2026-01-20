import { ImageOutput } from 'src/images/images.dto';
import { User } from 'src/users/types';

export type ArticleCreation = {
  titre: string;
  contenu: string;
  userId: string;
};

export type ArticleModification = ArticleCreation;

export type ArticleAjoutImage = {
  imageIds?: string[];
};

export type ArticleOutput = {
  id: string;
  titre: string;
  contenu: string;
  createdAt: Date;
  utilisateur?: User;
  images?: ImageOutput[];
};
