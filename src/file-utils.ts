import { diskStorage } from 'multer';
import { IMAGES } from './constants';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

export const storage = diskStorage({
  destination: (_, file, cb) => {
    cb(null, `${IMAGES}`);
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

type erreur = {
  code: string;
  message: string;
};

export const deleteFile = async (filename: string) => {
  const fullPath = join(IMAGES ?? '', filename);

  try {
    await fsPromises.unlink(fullPath);
  } catch (err: any) {
    const erreur = err as erreur;
    if (erreur.code === 'ENOENT') {
      return;
    }

    throw new Error(
      `Erreur lors de la suppression du fichier ${fullPath}: ${erreur.message}`,
    );
  }
};
