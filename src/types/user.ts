export type AppUser = {
  uid: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  provider: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
