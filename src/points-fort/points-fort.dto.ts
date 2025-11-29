export type PointsFortDto = {
  nom: string;
  activiteId?: string | null;
};

export type PointsFortOutput = PointsFortDto & {
  id: string;
  activiteId?: string | null;
};
