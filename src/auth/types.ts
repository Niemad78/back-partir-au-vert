export type LoginProps = {
  body: {
    email: string;
    password: string;
  };
};

export type UserPayload = {
  userId: string;
};

export type User = {
  id: string;
  email: string;
  password: string;
};
