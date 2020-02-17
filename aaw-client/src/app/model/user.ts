export interface User {
  id: number;
  name: {
    first: string,
    last: string
  };
  email: string;
  rememberMe: boolean;
  username: string;
  password: string;
  type: string;
}
