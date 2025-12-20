export type FaqOutput = {
  id: string;
  question: string;
  reponse: string;
};

export type FaqCreation = {
  question: string;
  reponse: string;
};

export type FaqModification = FaqCreation;
